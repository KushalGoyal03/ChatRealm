/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
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
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import API_ENDPOINTS from "../../helpers/constants";

const Sidebar = ({ selectedChat, setSelectedChat }) => {
  const [chats, setChats] = useState([]);
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState("");
  const [newChatName, setNewChatName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all user chats
  useEffect(() => {
    const fetchChats = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(API_ENDPOINTS.GET_CHATS, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setChats(data || []);
        } else {
          console.error("Error fetching chats:", data.message);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleCreateNewChat = async () => {
    if (!newChatEmail.trim()) return;

    // Check if chat already exists
    const existingChat = chats.find((chat) =>
      chat.participants.some((p) => p.email === newChatEmail)
    );

    if (existingChat) {
      alert("Chat with this user already exists!");
      setSelectedChat(existingChat); // Open the existing chat
      setOpenNewChatDialog(false);
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.CREATE_CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientEmail: newChatEmail,
          customName: newChatName || newChatEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newChat = {
          ...data,
          messages: [], // Ensure the new chat has an empty messages array initially
          customName: newChatName || newChatEmail,
        };
        setChats((prevChats) => [...prevChats, newChat]);
        setSelectedChat(newChat);
        setOpenNewChatDialog(false);
        setNewChatEmail("");
        setNewChatName("");
      } else {
        alert(data.message || "Failed to create chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
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
        {/* Top Icons */}
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

        {/* Collapse Button */}
        <IconButton
          sx={{ color: "white" }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ArrowBackIosNewIcon
            sx={{ transform: isCollapsed ? "rotate(180deg)" : "none" }}
          />
        </IconButton>
      </Box>

      {/* Right Sidebar (Collapsible Section) */}
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
        {/* Chat List */}
        <List sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress size={24} color="secondary" />
            </Box>
          ) : chats.length > 0 ? (
            chats.map((chat) => {
              const recipient = chat.messages;
              chat.participants?.find(
                (p) => p.email !== sessionStorage.getItem("userEmail")
              ) || {};

              const chatName =
                chat.chatName ||
                recipient.username ||
                recipient.email ||
                "Unknown";

              return (
                <ListItem
                  component="div"
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  sx={{
                    borderBottom: "1px solid #3c3f41",
                    "&:hover": { backgroundColor: "#3c3f41" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "secondary.main", color: "white" }}>
                      {chatName[0]?.toUpperCase() || "?"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chatName}
                    secondary={
                      chat.messages?.length > 0
                        ? chat.messages[0].content // Use the last message
                        : "No messages yet"
                    }
                  />
                </ListItem>
              );
            })
          ) : (
            <ListItem>
              <ListItemText primary="No chats available" />
            </ListItem>
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
