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
              backgroundColor: "#1E1E2F", // Soft Black with a Blue Tint
              color: "#EAEAEA", // Soft White Text
              borderBottom: "2px solid #00FFFF", // Neon Cyan Border
              borderRadius: "10px 10px 0 0", // Smooth Rounded Top
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)", // Subtle Depth
            }}
          >
            {/* Back Button */}
            <IconButton
              onClick={() => setSelectedChat(null)}
              sx={{
                color: "#4682B4", // Soft Blue Accent
                mr: 1,
                transition: "color 0.2s ease-in-out",
                "&:hover": {
                  color: "#5A9BD5", // Lighter Blue on Hover
                },
              }}
              aria-label="Go back to chat list"
            >
              <ArrowBackIcon />
            </IconButton>

            {/* Chat Avatar */}
            <Avatar
              sx={{
                bgcolor: "#5A9BD5", // Soft Muted Blue
                mr: 2,
                width: 40,
                height: 40,
                fontSize: "1rem",
                fontWeight: "bold",
                boxShadow: "0px 2px 4px rgba(90, 155, 213, 0.3)", // Soft Avatar Depth
              }}
            >
              {selectedChat?.chatName?.trim()
                ? selectedChat.chatName.charAt(0).toUpperCase()
                : "?"}
            </Avatar>

            {/* Chat Name */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                flexGrow: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                color: "#F0F0F0", // Soft Grey for Better Readability
              }}
            >
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
                    {/* Date Separator - Modern Look */}
                    {showDateSeparator && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginY: "16px",
                        }}
                      >
                        <Box
                          sx={{
                            flexGrow: 1,
                            height: "1px",
                            backgroundColor: "#ccc",
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: "#f0f0f0",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            color: "#444",
                            fontSize: "0.75rem",
                            mx: "8px",
                          }}
                        >
                          {messageDate}
                        </Typography>
                        <Box
                          sx={{
                            flexGrow: 1,
                            height: "1px",
                            backgroundColor: "#ccc",
                          }}
                        />
                      </Box>
                    )}

                    {/* Chat Bubble */}
                    <Box
                      sx={{
                        padding: "8px 10px",
                        borderRadius: isLoggedInUser
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                        marginBottom: "20px",
                        maxWidth: "75%",
                        minWidth: "120px",
                        alignSelf: isLoggedInUser ? "flex-end" : "flex-start",
                        backgroundColor: isLoggedInUser ? "#0A84FF" : "#1C1C1E",
                        color: isLoggedInUser ? "#ffffff" : "#D3D3D3",

                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.8)",
                        backdropFilter: "blur(8px)", // Frosted glass effect
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                        position: "relative",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)", // Lifts on hover
                        },
                        animation: "floatBubble 3s ease-in-out infinite",
                        "@keyframes floatBubble": {
                          "0%": { transform: "translateY(0px)" },
                          "50%": { transform: "translateY(-3px)" },
                          "100%": { transform: "translateY(0px)" },
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          color: isLoggedInUser ? "#dfffd8" : "#444",
                          marginBottom: "4px",
                        }}
                      >
                        {senderName}
                      </Typography>

                      {/* Message Content */}
                      <Typography
                        variant="body2"
                        sx={{
                          wordWrap: "break-word",
                          lineHeight: 1.5,
                        }}
                      >
                        {msg.content}
                      </Typography>

                      {/* Timestamp */}
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          bottom: "-18px",
                          right: "8px",
                          fontSize: "0.75rem",
                          color: isLoggedInUser ? "#c8e6c9" : "#888",
                        }}
                      >
                        {messageTime}
                      </Typography>

                      {/* Seen Status */}
                      {!isLoggedInUser && msg.seen && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#1e88e5",
                            fontSize: "0.7rem",
                            textAlign: "right",
                            display: "block",
                            marginTop: "4px",
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
            sx={{
              backgroundColor: "#F8F9FA",
              borderTop: "1px solid #ddd",
              borderRadius: "0 0 12px 12px", // Slightly rounded at the bottom
              boxShadow: "0px -2px 6px rgba(0, 0, 0, 0.05)", // Soft top shadow
              input: { color: "primary.main" }, // Text color inside the input
              "& .MuiInputLabel-root": { color: "primary.main" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "primary.main" },
                "&:hover fieldset": {
                  borderColor: "primary.main", // Border color on hover
                  borderWidth: "2px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main", // Border color on hover
                  borderWidth: "2px",
                },
              },
            }}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "24px",
                  backgroundColor: "white",
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": {
                    borderColor: "#007AFF",
                    borderWidth: "2px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                    borderWidth: "2px",
                  },
                },
                input: { color: "#333", fontSize: "1rem" },
              }}
            />

            <IconButton
              sx={{
                color: currentMessage.trim() ? "#007AFF" : "#ccc",
                backgroundColor: currentMessage.trim()
                  ? "#E3F2FD"
                  : "transparent",
                marginLeft: "8px",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: currentMessage.trim()
                    ? "#BBDEFB"
                    : "transparent",
                  transform: "scale(1.1)",
                },
              }}
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
          sx={{
            backgroundColor: "#F4F6F", // Subtle bluish-gray for a clean UI
            textAlign: "center",
            padding: "20px",
          }}
        >
          {/* Logo with Soft Floating Effect */}
          <img
            src="/images/logo.png"
            alt="ChatSphere Logo"
            onError={(e) => (e.target.style.display = "none")} // Hide if image fails to load
            style={{
              width: "70px",
              height: "auto",
              marginBottom: "15px",
              borderRadius: "50%",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Light Floating Effect
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />

          {/* Welcome Text */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#0A84FF", // Light Blue for a Vibrant Look
              mb: 1,
              letterSpacing: "0.5px",
            }}
          >
            Welcome to ChatSphere
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "500",
              color: "white",
              maxWidth: "80%",
              opacity: 0.9, // Slight fade effect
            }}
          >
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatScreen;
