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

          const toggleSearch = () => {
            setSearchOpen(!searchOpen);
            setSearchTerm("");
          };
        
          const handleSearch = () => {
            alert(`Searching for: ${searchTerm}`);
          };
        

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