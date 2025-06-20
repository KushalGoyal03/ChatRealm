/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import API_ENDPOINTS from "../../helpers/constants";
import "../styles/Sidebar.css";

const Sidebar = ({ selectedChat, setSelectedChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMenuChat, setSelectedMenuChat] = useState(null);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [renameChatName, setRenameChatName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error" | "info" | "warning"
  const [snackbarPosition, setSnackbarPosition] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const token = sessionStorage.getItem("token");
  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  const botChat = {
    _id: "bot-chat",
    chatName: "Chat with Bot",
    isBot: true,
  };

  const fetchChats = useCallback(async () => {
    if (!token || !currentUser?._id) return;

    try {
      const response = await fetch(API_ENDPOINTS.GET_CHATS, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        const sortedChats = (data || []).sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setChats(sortedChats);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  }, [token, currentUser?._id]);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 1000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!token) return;

      try {
        const response = await fetch(API_ENDPOINTS.GET_ALL_USERS, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setAllUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchAllUsers();
  }, [token]);

  const handleChatSelection = (chat) => {
    setChatSearchQuery("");
    setSelectedChat(chat);
  };

  const handleRenameChat = () => {
    if (!selectedMenuChat) return;
    setRenameChatName(selectedMenuChat.chatName);
    setOpenRenameDialog(true);
    setMenuAnchor(null);
  };

  const handleUpdateChatName = async () => {
    if (!renameChatName.trim() || !token || !currentUser?._id) return;

    try {
      const response = await fetch(
        API_ENDPOINTS.UPDATE_CHAT_NAME(selectedMenuChat._id),
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
            chat._id === selectedMenuChat._id
              ? {
                  ...chat,
                  customNames: {
                    ...chat.customNames,
                    [currentUser._id]: renameChatName,
                  },
                }
              : chat
          )
        );
        setOpenRenameDialog(false);
        await fetchChats();
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  const confirmDeleteChat = async () => {
    if (!token || !currentUser || !selectedMenuChat) return;

    try {
      const response = await fetch(
        API_ENDPOINTS.DELETE_CHAT(selectedMenuChat._id),
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        if (selectedChat?._id === selectedMenuChat._id) {
          setSelectedChat(null);
        }
        setSelectedMenuChat(null);
        setOpenConfirmDelete(false);
        fetchChats();
        showSnackbar("Chat deleted", "info");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      setOpenConfirmDelete(false);
    }
  };

  const handleUserSelection = async (user) => {
    const existingChat = chats.find((chat) =>
      chat.participants.some((p) => p._id === user._id)
    );

    if (existingChat) {
      setSelectedChat(existingChat);
      return;
    }

    if (!token || !currentUser) return;

    try {
      const response = await fetch(API_ENDPOINTS.CREATE_CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientEmail: user.email,
          customName: user.username || user.email,
        }),
      });

      const newChat = await response.json();
      if (response.ok) {
        setSelectedChat(newChat);
        await fetchChats();
        showSnackbar(
          `Chat with ${user.username || user.email} created`,
          "success"
        );
      } else {
        console.error("Failed to create new chat:", newChat.message);
      }
    } catch (err) {
      console.error("Error creating new chat:", err);
    }
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const getChatDisplayName = (chat) =>
    chat.customNames?.[currentUser._id] || chat.chatName || "Unnamed Chat";

  const showSnackbar = (
    message,
    severity = "success",
    position = { vertical: "top", horizontal: "center" }
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarPosition(position);
    setSnackbarOpen(true);
  };

  return (
    <div className="sidebar-container">
      <div className="chat-section-header">
        <h3 className="chat-section-title">Chats</h3>
      </div>

      <div className="chat-search-wrapper">
        <input
          type="text"
          placeholder="Search chats..."
          className="chat-search-bar"
          value={chatSearchQuery}
          onChange={(e) => setChatSearchQuery(e.target.value)}
        />
        {chatSearchQuery && (
          <button
            className="clear-search-btn"
            onClick={() => setChatSearchQuery("")}
          >
            ✕
          </button>
        )}
      </div>

      <div className="sidebar-scroll">
        {loading ? (
          <div className="loader">
            <CircularProgress size={24} />
          </div>
        ) : (
          <List className="chat-list">
            {!chatSearchQuery && (
              <ListItem
                className={`chat-item bot-chat-item ${
                  selectedChat?._id === "bot-chat" ? "active" : ""
                }`}
                onClick={() => handleChatSelection(botChat)}
                disablePadding
              >
                <ListItemAvatar>
                  <Avatar className="chat-avatar">🤖</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Chat with Bot"
                  primaryTypographyProps={{ className: "chat-title" }}
                />
              </ListItem>
            )}

            {chats.length === 0 && (
              <div className="no-chats">No chats available</div>
            )}

            {chats
              .filter((chat) =>
                getChatDisplayName(chat)
                  .toLowerCase()
                  .includes(chatSearchQuery.toLowerCase())
              )
              .map((chat) => (
                <ListItem
                  key={chat._id}
                  className={`chat-item fade-in ${
                    selectedChat?._id === chat._id ? "active" : ""
                  }`}
                  onClick={() => handleChatSelection(chat)}
                  disablePadding
                >
                  <ListItemAvatar>
                    <Avatar className="chat-avatar">
                      {getChatDisplayName(chat)?.charAt(0).toUpperCase() || "?"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={getChatDisplayName(chat)}
                    primaryTypographyProps={{ className: "chat-title" }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMenuChat(chat);
                      setMenuAnchor(e.currentTarget);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItem>
              ))}
          </List>
        )}
      </div>

      <button
        className="floating-new-chat"
        onClick={(e) => setUserMenuAnchor(e.currentTarget)}
      >
        +
      </button>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
        className="user-list-popup"
        MenuListProps={{ disablePadding: true }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <div style={{ padding: "0 12px" }}>
          <div className="user-list-heading">Available Users</div>
          <div className="user-search-wrapper">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="user-search-bar"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
            {userSearchQuery && (
              <button
                className="clear-user-search-btn"
                onClick={() => setUserSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div>
          {filteredUsers.length === 0 ? (
            <MenuItem disabled>No users found</MenuItem>
          ) : (
            filteredUsers.map((user) => (
              <MenuItem
                key={user._id}
                onClick={() => {
                  setUserMenuAnchor(null);
                  handleUserSelection(user);
                }}
              >
                {user.username}
                <span className="user-email-hint">({user.email})</span>
              </MenuItem>
            ))
          )}
        </div>
      </Menu>

      {/* Rename/Delete Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={handleRenameChat}>Rename Chat</MenuItem>
        <MenuItem
          onClick={() => {
            setOpenConfirmDelete(true); // open confirmation dialog
            setMenuAnchor(null); // close menu
          }}
          style={{ color: "red" }}
        >
          Delete Chat
        </MenuItem>
      </Menu>

      {/* Rename Dialog */}
      <Dialog
        open={openRenameDialog}
        onClose={() => setOpenRenameDialog(false)}
      >
        <DialogTitle>Rename Chat</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Chat Name"
            value={renameChatName}
            onChange={(e) => setRenameChatName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRenameDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateChatName}
            disabled={!renameChatName.trim()}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        classes={{ paper: "dialogPaper" }}
      >
        <DialogTitle>
          <div className="dialogTitleBox">
            <WarningAmberIcon className="warningIcon" />
            <Typography component="span" variant="h6">
              Confirm Delete
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent className="dialogContent">
          Are you sure you want to delete this chat?
        </DialogContent>
        <DialogActions className="dialogContent">
          <Button
            onClick={() => setOpenConfirmDelete(false)}
            className="buttonCancel"
          >
            Cancel
          </Button>
          <Button onClick={confirmDeleteChat} className="buttonLogout">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={snackbarPosition}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "12px" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Sidebar;
