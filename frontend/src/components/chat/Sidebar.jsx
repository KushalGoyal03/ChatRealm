/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchChats = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        console.log("Fetching chats from:", API_ENDPOINTS.GET_CHATS);
        console.log("Token:", token);

        const response = await fetch(API_ENDPOINTS.GET_CHATS, {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal, // Attach abort signal
        });

        const data = await response.json();
        console.log("Fetched chats data:", data);

        if (response.ok && isMounted) {
          setChats(data || []);
        } else if (response.status === 401 && isMounted) {
          console.warn("Unauthorized! Redirecting to login...");
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
    };

    fetchChats();

    return () => {
      isMounted = false;
      controller.abort(); // Cancel request on unmount
    };
  }, []);

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
        alert("Could not update message status. Try again.");
      }
    } catch (error) {
      console.error("Failed to mark messages as seen:", error);
      alert("Network error while marking messages as seen.");
    }
  };

  const handleCreateNewChat = async () => {
    if (!newChatEmail.trim()) {
      alert("Please enter a valid email.");
      return;
    }

    const existingChat = chats.find((chat) =>
      chat.participants.some((p) => p.email === newChatEmail)
    );

    if (existingChat) {
      alert(`You already have a chat with ${newChatEmail}.`);
      setSelectedChat(existingChat);
      setOpenNewChatDialog(false);
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) return;

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
        setChats((prevChats) => [...prevChats, { ...data, messages: [] }]);
        setSelectedChat(data);
        setNewChatEmail("");
        setNewChatName("");
        setOpenNewChatDialog(false);
      } else {
        alert(data.message || "Failed to create chat. Please try again.");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Something went wrong! Please check your connection.");
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

    const loggedInUserEmail = sessionStorage.getItem("userEmail"); // Get logged-in user email

    console.log("Logged-in User Email:", loggedInUserEmail);

    // Find the chat the user wants to rename
    const userChat = chats.find((chat) => chat._id === renameChatId);

    if (!userChat || !userChat.participants) {
      console.error("Chat or participants not found.");
      return;
    }

    console.log("Chat Participants:", userChat.participants);

    // Find the corresponding userId based on email
    const userParticipant = userChat.participants.find(
      (p) => p.email === loggedInUserEmail
    );
    const userIdKey = userParticipant?._id; // This will be used as the key for customNames

    if (!userIdKey) {
      console.error("User ID not found for the logged-in email.");
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
                    [userIdKey]: renameChatName,
                  },
                }
              : chat
          )
        );
        setOpenRenameDialog(false);
      } else {
        alert("Failed to rename chat");
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
      alert("Something went wrong!");
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
        <IconButton
          sx={{ color: "white" }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ArrowBackIosNewIcon
            sx={{ transform: isCollapsed ? "rotate(180deg)" : "none" }}
          />
        </IconButton>
      </Box>

      {/* Chat List */}
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
                  secondary={chat.messages?.[0]?.content || "No messages yet"}
                />
                <IconButton
                  size="small"
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
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Enter Chat Name "
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewChatDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateNewChat} variant="contained">
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Chat Dialog */}
      <Dialog open={openRenameDialog} onClose={handleCloseRenameDialog}>
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
          <Button onClick={handleCloseRenameDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateChatName}
            variant="contained"
            disabled={!renameChatName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;

// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import {
//   Box,
//   Avatar,
//   IconButton,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   CircularProgress,
// } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import API_ENDPOINTS from "../../helpers/constants";

// const Sidebar = ({ selectedChat, setSelectedChat }) => {
//   const [chats, setChats] = useState([]);
//   const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
//   const [newChatEmail, setNewChatEmail] = useState("");
//   const [newChatName, setNewChatName] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch all user chats
//   useEffect(() => {
//     const fetchChats = async () => {
//       const token = sessionStorage.getItem("token");
//       if (!token) return;

//       try {
//         const response = await fetch(API_ENDPOINTS.GET_CHATS, {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setChats(data || []);
//         } else {
//           console.error("Error fetching chats:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching chats:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChats();
//   }, []);

//   const handleCreateNewChat = async () => {
//     if (!newChatEmail.trim()) return;

//     // Check if chat already exists
//     const existingChat = chats.find((chat) =>
//       chat.participants.some((p) => p.email === newChatEmail)
//     );

//     if (existingChat) {
//       alert("Chat with this user already exists!");
//       setSelectedChat(existingChat); // Open the existing chat
//       setOpenNewChatDialog(false);
//       return;
//     }

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       console.error("No token found");
//       return;
//     }

//     try {
//       const response = await fetch(API_ENDPOINTS.CREATE_CHAT, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           recipientEmail: newChatEmail,
//           customName: newChatName || newChatEmail,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const newChat = {
//           ...data,
//           messages: [], // Ensure the new chat has an empty messages array initially
//           customName: newChatName || newChatEmail,
//         };
//         setChats((prevChats) => [...prevChats, newChat]);
//         setSelectedChat(newChat);
//         setOpenNewChatDialog(false);
//         setNewChatEmail("");
//         setNewChatName("");
//       } else {
//         alert(data.message || "Failed to create chat");
//       }
//     } catch (error) {
//       console.error("Error creating chat:", error);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       height="100%"
//       width={isCollapsed ? "3.75%" : "25%"}
//       sx={{ transition: "width 0.5s ease-in-out" }}
//     >
//       {/* Sidebar Left Section */}
//       <Box
//         width={isCollapsed ? "100%" : "15%"}
//         sx={{
//           backgroundColor: "primary.main",
//           color: "white",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "space-between",
//           py: 2,
//           px: 1,
//           transition: "width 0.5s ease-in-out",
//         }}
//       >
//         {/* Top Icons */}
//         <Box display="flex" flexDirection="column" gap={2}>
//           <IconButton
//             sx={{ color: "white" }}
//             onClick={() => setOpenNewChatDialog(true)}
//           >
//             <AddCircleIcon />
//           </IconButton>
//           <IconButton
//             sx={{ color: "white" }}
//             onClick={() => alert("Chat with bot coming soon!")}
//           >
//             <SmartToyIcon />
//           </IconButton>
//         </Box>

//         {/* Collapse Button */}
//         <IconButton
//           sx={{ color: "white" }}
//           onClick={() => setIsCollapsed(!isCollapsed)}
//         >
//           <ArrowBackIosNewIcon
//             sx={{ transform: isCollapsed ? "rotate(180deg)" : "none" }}
//           />
//         </IconButton>
//       </Box>

//       {/* Right Sidebar (Collapsible Section) */}
//       <Box
//         sx={{
//           backgroundColor: "primary.light",
//           color: "white",
//           display: "flex",
//           flexDirection: "column",
//           width: isCollapsed ? "0px" : "85%",
//           transform: isCollapsed ? "translateX(-100%)" : "translateX(0%)",
//           opacity: isCollapsed ? 0 : 1,
//           transition:
//             "transform 0.4s ease-in-out, width 0.4s ease-in-out, opacity 0.3s ease-in-out",
//           overflow: "hidden",
//         }}
//       >
//         {/* Chat List */}
//         <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
//           {loading ? (
//             <Box display="flex" justifyContent="center" alignItems="center">
//               <CircularProgress size={24} color="secondary" />
//             </Box>
//           ) : chats.length > 0 ? (
//             chats.map((chat) => {
//               const recipient = chat.messages;
//               chat.participants?.find(
//                 (p) => p.email !== sessionStorage.getItem("userEmail")
//               ) || {};

//               const chatName =
//                 chat.chatName ||
//                 recipient.username ||
//                 recipient.email ||
//                 "Unknown";

//               return (
//                 <ListItem
//                   component="div"
//                   key={chat._id}
//                   onClick={() => setSelectedChat(chat)}
//                   sx={{
//                     borderBottom: "1px solid #3c3f41",
//                     "&:hover": { backgroundColor: "#3c3f41" },
//                   }}
//                 >
//                   <ListItemAvatar>
//                     <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
//                       {chatName[0]?.toUpperCase() || "?"}
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={chatName}
//                     secondary={
//                       chat.messages?.length > 0
//                         ? chat.messages[0].content // Use the last message
//                         : "No messages yet"
//                     }
//                   />
//                 </ListItem>
//               );
//             })
//           ) : (
//             <ListItem>
//               <ListItemText primary="No chats available" />
//             </ListItem>
//           )}
//         </List>
//       </Box>
//       {/* New Chat Dialog */}
//       <Dialog
//         open={openNewChatDialog}
//         onClose={() => setOpenNewChatDialog(false)}
//         sx={{
//           "& .MuiDialog-paper": {
//             borderRadius: "6px",
//             padding: "10px",
//             backgroundColor: "#f5f5f5",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             backgroundColor: "primary.main",
//             color: "white",
//             textAlign: "center",
//             fontWeight: "bold",
//           }}
//         >
//           Start a New Chat
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Enter User Email"
//             value={newChatEmail}
//             onChange={(e) => setNewChatEmail(e.target.value)}
//             variant="outlined"
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Enter Chat Name "
//             value={newChatName}
//             onChange={(e) => setNewChatName(e.target.value)}
//             variant="outlined"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenNewChatDialog(false)}>Cancel</Button>
//           <Button onClick={handleCreateNewChat} variant="contained">
//             Start Chat
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Sidebar;

// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import {
//   Box,
//   Avatar,
//   IconButton,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   CircularProgress,
// } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import API_ENDPOINTS from "../../helpers/constants";

// const Sidebar = ({ selectedChat, setSelectedChat }) => {
//   const [chats, setChats] = useState([]);
//   const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
//   const [newChatEmail, setNewChatEmail] = useState("");
//   const [newChatName, setNewChatName] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch all user chats
//   useEffect(() => {
//     const fetchChats = async () => {
//       const token = sessionStorage.getItem("token");
//       if (!token) return;

//       try {
//         const response = await fetch(API_ENDPOINTS.GET_CHATS, {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setChats(data || []);
//         } else {
//           console.error("Error fetching chats:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching chats:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChats();
//   }, []);

//   const handleCreateNewChat = async () => {
//     if (!newChatEmail.trim()) return;

//     // Check if chat already exists
//     const existingChat = chats.find((chat) =>
//       chat.participants.some((p) => p.email === newChatEmail)
//     );

//     if (existingChat) {
//       alert("Chat with this user already exists!");
//       setSelectedChat(existingChat); // Open the existing chat
//       setOpenNewChatDialog(false);
//       return;
//     }

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       console.error("No token found");
//       return;
//     }

//     try {
//       const response = await fetch(API_ENDPOINTS.CREATE_CHAT, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           recipientEmail: newChatEmail,
//           customName: newChatName || newChatEmail,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const newChat = {
//           ...data,
//           customName: newChatName || newChatEmail, // Ensure custom name is stored
//         };

//         setChats((prevChats) => [...prevChats, newChat]);
//         setSelectedChat(newChat);
//         setOpenNewChatDialog(false);
//         setNewChatEmail("");
//         setNewChatName("");
//       } else {
//         alert(data.message || "Failed to create chat");
//       }
//     } catch (error) {
//       console.error("Error creating chat:", error);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       height="100%"
//       width={isCollapsed ? "3.75%" : "25%"}
//       sx={{ transition: "width 0.5s ease-in-out" }}
//     >
//       {/* Sidebar Left Section */}
//       <Box
//         width={isCollapsed ? "100%" : "15%"}
//         sx={{
//           backgroundColor: "primary.main",
//           color: "white",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "space-between",
//           py: 2,
//           px: 1,
//           transition: "width 0.5s ease-in-out",
//         }}
//       >
//         {/* Top Icons */}
//         <Box display="flex" flexDirection="column" gap={2}>
//           <IconButton
//             sx={{ color: "white" }}
//             onClick={() => setOpenNewChatDialog(true)}
//           >
//             <AddCircleIcon />
//           </IconButton>
//           <IconButton
//             sx={{ color: "white" }}
//             onClick={() => alert("Chat with bot coming soon!")}
//           >
//             <SmartToyIcon />
//           </IconButton>
//         </Box>

//         {/* Collapse Button */}
//         <IconButton
//           sx={{ color: "white" }}
//           onClick={() => setIsCollapsed(!isCollapsed)}
//         >
//           <ArrowBackIosNewIcon
//             sx={{ transform: isCollapsed ? "rotate(180deg)" : "none" }}
//           />
//         </IconButton>
//       </Box>

//       {/* Right Sidebar (Collapsible Section) */}
//       <Box
//         sx={{
//           backgroundColor: "primary.light",
//           color: "white",
//           display: "flex",
//           flexDirection: "column",
//           width: isCollapsed ? "0px" : "85%",
//           transform: isCollapsed ? "translateX(-100%)" : "translateX(0%)",
//           opacity: isCollapsed ? 0 : 1,
//           transition:
//             "transform 0.4s ease-in-out, width 0.4s ease-in-out, opacity 0.3s ease-in-out",
//           overflow: "hidden",
//         }}
//       >
//         {/* Chat List */}
//         <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
//           {loading ? (
//             <Box display="flex" justifyContent="center" alignItems="center">
//               <CircularProgress size={24} color="secondary" />
//             </Box>
//           ) : chats.length > 0 ? (
//             chats.map((chat) => {
//               const recipient =
//                 chat.participants?.find(
//                   (p) => p.email !== sessionStorage.getItem("userEmail")
//                 ) || {};

//               const chatName =
//                 chat.chatName ||
//                 recipient.username ||
//                 recipient.email ||
//                 "Unknown"; // Correct name selection

//               return (
//                 <ListItem
//                   component="div"
//                   key={chat._id}
//                   onClick={() => setSelectedChat(chat)}
//                   sx={{
//                     borderBottom: "1px solid #3c3f41",
//                     "&:hover": { backgroundColor: "#3c3f41" },
//                   }}
//                 >
//                   <ListItemAvatar>
//                     <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
//                       {chatName[0]?.toUpperCase() || "?"}
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={chatName}
//                     secondary={
//                       chat.messages?.length > 0
//                         ? chat.messages[chat.messages.length - 1].content
//                         : "No messages yet"
//                     }
//                   />
//                 </ListItem>
//               );
//             })
//           ) : (
//             <ListItem>
//               <ListItemText primary="No chats available" />
//             </ListItem>
//           )}
//         </List>
//       </Box>

//       {/* New Chat Dialog */}
//       <Dialog
//         open={openNewChatDialog}
//         onClose={() => setOpenNewChatDialog(false)}
//         sx={{
//           "& .MuiDialog-paper": {
//             borderRadius: "6px",
//             padding: "10px",
//             backgroundColor: "#f5f5f5",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             backgroundColor: "primary.main",
//             color: "white",
//             textAlign: "center",
//             fontWeight: "bold",
//           }}
//         >
//           Start a New Chat
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Enter User Email"
//             value={newChatEmail}
//             onChange={(e) => setNewChatEmail(e.target.value)}
//             variant="outlined"
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Enter Chat Name "
//             value={newChatName}
//             onChange={(e) => setNewChatName(e.target.value)}
//             variant="outlined"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenNewChatDialog(false)}>Cancel</Button>
//           <Button onClick={handleCreateNewChat} variant="contained">
//             Start Chat
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Sidebar;

// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import {
//   Box,
//   Avatar,
//   IconButton,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   CircularProgress,
// } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import API_ENDPOINTS from "../../helpers/constants";

// const Sidebar = ({ chats, setChats, selectedChat, setSelectedChat }) => {
//   const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
//   const [newChatEmail, setNewChatEmail] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUsername = async () => {
//       const token = sessionStorage.getItem("token");
//       if (!token) return;

//       try {
//         const response = await fetch(API_ENDPOINTS.PROFILE, {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setUsername(data.username || "User");
//         } else {
//           console.error("Error fetching username:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsername();
//   }, []);

//   const handleCreateNewChat = async () => {
//     if (!newChatEmail.trim()) return;

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       console.error("No token found");
//       return;
//     }

//     try {
//       const response = await fetch(API_ENDPOINTS.CREATE, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ email: newChatEmail }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setChats((prevChats) => [...prevChats, data]); // Add new chat to the list
//         setSelectedChat(data);
//         setOpenNewChatDialog(false);
//         setNewChatEmail("");
//       } else {
//         alert(data.message || "Failed to create chat");
//       }
//     } catch (error) {
//       console.error("Error creating chat:", error);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       height="100%"
//       width={isCollapsed ? "3.75%" : "25%"}
//       sx={{ transition: "width 0.5s ease-in-out" }}
//     >
//       {/* Sidebar Left Section */}
//       <Box
//         width={isCollapsed ? "100%" : "15%"}
//         sx={{
//           backgroundColor: "primary.main",
//           color: "white",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "space-between",
//           py: 2,
//           px: 1,
//           transition: "width 0.5s ease-in-out",
//         }}
//       >
//         {/* Top Icons */}
//         <Box display="flex" flexDirection="column" gap={2}>
//           <IconButton
//             sx={{ color: "white" }}
//             onClick={() => setOpenNewChatDialog(true)}
//           >
//             <AddCircleIcon />
//           </IconButton>
//           <IconButton
//             sx={{ color: "white" }}
//             onClick={() => alert("Chat with bot coming soon!")}
//           >
//             <SmartToyIcon />
//           </IconButton>
//         </Box>

//         {/* Collapse Button */}
//         <IconButton
//           sx={{ color: "white" }}
//           onClick={() => setIsCollapsed(!isCollapsed)}
//         >
//           <ArrowBackIosNewIcon
//             sx={{ transform: isCollapsed ? "rotate(180deg)" : "none" }}
//           />
//         </IconButton>
//       </Box>

//       {/* Right Sidebar (Collapsible Section) */}
//       <Box
//         sx={{
//           backgroundColor: "primary.light",
//           color: "white",
//           display: "flex",
//           flexDirection: "column",
//           width: isCollapsed ? "0px" : "85%",
//           transform: isCollapsed ? "translateX(-100%)" : "translateX(0%)",
//           opacity: isCollapsed ? 0 : 1,
//           transition:
//             "transform 0.4s ease-in-out, width 0.4s ease-in-out, opacity 0.3s ease-in-out",
//           overflow: "hidden",
//         }}
//       >
//         {/* Chat List */}
//         <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
//           {loading ? (
//             <Box display="flex" justifyContent="center" alignItems="center">
//               <CircularProgress size={24} color="secondary" />
//             </Box>
//           ) : chats.length > 0 ? (
//             chats.map((chat) => (
//               <ListItem
//                 button={true}
//                 key={chat.id || chat._id || chat.participants?.join(",")}
//                 onClick={() => setSelectedChat(chat)}
//                 sx={{
//                   borderBottom: "1px solid #3c3f41",
//                   "&:hover": { backgroundColor: "#3c3f41" },
//                 }}
//               >
//                 <ListItemAvatar>
//                   <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
//                     {chat.participants?.[0]?.username?.[0]?.toUpperCase() ||
//                       "?"}
//                   </Avatar>
//                 </ListItemAvatar>
//                 <ListItemText
//                   primary={chat.participants?.[0]?.username || "Unknown User"}
//                   secondary="No messages yet"
//                 />
//               </ListItem>
//             ))
//           ) : (
//             <ListItem>
//               <ListItemText primary="No chats available" />
//             </ListItem>
//           )}
//         </List>
//       </Box>

//       {/* New Chat Dialog */}
//       <Dialog
//         open={openNewChatDialog}
//         onClose={() => setOpenNewChatDialog(false)}
//         sx={{
//           "& .MuiDialog-paper": {
//             borderRadius: "6px",
//             padding: "10px",
//             backgroundColor: "#f5f5f5",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             backgroundColor: "primary.main",
//             color: "white",
//             textAlign: "center",
//             fontWeight: "bold",
//           }}
//         >
//           Start a New Chat
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Enter User Email"
//             value={newChatEmail}
//             onChange={(e) => setNewChatEmail(e.target.value)}
//             variant="outlined"
//           />
//         </DialogContent>
//         <DialogActions
//           sx={{ justifyContent: "space-between", padding: "10px" }}
//         >
//           <Button
//             onClick={() => setOpenNewChatDialog(false)}
//             sx={{ color: "gray", fontWeight: "bold" }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleCreateNewChat}
//             variant="contained"
//             color="primary"
//           >
//             Start Chat
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Sidebar;

// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import {
//   Box,
//   Avatar,
//   IconButton,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Toolbar,
//   AppBar,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import EditIcon from "@mui/icons-material/Edit";
// import InfoIcon from "@mui/icons-material/Info";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import API_ENDPOINTS from "../../helpers/constants";

// const Sidebar = ({ chats, setChats, selectedChat, setSelectedChat }) => {
//   const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
//   const [newChatEmail, setNewChatEmail] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [username, setUsername] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);

//   useEffect(() => {
//     const fetchUsername = async () => {
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       try {
//         const response = await fetch(API_ENDPOINTS.PROFILE, {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setUsername(data.username || "User");
//         } else {
//           console.error("Error fetching username:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUsername();
//   }, []);

//   const handleCreateNewChat = () => {
//     if (!newChatEmail.trim()) return;

//     // Prevent duplicate chats
//     if (chats.some((chat) => chat.name === newChatEmail)) {
//       alert("Chat already exists!");
//       return;
//     }

//     const newChat = {
//       id: Date.now(),
//       name: newChatEmail,
//       type: "individual",
//     };

//     setChats((prevChats) => [...prevChats, newChat]);
//     setOpenNewChatDialog(false);
//     setNewChatEmail("");
//   };

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <Box
//       display="flex"
//       height="100%"
//       width={isCollapsed ? "5%" : "25%"}
//       sx={{ transition: "width 0.5s ease-in-out" }}
//     >
//       {/* Sidebar Left Section */}
//       <Box
//         width={isCollapsed ? "100%" : "15%"}
//         sx={{
//           backgroundColor: "primary.main",
//           color: "white",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "space-between",
//           py: 2,
//           px: 1,
//           transition: "width 0.5s ease-in-out",
//         }}
//       >
//         {/* Top Icons */}
//         <Box display="flex" flexDirection="column" gap={2}>
//           <IconButton
//             sx={{ color: "white" }}
//             onClick={() => setOpenNewChatDialog(true)}
//           >
//             <AddCircleIcon />
//           </IconButton>
//           <IconButton
//             sx={{ color: "white" }}
//             onClick={() => alert("Chat with bot coming soon!")}
//           >
//             <SmartToyIcon />
//           </IconButton>
//         </Box>

//         {/* Profile Section */}
//         <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
//           {/* Collapse Button */}
//           <IconButton
//             sx={{ color: "white" }}
//             onClick={() => setIsCollapsed(!isCollapsed)}
//           >
//             <ArrowBackIosNewIcon
//               sx={{ transform: isCollapsed ? "rotate(180deg)" : "none" }}
//             />
//           </IconButton>
//         </Box>
//       </Box>

//       {/* Right Sidebar (Collapsible Section) */}
//       <Box
//         sx={{
//           backgroundColor: "primary.light",
//           color: "white",
//           display: "flex",
//           flexDirection: "column",
//           width: isCollapsed ? "0px" : "85%",
//           transform: isCollapsed ? "translateX(-100%)" : "translateX(0%)",
//           opacity: isCollapsed ? 0 : 1,
//           transition:
//             "transform 0.4s ease-in-out, width 0.4s ease-in-out, opacity 0.3s ease-in-out",
//           overflow: "hidden",
//         }}
//       >
//         {/* Chat List */}
//         <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
//           {chats.length > 0 ? (
//             chats.map((chat) => {
//               let chatName = chat.name.includes("@")
//                 ? chat.name.split("@")[0]
//                 : chat.name;
//               chatName = chatName
//                 .replace(/([a-z])([A-Z])/g, "$1 $2")
//                 .replace(/_/g, " ")
//                 .replace(/\b\w/g, (char) => char.toUpperCase());

//               return (
//                 <ListItem
//                   button
//                   key={chat.id}
//                   onClick={() => setSelectedChat(chat)}
//                   sx={{
//                     borderBottom: "1px solid #3c3f41",
//                     "&:hover": { backgroundColor: "#3c3f41" },
//                   }}
//                 >
//                   <ListItemAvatar>
//                     <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
//                       {chatName[0].toUpperCase()}
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={chatName}
//                     secondary="No messages yet"
//                   />
//                 </ListItem>
//               );
//             })
//           ) : (
//             <Box sx={{ color: "gray", px: 2, py: 2, textAlign: "center" }}>
//               No chats yet. Start a new chat!
//             </Box>
//           )}
//         </List>
//       </Box>

//       {/* New Chat Dialog */}
//       <Dialog
//         open={openNewChatDialog}
//         onClose={() => setOpenNewChatDialog(false)}
//         sx={{
//           "& .MuiDialog-paper": {
//             borderRadius: "6px",
//             padding: "10px",
//             backgroundColor: "#f5f5f5",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             backgroundColor: "primary.main",
//             color: "white",
//             textAlign: "center",
//             fontWeight: "bold",
//           }}
//         >
//           Start a New Chat
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Enter User Email"
//             value={newChatEmail}
//             onChange={(e) => setNewChatEmail(e.target.value)}
//             variant="outlined"
//           />
//         </DialogContent>
//         <DialogActions
//           sx={{ justifyContent: "space-between", padding: "10px" }}
//         >
//           <Button
//             onClick={() => setOpenNewChatDialog(false)}
//             sx={{ color: "gray", fontWeight: "bold" }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleCreateNewChat}
//             variant="contained"
//             color="primary"
//           >
//             Start Chat
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Sidebar;
