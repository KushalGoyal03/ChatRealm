/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  CircularProgress,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import API_ENDPOINTS from "../../helpers/constants";

const Sidebar = ({ selectedChat, setSelectedChat }) => {
  const [chats, setChats] = useState([]);
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState("");
  const [newChatName, setNewChatName] = useState("");
  const [renameChatName, setRenameChatName] = useState("");
  const [renameChatId, setRenameChatId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMenuChat, setSelectedMenuChat] = useState(null);
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // "success", "error", "warning", "info"
  const navigate = useNavigate();

  // Function to show snackbar
  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user"); // Get user object
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Parse JSON
        setUsername(parsedUser.username || "User"); // Extract username
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const fetchChats = useCallback(async () => {
    let isMounted = true;
    const controller = new AbortController();

    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.GET_CHATS, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      const data = await response.json();

      if (!isMounted) return;

      if (response.ok) {
        setChats(data || []);
      } else if (response.status === 401) {
        showSnackbar("Unauthorized! Redirecting to login...", "error");
        sessionStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Error fetching chats:", data.message);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching chats:", error);
      }
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [navigate]); // Ensures fetchChats doesn't get recreated unnecessarily

  useEffect(() => {
    fetchChats();
  }, [fetchChats]); // Calls fetchChats when the component mounts

  const handleChatSelection = async (chat) => {
    setSelectedChat(chat);

    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(API_ENDPOINTS.MARK_MESSAGES_SEEN(chat._id), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to mark messages as seen");
        showSnackbar("Could not update message status. Try again.", "warning");
      }
    } catch (error) {
      console.error("Failed to mark messages as seen:", error);
      showSnackbar("Network error while marking messages as seen.", "error");
    }
  };

  const handleCreateNewChat = async () => {
    if (!newChatEmail.trim()) {
      showSnackbar("Please enter a valid email.", "error");
      return;
    }

    const existingChat = chats.find((chat) =>
      chat.participants.some((p) => p.email === newChatEmail)
    );

    if (existingChat) {
      showSnackbar(`You already have a chat with ${newChatEmail}.`, "error");
      setOpenNewChatDialog(false);
      return;
    }

    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");
    const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
    const loggedInUserId = loggedInUser?._id; // Extract userId

    if (!token || !loggedInUserId) return;

    try {
      const response = await fetch(API_ENDPOINTS.CREATE_CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientEmail: newChatEmail.trim(),
          customName: newChatName?.trim() || newChatEmail.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🚀 Ensure custom name is correctly applied immediately
        const updatedChat = {
          ...data,
          messages: [],
          customNames: {
            ...data.customNames,
            [loggedInUserId]: newChatName?.trim() || newChatEmail.trim(),
          },
        };

        setChats((prevChats) => [...prevChats, updatedChat]);
        setNewChatEmail("");
        setNewChatName("");
        setOpenNewChatDialog(false);
        await fetchChats();
      } else {
        showSnackbar("Failed to create chat. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      showSnackbar(
        "Something went wrong! Please check your connection.",
        "error"
      );
    }
  };

  // Handle opening chat menu
  const handleMenuOpen = (event, chat) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMenuChat(chat);
  };

  // Handle closing chat menu
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedMenuChat(null);
  };

  const handleMenuOpenProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuCloseProfile = () => {
    setAnchorEl(null);
  };

  // Handle opening rename dialog
  const handleRenameChat = () => {
    if (!selectedMenuChat) return;
    setRenameChatId(selectedMenuChat._id);
    setRenameChatName(selectedMenuChat.chatName);
    setOpenRenameDialog(true);
    handleMenuClose();
  };

  const handleCloseRenameDialog = () => {
    setRenameChatName(""); // Reset input
    setOpenRenameDialog(false);
  };

  const handleUpdateChatName = async () => {
    if (!renameChatName.trim()) return;

    const token = sessionStorage.getItem("token");
    if (!token) return;

    const storedUser = sessionStorage.getItem("user"); // Retrieve stored user data
    const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
    const loggedInUserId = loggedInUser?._id; // Extract userId

    if (!loggedInUserId) {
      console.error("❌ User ID not found in session storage.");
      return;
    }

    const userChat = chats.find((chat) => chat._id === renameChatId);

    if (!userChat || !userChat.participants) {
      console.error("❌ Chat or participants not found.");
      return;
    }

    // Convert participants to strings for accurate comparison
    const participantsAsString = userChat.participants.map((p) =>
      String(p._id)
    );

    if (!participantsAsString.includes(loggedInUserId)) {
      console.error("❌ User is not a participant of this chat.");
      return;
    }

    try {
      const response = await fetch(
        API_ENDPOINTS.UPDATE_CHAT_NAME(renameChatId),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ customName: renameChatName }),
        }
      );

      if (response.ok) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === renameChatId
              ? {
                  ...chat,
                  customNames: {
                    ...chat.customNames,
                    [loggedInUserId]: renameChatName,
                  },
                }
              : chat
          )
        );

        setOpenRenameDialog(false);
        await fetchChats();
      } else {
        showSnackbar("Failed to rename chat", "error");
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
      showSnackbar("Something went wrong!", "error");
    }
  };

  return (
    <Box
      display="flex"
      height="100%"
      width={isCollapsed ? "3.75%" : "25%"}
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
        <Box display="flex" flexDirection="column" gap={2}>
          <IconButton
            sx={{
              color: "white",
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
            onClick={() => setOpenNewChatDialog(true)}
          >
            <AddCircleIcon />
          </IconButton>
          <IconButton
            sx={{
              color: "white",
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
            onClick={() => showSnackbar("Coming Soon!", "info")}
          >
            <SmartToyIcon />
          </IconButton>
        </Box>

        {/* Profile Section */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <IconButton
            color="inherit"
            onClick={handleMenuOpenProfile}
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
              handleMenuCloseProfile();
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
                borderColor: "secondary.main",
              },
            }}
          >
            <MenuItem
              disabled
              sx={{
                fontWeight: "bold",
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
                sx={{ fontSize: 24, color: "secondary.main" }}
              />
              {username || "User"}
            </MenuItem>
            <MenuItem
              onClick={() => showSnackbar("Coming Soon!", "info")}
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
              onClick={() => showSnackbar("Coming Soon!", "info")}
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

      {/* Chat List */}
      <Box
        sx={{
          backgroundColor: "primary.light",
          color: "white",
          display: "flex",
          flexDirection: "column",
          width: isCollapsed ? "0px" : "85%",
          minWidth: isCollapsed ? "0px" : "280px", // Ensures visibility when expanded
          transform: isCollapsed ? "translateX(-100%)" : "translateX(0%)",
          opacity: isCollapsed ? 0 : 1,
          transition:
            "transform 0.4s ease-in-out, width 0.4s ease-in-out, opacity 0.3s ease-in-out",
          overflow: "hidden",
          boxShadow: isCollapsed ? "none" : "4px 0px 10px rgba(0, 0, 0, 0.1)", // Soft shadow when open
          borderRadius: "8px 0 0 8px", // Rounded corners on the left side
          padding: isCollapsed ? "0px" : "10px", // Smooth padding adjustment
        }}
      >
        <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100px"
              flexGrow={1}
            >
              <CircularProgress size={24} color="secondary" />
            </Box>
          ) : chats.length > 0 ? (
            chats.map((chat) => (
              <ListItem
                key={chat._id}
                chat={chat}
                onClick={() => handleChatSelection(chat)}
                sx={{
                  borderBottom: "1px solid #3c3f41",
                  "&:hover": { backgroundColor: "#3c3f41" },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
                    {chat.chatName
                      ? chat.chatName.charAt(0).toUpperCase()
                      : "?"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.chatName || "Unknown Chat"}
                  secondary={chat.lastMessage?.content}
                />
                <IconButton
                  size="small"
                  sx={{ color: "white" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, chat);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No chats available" />
            </ListItem>
          )}
        </List>
      </Box>

      {/* Chat Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "10px", // Rounded corners
            border: "2px solid #1976d2", // Custom border color
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)", // Soft shadow
            minWidth: "200px",
          },
          "& .MuiPaper-root:hover": {
            borderColor: "secondary.main",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleRenameChat();
          }}
        >
          Rename Chat
        </MenuItem>
      </Menu>

      <Dialog
        open={openNewChatDialog}
        onClose={() => setOpenNewChatDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px", // Rounded corners for a modern look
            padding: "20px",
            backgroundColor: "#ffffff", // Clean white background
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
            width: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.2rem",
            padding: "8px 12px",
            borderRadius: "6px",
          }}
        >
          Start a New Chat
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            marginTop: "10px",
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
            label="Enter User Email"
            value={newChatEmail}
            onChange={(e) => setNewChatEmail(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }} // Add margin to prevent overlap
            InputLabelProps={{
              sx: {
                fontSize: "1rem", // Adjust label size
                top: "2px", // Move label slightly up
              },
            }}
            InputProps={{
              sx: {
                borderRadius: "4px",
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <TextField
            fullWidth
            label="Enter Chat Name"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "4px",
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "space-between", padding: "12px 20px" }}
        >
          <Button
            onClick={() => setOpenNewChatDialog(false)}
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.1)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewChat}
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "secondary.main" },
            }}
          >
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Chat Dialog */}
      <Dialog
        open={openRenameDialog}
        onClose={handleCloseRenameDialog}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            width: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.2rem",
            padding: "8px 12px",
            borderRadius: "6px",
          }}
        >
          Rename Chat
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            marginTop: "10px",
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
            label="New Chat Name"
            value={renameChatName}
            onChange={(e) => setRenameChatName(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }} // Add margin to prevent overlap
            InputLabelProps={{
              sx: {
                fontSize: "1rem", // Adjust label size
                top: "2px", // Move label slightly up
              },
            }}
            InputProps={{
              sx: {
                borderRadius: "4px",
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{ justifyContent: "space-between", padding: "12px 20px" }}
        >
          <Button
            onClick={handleCloseRenameDialog}
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.1)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateChatName}
            variant="contained"
            disabled={!renameChatName.trim()}
            sx={{
              backgroundColor: renameChatName.trim() ? "primary.main" : "#ccc",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: renameChatName.trim()
                  ? "secondary.main"
                  : "#ccc",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000} // Extended duration for better readability
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Positioned to the top-right for better UX
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor:
              snackbarSeverity === "success"
                ? "#4caf50"
                : snackbarSeverity === "error"
                ? "#d32f2f"
                : "#1976d2",
            color: "white",
            fontWeight: "bold",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)", // Soft shadow for depth
            borderRadius: "8px", // Smooth rounded edges
            padding: "10px 16px",
            minWidth: "250px", // Prevents shrinking too much
          },
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled" // Uses filled variant for better contrast
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "1rem",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sidebar;
