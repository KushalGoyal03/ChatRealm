import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import GroupAddIcon from "@mui/icons-material/Group";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({}); // Store messages per chat
  const [currentMessage, setCurrentMessage] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState([]);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState("");

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleCreateNewChat = () => {
    if (!newChatEmail.trim()) return;

    const newChat = {
      id: Date.now(),
      name: newChatEmail,
      type: "individual",
    };

    setChats((prevChats) => [...prevChats, newChat]);
    setMessages((prevMessages) => ({ ...prevMessages, [newChat.id]: [] }));
    setOpenNewChatDialog(false);
    setNewChatEmail("");
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedChat) return;

    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedChat.id]: [
        ...(prevMessages[selectedChat.id] || []),
        currentMessage,
      ],
    }));
    setCurrentMessage("");
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setSearchTerm("");
  };

  const handleSearch = () => {
    alert(`Searching for: ${searchTerm}`);
  };

  const handleCreateGroup = () => {
    const newGroup = {
      id: groups.length + 1,
      name: groupName,
      members: emails.split(",").map((email) => email.trim()),
    };
    setGroups([...groups, newGroup]);
    setOpenGroupDialog(false);
    setGroupName("");
    setEmails("");
  };

  return (
    <Box
      display="flex"
      minWidth="100vw"
      minHeight="100vh"
      sx={{
        pt: 8.6, // Adjust for Navbar spacing
        pb: 7.4, // Adjust for Footer spacing
      }}
    >
      {/* Sidebar */}
      <Box
        width="30%"
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sidebar Top Bar */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={1}
          sx={{ backgroundColor: "secondary.main" }}
        >
          <IconButton sx={{ color: "primary.main" }} onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "primary",
                minWidth: 180,
              },
            }}
          >
            <MenuItem
              onClick={() => setOpenNewChatDialog(true)}
              sx={{
                "&:hover": {
                  backgroundColor: "secondary.main",
                  color: "primary.main",
                },
                py: 1,
                px: 2,
              }}
            >
              <AddCircleIcon sx={{ mr: 1, color: "secondary" }} /> New Chat
            </MenuItem>
            <MenuItem
              onClick={() => setOpenGroupDialog(true)}
              sx={{
                "&:hover": {
                  backgroundColor: "secondary.main",
                  color: "primary.main",
                },
                py: 1,
                px: 2,
              }}
            >
              <GroupAddIcon sx={{ mr: 1, color: "secondary" }} /> Create Group
            </MenuItem>
            <MenuItem
              onClick={() => alert("Chat with bot coming soon!")}
              sx={{
                "&:hover": {
                  backgroundColor: "secondary.main",
                  color: "primary.main",
                },
                py: 1,
                px: 2,
              }}
            >
              <SmartToyIcon sx={{ mr: 1, color: "secondary" }} /> Chat with Bot
            </MenuItem>
          </Menu>

          {searchOpen ? (
            <Box display="flex" alignItems="center" width="75%">
              <TextField
                autoFocus
                fullWidth
                size="small"
                placeholder="Search chats..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "15px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "primary.main",
                      borderWidth: "2px",
                      borderRadius: "15px",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "primary.main", // Change to any color you like
                    opacity: 1, // Ensure the color is fully applied
                  },
                  "& .MuiInputBase-input": {
                    color: "blue", // Change text color
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSearch}
                        sx={{ color: "black" }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton
                onClick={toggleSearch}
                sx={{
                  color: "primary.main",
                  ml: 1,
                  borderRadius: "50%",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    color: "red",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <IconButton
              sx={{ color: "primary.main", fontWeight: "bold" }}
              onClick={toggleSearch}
            >
              <SearchIcon />
            </IconButton>
          )}
        </Box>

        {/* Chat List */}
        <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
          {/* Render Group Chats */}
          {groups.length > 0 && (
            <>
              <Typography
                variant="subtitle2"
                sx={{ color: "gray", px: 2, py: 1, fontWeight: "bold" }}
              >
                Group Chats
              </Typography>
              {groups.map((group) => {
                const lastGroupMessages = messages[group.id] || [];
                const lastGroupMessageText =
                  lastGroupMessages.length > 0
                    ? lastGroupMessages[lastGroupMessages.length - 1]
                    : "No messages yet";

                return (
                  <ListItem
                    button
                    key={group.id}
                    onClick={() => setSelectedChat(group)}
                    sx={{
                      borderBottom: "1px solid #3c3f41",
                      "&:hover": { backgroundColor: "#3c3f41" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{ bgcolor: "secondary.main", color: "white" }}
                      >
                        {group.name[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={group.name}
                      secondary={lastGroupMessageText}
                    />
                  </ListItem>
                );
              })}
              <Divider sx={{ my: 1, backgroundColor: "#3c3f41" }} />
            </>
          )}

          {/* Render Private Chats */}
          {chats.length > 0 ? (
            chats.map((chat) => {
              let username = chat.name.includes("@")
                ? chat.name.split("@")[0]
                : chat.name;

              username = username
                .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
                .replace(/_/g, " ") // Replace underscores with spaces
                .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word

              // Get last message from messages object
              const lastMessages = messages[chat.id] || [];
              const lastMessageText =
                lastMessages.length > 0
                  ? lastMessages[lastMessages.length - 1]
                  : "No messages yet";

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
                      {username[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={username}
                    secondary={lastMessageText}
                  />
                </ListItem>
              );
            })
          ) : (
            <Typography
              variant="subtitle2"
              sx={{ color: "gray", px: 2, py: 2, textAlign: "center" }}
            >
              No chats yet. Start a new chat!
            </Typography>
          )}
        </List>
      </Box>

      {/* Main Chat Area */}
      <Box flexGrow={1} display="flex" flexDirection="column">
        {selectedChat ? (
          <>
            <Box
              display="flex"
              alignItems="center"
              p={1}
              sx={{
                backgroundColor: "#075e54",
                color: "white",
                borderBottom: "1px solid #3c3f41",
              }}
            >
              <IconButton
                onClick={() => setSelectedChat(null)}
                sx={{ color: "white", mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                {selectedChat?.name[0].toUpperCase()}
              </Avatar>
              <Typography variant="h6">
                {selectedChat?.name &&
                  (() => {
                    let username = selectedChat.name.includes("@")
                      ? selectedChat.name.split("@")[0]
                      : selectedChat.name;

                    return username
                      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
                      .replace(/_/g, " ") // Replace underscores with spaces
                      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
                  })()}
              </Typography>
            </Box>

            <Box flexGrow={1} p={2} sx={{ overflowY: "auto" }}>
              {messages[selectedChat.id]?.length > 0 ? (
                messages[selectedChat.id].map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: "primary.light",
                      padding: "10px",
                      borderRadius: "10px",
                      marginBottom: "10px",
                      maxWidth: "30%",
                      alignSelf: "flex-start",
                    }}
                  >
                    <Typography variant="body1">{msg}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  Start a conversation...
                </Typography>
              )}
            </Box>

            <Box
              display="flex"
              p={1}
              sx={{
                backgroundColor: "white",
                borderTop: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              <TextField
                fullWidth
                placeholder="Type a message..."
                variant="outlined"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                sx={{
                  borderRadius: "15px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "primary.main",
                      borderRadius: "15px",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputBase-input": { color: "blue" },
                }}
              />
              <IconButton color="primary" onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ backgroundColor: "white" }}
          >
            <img
              src="/images/logo.png"
              alt="ChatSphere Logo"
              style={{
                width: "50px",
                height: "auto",
                marginBottom: "20px",
                marginRight: "10px",
                borderRadius: "50%",
              }}
            />
            <Box textAlign="center">
              <Typography
                variant="h4"
                color="primary.main"
                sx={{ fontWeight: "bold" }}
              >
                Welcome to ChatSphere
              </Typography>
              <Typography
                variant="h6"
                color="primary.main"
                sx={{ fontWeight: "bold" }}
              >
                Select a chat to start messaging
              </Typography>
            </Box>
          </Box>
        )}
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
            borderRadius: "6px",
            marginBottom: "15px",
            width: "100%",
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
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "20rem",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "primary.main" },
                "&:hover fieldset": {
                  borderWidth: "2px",
                  borderColor: "primary.main",
                },
              },
              "& .MuiInputBase-input": { color: "primary.main" },
              "& .MuiInputLabel-root": { color: "primary.main" },
            }}
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
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "6px 16px",
            }}
          >
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Group Dialog */}
      <Dialog
        open={openGroupDialog}
        onClose={() => setOpenGroupDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "secondary.main",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            borderRadius: "6px",
          }}
        >
          Create a New Group
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Group Name"
            fullWidth
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "primary.main" },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                  borderWidth: "2px",
                },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
              "& .MuiInputLabel-root": {
                color: "primary.main",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "primary.main",
              },
              "& .MuiInputBase-input": {
                color: "primary.main",
              },
            }}
          />
          <TextField
            label="Invite Users (comma-separated emails)"
            fullWidth
            margin="normal"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "primary.main" },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                  borderWidth: "2px",
                },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
              "& .MuiInputLabel-root": {
                color: "primary.main",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "primary.main",
              },
              "& .MuiInputBase-input": {
                color: "primary.main",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
          <Button
            onClick={() => setOpenGroupDialog(false)}
            sx={{
              backgroundColor: "gray",
              color: "white",
              "&:hover": { backgroundColor: "darkgray" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": { backgroundColor: "primary.main", color: "yellow" },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
