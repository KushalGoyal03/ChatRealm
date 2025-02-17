import React, { useState } from "react";
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
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
//import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { InputAdornment } from "@mui/material";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [groups, setGroups] = useState([]);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState("");
  const [chats, setChats] = useState([]); // Store both groups & individual chats

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setSearchTerm("");
  };

  const handleSearch = () => {
    alert(`Searching for: ${searchTerm}`);
  };

  const handleCreateNewChat = () => {
    if (newChatEmail.trim() === "") return;

    // Create a new chat object
    const newChat = {
      id: Date.now(), // Temporary unique ID
      name: newChatEmail, // Use email as chat name
      type: "individual", // Mark it as a 1-on-1 chat
    };

    // Update chat list
    setChats([...chats, newChat]);

    // Close dialog
    setOpenNewChatDialog(false);
    setNewChatEmail(""); // Reset input field
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
    <Box display="flex" width="100vw" minHeight="82vh">
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
          {/* Three-line Menu Icon */}
          <IconButton sx={{ color: "primary.main" }} onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => setOpenNewChatDialog(true)}>
              <AddCircleIcon sx={{ mr: 1 }} /> New Chat
            </MenuItem>
            <MenuItem onClick={() => setOpenGroupDialog(true)}>
              <GroupAddIcon sx={{ mr: 1 }} /> Create Group
            </MenuItem>
            <MenuItem onClick={() => alert("Chat with bot coming soon!")}>
              <SmartToyIcon sx={{ mr: 1 }} /> Chat with Bot
            </MenuItem>
          </Menu>

          {/* Search Bar */}
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
              {groups.map((group) => (
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
                    <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
                      {group.name[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={group.name}
                    secondary="Last message..."
                  />
                </ListItem>
              ))}
              <Divider sx={{ my: 1, backgroundColor: "#3c3f41" }} />
            </>
          )}

          {/* Render Individual Chats */}
          <Typography
            variant="subtitle2"
            sx={{ color: "gray", px: 2, py: 1, fontWeight: "bold" }}
          >
            Private Chats
          </Typography>
          {["John Doe", "Jane Smith", "Alice Johnson", "Bob Williams"].map(
            (chat, index) => (
              <ListItem
                button
                key={`temp-${index}`}
                onClick={() =>
                  setSelectedChat({ id: `temp-${index}`, name: chat })
                }
                sx={{
                  borderBottom: "1px solid #3c3f41",
                  "&:hover": { backgroundColor: "#3c3f41" },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
                    {chat[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={chat} secondary="Last message..." />
              </ListItem>
            )
          )}
        </List>
      </Box>

      {/* Main Chat Area */}
      <Box flexGrow={1} display="flex" flexDirection="column">
        {/* Chat Header */}
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
              {/* Back Button */}
              <IconButton
                onClick={() => setSelectedChat(null)}
                sx={{ color: "white", mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                {selectedChat?.name[0] || "C"}
              </Avatar>
              <Typography variant="h6">{selectedChat.name}</Typography>
            </Box>

            {/* Chat Messages */}
            <Box flexGrow={1} p={2} sx={{ overflowY: "auto" }}>
              <Typography variant="body1" color="textSecondary">
                Chat messages will appear here...
              </Typography>
            </Box>

            {/* Chat Input */}
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
                sx={{
                  borderRadius: "15px",
                  color: "primary",
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
                  "& .MuiInputBase-input::placeholder": {
                    color: "primary.main", // Change to any color you like
                    opacity: 1, // Ensure the color is fully applied
                  },
                  "& .MuiInputBase-input": {
                    color: "blue", // Change text color
                  },
                }}
              />
              <IconButton color="primary">
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
            {/* ChatSphere Logo */}
            <img
              src="/logo.png" // Update the path if needed
              alt="ChatSphere Logo"
              style={{
                width: "50px", // Adjust size as needed
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

      <Dialog
        open={openNewChatDialog}
        onClose={() => setOpenNewChatDialog(false)}
      >
        <DialogTitle>Start a New Chat</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter User Email"
            fullWidth
            margin="normal"
            value={newChatEmail}
            onChange={(e) => setNewChatEmail(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "black" },
                "&:hover fieldset": { borderWidth: "2px" },
              },
              "& .MuiInputBase-input": { color: "blue" },
              "& .MuiInputLabel-root": { color: "primary.main" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewChatDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateNewChat} color="primary">
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
