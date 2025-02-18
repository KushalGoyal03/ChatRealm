import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Chat = ({ userId }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch all chats of the user
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chats/messages/:${userId}`
        );
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    if (userId) {
      fetchChats();
    }
  }, [userId]);

  // Fetch messages when selecting a chat
  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/chats/messages/:${selectedChat._id}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    }
  }, [selectedChat]);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // const handleCreateNewChat = async () => {
  //   if (!newChatEmail.trim()) return;

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/chats/create",
  //       {
  //         userId1: userId,
  //         userId2: newChatEmail,
  //       }
  //     );

  //     setChats((prevChats) => [...prevChats, response.data]);
  //     setOpenNewChatDialog(false);
  //     setNewChatEmail("");
  //   } catch (error) {
  //     console.error("Error creating chat:", error);
  //   }
  // };

  // const handleCreateNewChat = async () => {
  //   if (!newChatEmail.trim()) return;

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/chats/create",
  //       {
  //         userId1: userId,
  //         userId2: newChatEmail,
  //       }
  //     );

  //     // Fetch updated chats from the backend after creating a new chat
  //     const updatedChats = await axios.get(
  //       `http://localhost:5000/api/chats/messages/${userId}`
  //     );

  //     setChats(updatedChats.data);
  //     setOpenNewChatDialog(false);
  //     setNewChatEmail(""); // Clear input field
  //   } catch (error) {
  //     console.error("Error creating chat:", error);
  //   }
  // };

  const handleCreateNewChat = async () => {
    if (!newChatEmail.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chats/create",
        {
          userId1: userId, // this should be the logged-in user's email
          userId2: newChatEmail, // this should be the email of the person you want to chat with
        }
      );

      setChats((prevChats) => [...prevChats, response.data]);
      setOpenNewChatDialog(false);
      setNewChatEmail("");
    } catch (error) {
      console.error(
        "Error creating chat:",
        error.response ? error.response.data : error
      );
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chats/messages/:",
        {
          chatId: selectedChat._id,
          senderId: userId,
          message: newMessage,
        }
      );

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
            <MenuItem onClick={() => alert("Chat with bot coming soon!")}>
              <SmartToyIcon sx={{ mr: 1 }} /> Chat with Bot
            </MenuItem>
          </Menu>
        </Box>

        {/* Chat List */}
        <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <ListItem
                button
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  borderBottom: "1px solid #3c3f41",
                  "&:hover": { backgroundColor: "#3c3f41" },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
                    {chat.users[1][0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.users[1]}
                  secondary="Last message..."
                />
              </ListItem>
            ))
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
                {selectedChat.users[1][0].toUpperCase()}
              </Avatar>
              <Typography variant="h6">{selectedChat.users[1]}</Typography>
            </Box>

            <Box flexGrow={1} p={2} sx={{ overflowY: "auto" }}>
              {messages.map((msg, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    backgroundColor:
                      msg.senderId === userId ? "lightblue" : "#f1f1f1",
                    padding: "8px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    alignSelf:
                      msg.senderId === userId ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.message}
                </Typography>
              ))}
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
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ borderRadius: "15px" }}
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
              src="/logo.png"
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
            borderRadius: "12px",
            padding: "16px",
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
            marginBottom: "20px",
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
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "black" },
                "&:hover fieldset": { borderWidth: "2px" },
              },
              "& .MuiInputBase-input": { color: "blue" },
              "& .MuiInputLabel-root": { color: "primary.main" },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "space-between", padding: "12px" }}
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
    </Box>
  );
};

export default Chat;

// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   IconButton,
// } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import SendIcon from "@mui/icons-material/Send";
// import MenuIcon from "@mui/icons-material/Menu";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// const Chat = () => {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
//   const [newChatEmail, setNewChatEmail] = useState("");
//   const [chats, setChats] = useState([]); // Store dynamically created chats

//   const handleMenuOpen = (event) => {
//     setMenuAnchor(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//   };

//   const handleCreateNewChat = () => {
//     if (!newChatEmail.trim()) return;

//     const newChat = {
//       id: Date.now(),
//       name: newChatEmail,
//       type: "individual",
//     };

//     setChats((prevChats) => [...prevChats, newChat]);

//     setOpenNewChatDialog(false);
//     setNewChatEmail("");
//   };

//   return (
//     <Box display="flex" width="100vw" minHeight="82vh">
//       {/* Sidebar */}
//       <Box
//         width="30%"
//         sx={{
//           backgroundColor: "primary.main",
//           color: "white",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Sidebar Top Bar */}
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           p={1}
//           sx={{ backgroundColor: "secondary.main" }}
//         >
//           <IconButton sx={{ color: "primary.main" }} onClick={handleMenuOpen}>
//             <MenuIcon />
//           </IconButton>

//           {/* Dropdown Menu */}
//           <Menu
//             anchorEl={menuAnchor}
//             open={Boolean(menuAnchor)}
//             onClose={handleMenuClose}
//           >
//             <MenuItem onClick={() => setOpenNewChatDialog(true)}>
//               <AddCircleIcon sx={{ mr: 1 }} /> New Chat
//             </MenuItem>
//             <MenuItem onClick={() => alert("Chat with bot coming soon!")}>
//               <SmartToyIcon sx={{ mr: 1 }} /> Chat with Bot
//             </MenuItem>
//           </Menu>
//         </Box>

//         {/* Chat List */}
//         <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
//           {chats.length > 0 ? (
//             chats.map((chat) => (
//               <ListItem
//                 button
//                 key={chat.id}
//                 onClick={() => setSelectedChat(chat)}
//                 sx={{
//                   borderBottom: "1px solid #3c3f41",
//                   "&:hover": { backgroundColor: "#3c3f41" },
//                 }}
//               >
//                 <ListItemAvatar>
//                   <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
//                     {chat.name[0].toUpperCase()}
//                   </Avatar>
//                 </ListItemAvatar>
//                 <ListItemText primary={chat.name} secondary="Last message..." />
//               </ListItem>
//             ))
//           ) : (
//             <Typography
//               variant="subtitle2"
//               sx={{ color: "gray", px: 2, py: 2, textAlign: "center" }}
//             >
//               No chats yet. Start a new chat!
//             </Typography>
//           )}
//         </List>
//       </Box>

//       {/* Main Chat Area */}
//       <Box flexGrow={1} display="flex" flexDirection="column">
//         {selectedChat ? (
//           <>
//             <Box
//               display="flex"
//               alignItems="center"
//               p={1}
//               sx={{
//                 backgroundColor: "#075e54",
//                 color: "white",
//                 borderBottom: "1px solid #3c3f41",
//               }}
//             >
//               <IconButton
//                 onClick={() => setSelectedChat(null)}
//                 sx={{ color: "white", mr: 1 }}
//               >
//                 <ArrowBackIcon />
//               </IconButton>
//               <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
//                 {selectedChat?.name[0].toUpperCase()}
//               </Avatar>
//               <Typography variant="h6">{selectedChat.name}</Typography>
//             </Box>

//             <Box flexGrow={1} p={2} sx={{ overflowY: "auto" }}>
//               <Typography variant="body1" color="textSecondary">
//                 Chat messages will appear here...
//               </Typography>
//             </Box>

//             <Box
//               display="flex"
//               p={1}
//               sx={{
//                 backgroundColor: "white",
//                 borderTop: "1px solid #ddd",
//                 borderRadius: "6px",
//               }}
//             >
//               <TextField
//                 fullWidth
//                 placeholder="Type a message..."
//                 variant="outlined"
//                 sx={{
//                   borderRadius: "15px",
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: "primary.main",
//                       borderRadius: "15px",
//                     },
//                     "&:hover fieldset": {
//                       borderColor: "primary.main",
//                       borderWidth: "2px",
//                     },
//                   },
//                   "& .MuiInputBase-input": { color: "blue" },
//                 }}
//               />
//               <IconButton color="primary">
//                 <SendIcon />
//               </IconButton>
//             </Box>
//           </>
//         ) : (
//           <Box
//             flexGrow={1}
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             sx={{ backgroundColor: "white" }}
//           >
//             <img
//               src="/logo.png"
//               alt="ChatSphere Logo"
//               style={{
//                 width: "50px",
//                 height: "auto",
//                 marginBottom: "20px",
//                 marginRight: "10px",
//                 borderRadius: "50%",
//               }}
//             />
//             <Box textAlign="center">
//               <Typography
//                 variant="h4"
//                 color="primary.main"
//                 sx={{ fontWeight: "bold" }}
//               >
//                 Welcome to ChatSphere
//               </Typography>
//               <Typography
//                 variant="h6"
//                 color="primary.main"
//                 sx={{ fontWeight: "bold" }}
//               >
//                 Select a chat to start messaging
//               </Typography>
//             </Box>
//           </Box>
//         )}
//       </Box>

//       {/* New Chat Dialog */}
//       <Dialog
//         open={openNewChatDialog}
//         onClose={() => setOpenNewChatDialog(false)}
//       >
//         <DialogTitle>Start a New Chat</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Enter User Email"
//             fullWidth
//             margin="normal"
//             value={newChatEmail}
//             onChange={(e) => setNewChatEmail(e.target.value)}
//             sx={{
//               backgroundColor: "white",
//               borderRadius: "8px",
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "black" },
//                 "&:hover fieldset": { borderWidth: "2px" },
//               },
//               "& .MuiInputBase-input": { color: "blue" },
//               "& .MuiInputLabel-root": { color: "primary.main" },
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenNewChatDialog(false)}>Cancel</Button>
//           <Button onClick={handleCreateNewChat} color="primary">
//             Start Chat
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Chat;
