/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import API_ENDPOINTS from "../../helpers/constants";

const Sidebar = ({ chats, setChats, selectedChat, setSelectedChat }) => {
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.PROFILE, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsername(data.username || "User");
        } else {
          console.error("Error fetching username:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsername();
  }, []);

  const handleCreateNewChat = () => {
    if (!newChatEmail.trim()) return;

    // Prevent duplicate chats
    if (chats.some((chat) => chat.name === newChatEmail)) {
      alert("Chat already exists!");
      return;
    }

    const newChat = {
      id: Date.now(),
      name: newChatEmail,
      type: "individual",
    };

    setChats((prevChats) => [...prevChats, newChat]);
    setOpenNewChatDialog(false);
    setNewChatEmail("");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      height="100%"
      width={isCollapsed ? "5%" : "25%"}
      sx={{ transition: "width 0.5s ease-in-out" }}
    >
      {/* Sidebar Left Section */}
      <Box
        width={isCollapsed ? "100%" : "15%"}
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          px: 1,
          transition: "width 0.5s ease-in-out",
        }}
      >
        {/* Top Icons */}
        <Box display="flex" flexDirection="column" gap={2}>
          <IconButton
            sx={{ color: "white" }}
            onClick={() => setOpenNewChatDialog(true)}
          >
            <AddCircleIcon />
          </IconButton>
          <IconButton
            sx={{ color: "white" }}
            onClick={() => alert("Chat with bot coming soon!")}
          >
            <SmartToyIcon />
          </IconButton>
        </Box>

        {/* Profile Section */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            disableRipple
            sx={{
              fontSize: 32,
              border: "2px solid transparent", // Ensures a smooth look
              borderRadius: "50%", // Makes it a perfect circle
              transition: "all 0.3s ease",
              "&:hover": {
                border: "2px solid rgba(255, 255, 255, 0.5)", // Subtle hover effect
                bgcolor: "rgba(255, 255, 255, 0.1)", // Light hover background
              },
              "&:active": {
                border: "2px solid rgba(255, 255, 255, 0.8)", // Active state border
              },
            }}
          >
            <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
              {username[0]?.toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => {
              handleMenuClose();
              setTimeout(() => anchorEl?.blur(), 0);
            }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "10px", // Rounded corners
                border: "2px solid #1976d2", // Custom border color
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)", // Soft shadow
                minWidth: "200px",
              },
              "& .MuiPaper-root:hover": {
                borderColor: "secondary.main", // Changes border to red on hover
              },
            }}
          >
            <MenuItem
              disabled
              sx={{
                fontWeight: "bold",
                //justifyContent: "center",
                color: "secondary.main", // Darker text for readability
                "&.Mui-disabled": {
                  opacity: 1, // Ensures text is fully visible even when disabled
                },
                display: "flex", // Ensures alignment
                alignItems: "center",
                gap: 1, // Space between icon and text
              }}
            >
              <AccountCircleIcon
                sx={{ fontSize: 30, color: "secondary.main" }}
              />
              {username || "User"}
            </MenuItem>
            <MenuItem
              onClick={() => alert("Under Construction.")}
              sx={{
                "&:hover": {
                  bgcolor: "secondary.main", // Background color on hover
                  color: "primary.main", // Text color on hover
                },
              }}
            >
              <EditIcon sx={{ mr: 1 }} /> Edit Profile
            </MenuItem>

            <MenuItem
              onClick={() => alert("Under Construction.")}
              sx={{
                color: "secondary.main",
                "&:hover": {
                  bgcolor: "secondary.main", // Background color on hover
                  color: "primary.main", // Text color on hover
                },
              }}
            >
              <InfoIcon sx={{ mr: 1 }} /> About
            </MenuItem>
          </Menu>

          {/* Collapse Button */}
          <IconButton
            sx={{ color: "white" }}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ArrowBackIosNewIcon
              sx={{ transform: isCollapsed ? "rotate(180deg)" : "none" }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* Right Sidebar (Collapsible Section) */}
      <Box
        sx={{
          backgroundColor: "primary.light",
          color: "white",
          display: "flex",
          flexDirection: "column",
          width: isCollapsed ? "0px" : "85%",
          transform: isCollapsed ? "translateX(-100%)" : "translateX(0%)",
          opacity: isCollapsed ? 0 : 1,
          transition:
            "transform 0.4s ease-in-out, width 0.4s ease-in-out, opacity 0.3s ease-in-out",
          overflow: "hidden",
        }}
      >
        {/* Chat Header */}
        <AppBar
          position="static"
          sx={{ backgroundColor: "primary.dark", boxShadow: "none" }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ fontWeight: "bold", pl: 2 }}>Chats</Box>
          </Toolbar>
        </AppBar>

        {/* Chat List */}
        <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
          {chats.length > 0 ? (
            chats.map((chat) => {
              let chatName = chat.name.includes("@")
                ? chat.name.split("@")[0]
                : chat.name;
              chatName = chatName
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());

              return (
                <ListItem
                  button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  sx={{
                    borderBottom: "1px solid #3c3f41",
                    "&:hover": { backgroundColor: "#3c3f41" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
                      {chatName[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chatName}
                    secondary="No messages yet"
                  />
                </ListItem>
              );
            })
          ) : (
            <Box sx={{ color: "gray", px: 2, py: 2, textAlign: "center" }}>
              No chats yet. Start a new chat!
            </Box>
          )}
        </List>
      </Box>

      {/* New Chat Dialog */}
      <Dialog
        open={openNewChatDialog}
        onClose={() => setOpenNewChatDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "6px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Start a New Chat
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter User Email"
            value={newChatEmail}
            onChange={(e) => setNewChatEmail(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "space-between", padding: "10px" }}
        >
          <Button
            onClick={() => setOpenNewChatDialog(false)}
            sx={{ color: "gray", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewChat}
            variant="contained"
            color="primary"
          >
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;

/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
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

const ChatScreen = ({ selectedChat, setSelectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found, cannot fetch messages.");
        setLoading(false);
        return;
      }

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
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedChat?._id) return;
    const token = sessionStorage.getItem("token");

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
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: { username: "You" }, content: data.content },
        ]);
        setCurrentMessage("");
      } else {
        console.error(
          "Error sending message:",
          data?.message || "Unexpected error"
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
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
            <IconButton
              onClick={() => setSelectedChat(null)}
              sx={{ color: "white", mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
              {selectedChat?.chatName?.[0]?.toUpperCase() ||
                selectedChat?.participants?.[0]?.username?.[0]?.toUpperCase() ||
                selectedChat?.participants?.[0]?.email?.[0]?.toUpperCase() ||
                "?"}
            </Avatar>
            <Typography variant="h6">
              {selectedChat?.chatName ||
                selectedChat?.participants?.[0]?.username ||
                selectedChat?.participants?.[0]?.email ||
                "Unknown"}
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
              messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    maxWidth: "60%",
                    alignSelf:
                      msg.sender?.username === "You"
                        ? "flex-end"
                        : "flex-start",
                    backgroundColor:
                      msg.sender?.username === "You" ? "#dcf8c6" : "#e5e5e5",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    {msg.sender?.username || "Unknown"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "primary.main" }}>
                    {msg.content}
                  </Typography>
                </Box>
              ))
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
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
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