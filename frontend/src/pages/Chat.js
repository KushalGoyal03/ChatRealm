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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [groups, setGroups] = useState([]);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState("");

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
    <Box display="flex" width="100vw" minHeight="82vh" margin="-20px">
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
        {/* Top Bar */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={1}
          sx={{ backgroundColor: "secondary.main" }}
        >
          <Avatar src="/profile.jpg" />
          <Box>
            <IconButton sx={{ color: "white" }}>
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Menu Buttons */}
        <Box p={2}>
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 1, backgroundColor: "#3c3f41" }}
            startIcon={<AddCircleIcon />}
            onClick={() => alert("New chat feature coming soon!")}
          >
            New Chat
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 1, backgroundColor: "#3c3f41" }}
            startIcon={<GroupAddIcon />}
            onClick={() => setOpenGroupDialog(true)}
          >
            Create Group
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#3c3f41" }}
            startIcon={<SmartToyIcon />}
            onClick={() => alert("Chat with bot coming soon!")}
          >
            Chat with Bot
          </Button>
        </Box>

        {/* Chat List */}
        <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
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
                <Avatar>{group.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={group.name} secondary="Last message..." />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Chat Area */}
      <Box flexGrow={1} display="flex" flexDirection="column">
        {/* Chat Header */}
        {selectedChat ? (
          <>
            <Box p={1} sx={{ backgroundColor: "#075e54", color: "white" }}>
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
                  borderRadius: "30px",
                  color: "primary",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
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
                variant="body2"
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
      <Dialog open={openGroupDialog} onClose={() => setOpenGroupDialog(false)}>
        <DialogTitle>Create a New Group</DialogTitle>
        <DialogContent>
          <TextField
            label="Group Name"
            fullWidth
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            label="Invite Users (comma-separated emails)"
            fullWidth
            margin="normal"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGroupDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateGroup} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
