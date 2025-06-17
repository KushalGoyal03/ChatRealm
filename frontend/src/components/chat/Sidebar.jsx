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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import API_ENDPOINTS from "../../helpers/constants";
import "../styles/Sidebar.css";

const Sidebar = ({ selectedChat, setSelectedChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMenuChat, setSelectedMenuChat] = useState(null);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [renameChatId, setRenameChatId] = useState(null);
  const [renameChatName, setRenameChatName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const botChat = {
    _id: "bot-chat",
    chatName: "Chat with Bot",
    isBot: true,
  };

  const fetchChats = useCallback(async () => {
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
      });

      const data = await response.json();

      if (response.ok) {
        const sortedChats = [...(data || [])].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setChats(sortedChats);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 2000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const token = sessionStorage.getItem("token");
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
  }, []);

  const handleChatSelection = async (chat) => {
    setChatSearchQuery("");
    setSelectedChat(chat);

    if (chat.isBot) return;

    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(API_ENDPOINTS.MARK_MESSAGES_SEEN(chat._id), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Failed to mark messages as seen:", error);
    }
  };

  const handleRenameChat = () => {
    if (!selectedMenuChat) return;
    setRenameChatId(selectedMenuChat._id);
    setRenameChatName(selectedMenuChat.chatName);
    setOpenRenameDialog(true);
    setMenuAnchor(null);
  };

  const handleUpdateChatName = async () => {
    if (!renameChatName.trim()) return;
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!token || !user?._id) return;

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
                    [user._id]: renameChatName,
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

  const handleUserSelection = async (user) => {
    const existingChat = chats.find((chat) =>
      chat.participants.some((p) => p._id === user._id)
    );

    if (existingChat) {
      setSelectedChat(existingChat);
      return;
    }

    const token = sessionStorage.getItem("token");
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
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
        setChats((prevChats) => [...prevChats, newChat]);
        setSelectedChat(newChat);
        await fetchChats();
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

            {chats
              .filter((chat) =>
                chat.chatName
                  ?.toLowerCase()
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
                      {chat.chatName?.charAt(0).toUpperCase() || "?"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.chatName || "Unknown Chat"}
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

            {chats.length === 0 && (
              <div className="no-chats">No chats available</div>
            )}
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
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
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
                {user.username}{" "}
                <span
                  style={{ fontSize: "0.8rem", color: "#888", marginLeft: 6 }}
                >
                  ({user.email})
                </span>
              </MenuItem>
            ))
          )}
        </div>
      </Menu>

      {/* Rename Chat Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={handleRenameChat}>Rename Chat</MenuItem>
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
    </div>
  );
};

export default Sidebar;
