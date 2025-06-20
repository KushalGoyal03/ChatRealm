/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
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
import "../styles/ChatScreen.css";
import { format, isSameYear, isToday, isYesterday } from "date-fns";
import { encrypt, decrypt } from "../../helpers/encryption";

const ChatScreen = ({ selectedChat, setSelectedChat, setChats }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastMessageIdRef = useRef(null);
  // const messagesEndRef = useRef(null);

  const loggedInUser = JSON.parse(sessionStorage.getItem("user")) || {};
  const token = sessionStorage.getItem("token");
  const pollingInterval = 1000;

  useEffect(() => {
    const container = document.querySelector(".chat-messages");
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      setShouldAutoScroll(atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessages();
      setShouldAutoScroll(true);
      const interval = setInterval(fetchMessages, pollingInterval);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!loading && messages.length && shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, loading, shouldAutoScroll]);

  const scrollToBottom = () => {
    const container = document.querySelector(".chat-messages");
    if (container) container.scrollTop = container.scrollHeight;
  };

  const fetchMessages = async () => {
    if (!token || !selectedChat?._id) return;
    try {
      const res = await fetch(API_ENDPOINTS.GET_MESSAGES(selectedChat._id), {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      if (!Array.isArray(data)) return;

      const latestMsgId = data[data.length - 1]?._id;

      if (
        data.length !== messages.length ||
        latestMsgId !== lastMessageIdRef.current
      ) {
        const decryptedMessages = data.map((msg) => ({
          ...msg,
          content: decrypt(msg.content),
        }));
        setMessages(decryptedMessages);

        lastMessageIdRef.current = latestMsgId;
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedChat?._id || !loggedInUser?._id)
      return;

    const encryptedText = encrypt(currentMessage.trim());

    try {
      const res = await fetch(API_ENDPOINTS.SEND_MESSAGE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          content: encryptedText,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.content) {
        const newMsg = {
          _id: crypto.randomUUID(),
          sender: { _id: loggedInUser._id, username: loggedInUser.username },
          content: currentMessage.trim(), // keep plain for UI
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMsg]);
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === selectedChat._id
              ? {
                  ...chat,
                  lastMessage: {
                    content: currentMessage.trim(),
                    senderId: loggedInUser._id,
                  },
                }
              : chat
          )
        );

        setCurrentMessage("");
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <Box
      flexGrow={1}
      display="flex"
      flexDirection="column"
      className="chat-screen chat-fade-slide"
    >
      {selectedChat?._id ? (
        <>
          {/* Header */}
          <Box className="chat-header">
            <IconButton
              onClick={() => setSelectedChat(null)}
              className="back-button"
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar className="chat-avatar">
              {selectedChat._id === "bot-chat"
                ? "🤖"
                : selectedChat?.chatName?.charAt(0).toUpperCase() ||
                  selectedChat?.customNames?.[loggedInUser._id]
                    ?.charAt(0)
                    .toUpperCase() ||
                  "?"}
            </Avatar>
            <Typography className="chat-name" variant="subtitle1">
              {selectedChat?.chatName ||
                selectedChat?.customNames?.[loggedInUser._id] ||
                "Unnamed Chat"}
            </Typography>
          </Box>

          {/* Chat Body */}
          {selectedChat._id === "bot-chat" ? (
            <Box className="chat-messages bot-chat-placeholder">
              <Typography variant="h6" className="bot-placeholder-text">
                🤖 Chat with Bot is under construction!
              </Typography>
              <Typography variant="body2" className="bot-placeholder-subtext">
                We’re building something awesome here. Stay tuned!
              </Typography>
            </Box>
          ) : (
            <>
              <Box className="chat-messages">
                {loading ? (
                  <Box className="loading-spinner">
                    <CircularProgress size={24} />
                  </Box>
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isUser = msg.sender?._id === loggedInUser._id;
                    const senderName = isUser
                      ? "You"
                      : selectedChat?.chatName ||
                        selectedChat?.customNames?.[msg.sender?._id] ||
                        msg.sender?.username ||
                        "Unnamed";

                    const createdAt = new Date(msg.createdAt);
                    const prevCreatedAt =
                      index > 0
                        ? new Date(messages[index - 1].createdAt)
                        : null;
                    const showDate =
                      !prevCreatedAt ||
                      createdAt.toDateString() !== prevCreatedAt.toDateString();

                    let formattedDate = "";
                    if (isToday(createdAt)) {
                      formattedDate = "Today";
                    } else if (isYesterday(createdAt)) {
                      formattedDate = "Yesterday";
                    } else {
                      formattedDate = format(
                        createdAt,
                        !prevCreatedAt || !isSameYear(createdAt, prevCreatedAt)
                          ? "d MMM yyyy"
                          : "d MMM"
                      );
                    }

                    const messageTime = createdAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });

                    return (
                      <React.Fragment key={msg._id || index}>
                        {showDate && (
                          <Box className="date-separator">
                            <Typography className="date-text">
                              {formattedDate}
                            </Typography>
                          </Box>
                        )}
                        <Box
                          className={`chat-bubble ${isUser ? "you" : "other"}`}
                        >
                          <Typography className="sender-name">
                            {senderName}
                          </Typography>
                          <Typography className="message-text">
                            {msg.content}
                          </Typography>
                          <Typography className="timestamp">
                            {messageTime}
                          </Typography>
                        </Box>
                      </React.Fragment>
                    );
                  })
                ) : (
                  <Typography className="no-messages">
                    Start a conversation...
                  </Typography>
                )}
              </Box>

              {/* Input Bar */}
              <Box className="message-input-bar">
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  variant="outlined"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="message-input"
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className={`send-button ${
                    currentMessage.trim() ? "active" : "disabled"
                  }`}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          )}
        </>
      ) : (
        <Box className="welcome-screen" />
      )}
    </Box>
  );
};

export default ChatScreen;
