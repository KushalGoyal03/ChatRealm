/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import React from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import API_ENDPOINTS from "../../helpers/constants";

const socket = io("http://localhost:5000", { withCredentials: true });

const ChatScreen = ({ selectedChat, setSelectedChat, setChats }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when selectedChat changes
    if (selectedChat) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Small delay to ensure rendering is done
    }
  }, [selectedChat]); // Run when chat is opened

  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          API_ENDPOINTS.GET_MESSAGES(selectedChat._id),
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);

        // Mark messages as seen
        socket.emit("message-seen", { chatId: selectedChat._id });
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // WebSocket Listener for New Messages
    const handleNewMessage = (newMessage) => {
      if (newMessage.chatId === selectedChat._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Mark as seen when message is received
        socket.emit("message-seen", { chatId: selectedChat._id });
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage); // Cleanup WebSocket listener
    };
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedChat?._id) return;

    const token = sessionStorage.getItem("token");
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    if (!loggedInUser || !loggedInUser._id) {
      console.error("❌ User not found in session storage.");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.SEND_MESSAGE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          content: currentMessage.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data?.content) {
        const newMsg = {
          _id: Date.now(), // Temporary ID before backend response
          sender: {
            _id: loggedInUser._id,
            username: loggedInUser.username,
          },
          content: data.content,
          createdAt: new Date().toISOString(),
          seen: false,
        };

        // ✅ Ensure the chat name is correctly used
        const chatDisplayName =
          selectedChat.customNames?.[loggedInUser._id] ||
          selectedChat.chatName ||
          "Unknown Chat";

        // ✅ Update messages in state immediately
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...newMsg, receiverName: chatDisplayName },
        ]);

        // ✅ Update latest message in Sidebar chat list immediately
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? {
                  ...chat,
                  lastMessage: {
                    content: data.content,
                    senderId: loggedInUser._id,
                  },
                }
              : chat
          )
        );

        // ✅ Emit message via WebSocket
        socket.emit("send-message", {
          chatId: selectedChat._id,
          message: { ...data, sender: newMsg.sender },
        });

        setCurrentMessage(""); // Clear input field

        // ✅ Ensure scrolling works correctly
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection="column">
      {selectedChat?._id ? (
        <>
          {/* Chat Header */}
          <Box
            display="flex"
            alignItems="center"
            p={1.5}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderBottom: "2px solid #ddd",
            }}
          >
            {/* Back Button */}
            <IconButton
              onClick={() => setSelectedChat(null)}
              sx={{ color: "white", mr: 1 }}
              aria-label="Go back to chat list"
            >
              <ArrowBackIcon />
            </IconButton>

            {/* Chat Avatar */}
            <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
              {selectedChat?.chatName?.trim()
                ? selectedChat.chatName.charAt(0).toUpperCase()
                : "?"}
            </Avatar>

            {/* Chat Name */}
            <Typography variant="h6">
              {selectedChat?.chatName?.trim() || "Unknown Chat"}
            </Typography>
          </Box>

          {/* Messages Display */}
          <Box
            flexGrow={1}
            p={2}
            sx={{ overflowY: "auto", display: "flex", flexDirection: "column" }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress size={24} />
              </Box>
            ) : messages.length > 0 ? (
              messages.map((msg, index) => {
                const loggedInUser =
                  JSON.parse(sessionStorage.getItem("user")) || {};

                const isLoggedInUser =
                  String(msg.sender?._id) === String(loggedInUser._id);

                const senderName = isLoggedInUser
                  ? "You"
                  : selectedChat?.chatName ||
                    selectedChat?.customNames?.[String(msg.sender?._id)] ||
                    msg.sender?.username ||
                    "Unknown";

                const messageTime = msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "Time not available";

                // Date separator logic
                const messageDate = new Date(
                  msg.createdAt
                ).toLocaleDateString();
                const prevMessageDate =
                  index > 0
                    ? new Date(
                        messages[index - 1].createdAt
                      ).toLocaleDateString()
                    : null;
                const showDateSeparator = messageDate !== prevMessageDate;

                return (
                  <React.Fragment key={index}>
                    {showDateSeparator && (
                      <Typography
                        variant="caption"
                        sx={{
                          textAlign: "center",
                          display: "block",
                          fontWeight: "bold",
                          marginY: "10px",
                          color: "#666",
                        }}
                      >
                        {messageDate}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        padding: "10px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                        maxWidth: "60%",
                        alignSelf: isLoggedInUser ? "flex-end" : "flex-start",
                        backgroundColor: isLoggedInUser ? "#dcf8c6" : "#e5e5e5",
                        position: "relative",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {senderName}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "#333", wordWrap: "break-word" }}
                      >
                        {msg.content}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          bottom: "-15px",
                          right: "5px",
                          fontSize: "0.7rem",
                          color: isLoggedInUser ? "green" : "gray",
                        }}
                      >
                        {messageTime}
                      </Typography>

                      {!isLoggedInUser && msg.seen && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "blue",
                            fontSize: "0.7rem",
                            textAlign: "right",
                          }}
                        >
                          Seen
                        </Typography>
                      )}
                    </Box>
                  </React.Fragment>
                );
              })
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ textAlign: "center", mt: 3 }}
              >
                Start a conversation...
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Message Input */}
          <Box
            display="flex"
            alignItems="center"
            p={1}
            sx={{ backgroundColor: "white", borderTop: "1px solid #ddd" }}
          >
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevents accidental line breaks
                  if (currentMessage.trim()) {
                    handleSendMessage();
                  }
                }
              }}
              aria-label="Type a message"
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!currentMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </>
      ) : (
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: "#f5f5f5" }}
        >
          <img
            src="/images/logo.png"
            alt="ChatSphere Logo"
            onError={(e) => (e.target.style.display = "none")} // Hide if image fails to load
            style={{
              width: "60px",
              height: "auto",
              marginBottom: "15px",
              borderRadius: "50%",
            }}
          />
          <Typography
            variant="h4"
            color="primary.main"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Welcome to ChatSphere
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ fontWeight: "bold" }}
          >
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatScreen;
