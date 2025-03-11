/* eslint-disable no-undef */
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
import MenuIcon from "@mui/icons-material/Menu";
import GroupAddIcon from "@mui/icons-material/Group";

const Chat = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({}); // Store messages per chat
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
            onClose={() => {
              handleMenuClose();
              setTimeout(() => menuAnchor?.blur(), 0);
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
          />
          <TextField
            label="Invite Users (comma-separated emails)"
            fullWidth
            margin="normal"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
          <Button onClick={() => setOpenGroupDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateGroup}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
