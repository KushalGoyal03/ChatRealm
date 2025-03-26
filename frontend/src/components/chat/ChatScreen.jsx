/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import React from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import API_ENDPOINTS from "../../helpers/constants";

const socket = io("http://localhost:5000", { withCredentials: true });

const ChatScreen = ({ selectedChat, setSelectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          API_ENDPOINTS.GET_MESSAGES(selectedChat._id),
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);

        // Mark messages as seen
        socket.emit("message-seen", { chatId: selectedChat._id });
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // WebSocket Listener for New Messages
    const handleNewMessage = (newMessage) => {
      if (newMessage.chatId === selectedChat._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Mark as seen when message is received
        socket.emit("message-seen", { chatId: selectedChat._id });
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage); // Cleanup WebSocket listener
    };
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedChat?._id) return;

    const token = sessionStorage.getItem("token");
    const loggedInUser = JSON.parse(sessionStorage.getItem("user")); // Ensure user object is fetched

    try {
      const response = await fetch(API_ENDPOINTS.SEND_MESSAGE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          content: currentMessage.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data?.content) {
        const newMsg = {
          _id: Date.now(), // Temporary ID
          sender: {
            _id: loggedInUser?._id, // ✅ Ensure sender's `_id` is included
            username: loggedInUser?.username,
          },
          content: data.content,
          createdAt: new Date().toISOString(), // ✅ Ensure correct timestamp format
          seen: false,
        };

        // ✅ Fix: Get receiver's custom name if available
        const receiverId = selectedChat.participants.find(
          (userId) => userId !== loggedInUser._id
        );
        const receiverName =
          selectedChat?.customNames?.[receiverId] || selectedChat?.username;

        // Update messages in state immediately
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMsg,
            receiverName, // ✅ Store receiver's name for proper display
          },
        ]);

        // Emit message via WebSocket
        socket.emit("send-message", {
          chatId: selectedChat._id,
          message: { ...data, sender: newMsg.sender },
        });

        setCurrentMessage(""); // Clear input field

        // Scroll to the latest message
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection="column">
      {selectedChat?._id ? (
        <>
          {/* Chat Header */}
          <Box
            display="flex"
            alignItems="center"
            p={1.5}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderBottom: "2px solid #ddd",
            }}
          >
            {/* Back Button */}
            <IconButton
              onClick={() => setSelectedChat(null)}
              sx={{ color: "white", mr: 1 }}
              aria-label="Go back to chat list"
            >
              <ArrowBackIcon />
            </IconButton>

            {/* Chat Avatar */}
            <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
              {selectedChat?.chatName?.trim()
                ? selectedChat.chatName.charAt(0).toUpperCase()
                : "?"}
            </Avatar>

            {/* Chat Name */}
            <Typography variant="h6">
              {selectedChat?.chatName?.trim() || "Unknown Chat"}
            </Typography>
          </Box>

          {/* Messages Display */}
          <Box
            flexGrow={1}
            p={2}
            sx={{ overflowY: "auto", display: "flex", flexDirection: "column" }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress size={24} />
              </Box>
            ) : messages.length > 0 ? (
              messages.map((msg, index) => {
                const loggedInUser =
                  JSON.parse(sessionStorage.getItem("user")) || {};

                // Ensure both sender and loggedInUser IDs are compared as strings
                const isLoggedInUser =
                  String(msg.sender?._id) === String(loggedInUser._id);

                // Rule: Show "You" for logged-in user's messages, otherwise show the custom name or username
                const senderName = isLoggedInUser
                  ? "You"
                  : selectedChat?.customNames?.[msg.sender?._id] ||
                    msg.sender?.username ||
                    "Unknown";

                const messageTime = msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "Time not available";

                // Date separator logic
                const messageDate = new Date(
                  msg.createdAt
                ).toLocaleDateString();
                const prevMessageDate =
                  index > 0
                    ? new Date(
                        messages[index - 1].createdAt
                      ).toLocaleDateString()
                    : null;
                const showDateSeparator = messageDate !== prevMessageDate;

                return (
                  <React.Fragment key={index}>
                    {showDateSeparator && (
                      <Typography
                        variant="caption"
                        sx={{
                          textAlign: "center",
                          display: "block",
                          fontWeight: "bold",
                          marginY: "10px",
                          color: "#666",
                        }}
                      >
                        {messageDate}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        padding: "10px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                        maxWidth: "60%",
                        alignSelf: isLoggedInUser ? "flex-start" : "flex-end", // ✅ FIXED: Left for sender, right for receiver
                        backgroundColor: isLoggedInUser ? "#dcf8c6" : "#e5e5e5",
                        position: "relative",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {senderName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "primary.main" }}
                      >
                        {msg.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          bottom: "-15px",
                          right: "5px",
                          fontSize: "0.7rem",
                          color: isLoggedInUser ? "green" : "gray",
                        }}
                      >
                        {messageTime}
                      </Typography>
                      {!isLoggedInUser && msg.seen && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "blue",
                            fontSize: "0.7rem",
                            textAlign: "right",
                          }}
                        >
                          Seen
                        </Typography>
                      )}
                    </Box>
                  </React.Fragment>
                );
              })
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ textAlign: "center", mt: 3 }}
              >
                Start a conversation...
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Message Input */}
          <Box
            display="flex"
            alignItems="center"
            p={1}
            sx={{ backgroundColor: "white", borderTop: "1px solid #ddd" }}
          >
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevents accidental line breaks
                  if (currentMessage.trim()) {
                    handleSendMessage();
                  }
                }
              }}
              aria-label="Type a message"
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!currentMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </>
      ) : (
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: "#f5f5f5" }}
        >
          <img
            src="/images/logo.png"
            alt="ChatSphere Logo"
            onError={(e) => (e.target.style.display = "none")} // Hide if image fails to load
            style={{
              width: "60px",
              height: "auto",
              marginBottom: "15px",
              borderRadius: "50%",
            }}
          />
          <Typography
            variant="h4"
            color="primary.main"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Welcome to ChatSphere
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ fontWeight: "bold" }}
          >
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatScreen;

// /* eslint-disable react/prop-types */
// import { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Avatar,
//   Typography,
//   IconButton,
//   TextField,
//   CircularProgress,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import SendIcon from "@mui/icons-material/Send";
// import API_ENDPOINTS from "../../helpers/constants";

// const ChatScreen = ({ selectedChat, setSelectedChat }) => {
//   const [messages, setMessages] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (!selectedChat?._id) return;

//     const fetchMessages = async () => {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         console.error("No token found, cannot fetch messages.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(
//           API_ENDPOINTS.GET_MESSAGES(selectedChat._id),
//           {
//             method: "GET",
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!response.ok) throw new Error("Failed to fetch messages");

//         const data = await response.json();
//         setMessages(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [selectedChat]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!currentMessage.trim() || !selectedChat?._id) return;
//     const token = sessionStorage.getItem("token");

//     try {
//       const response = await fetch(API_ENDPOINTS.SEND_MESSAGE, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           chatId: selectedChat._id,
//           content: currentMessage.trim(),
//         }),
//       });

//       const data = await response.json();

//       if (response.ok && data?.content) {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { sender: { username: "You" }, content: data.content },
//         ]);
//         setCurrentMessage("");
//       } else {
//         console.error(
//           "Error sending message:",
//           data?.message || "Unexpected error"
//         );
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <Box flexGrow={1} display="flex" flexDirection="column">
//       {selectedChat?._id ? (
//         <>
//           {/* Chat Header */}
//           <Box
//             display="flex"
//             alignItems="center"
//             p={1.5}
//             sx={{
//               backgroundColor: "primary.main",
//               color: "white",
//               borderBottom: "2px solid #ddd",
//             }}
//           >
//             <IconButton
//               onClick={() => setSelectedChat(null)}
//               sx={{ color: "white", mr: 1 }}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
//               {selectedChat?.chatName?.[0]?.toUpperCase() ||
//                 selectedChat?.participants?.[0]?.username?.[0]?.toUpperCase() ||
//                 selectedChat?.participants?.[0]?.email?.[0]?.toUpperCase() ||
//                 "?"}
//             </Avatar>
//             <Typography variant="h6">
//               {selectedChat?.chatName ||
//                 selectedChat?.participants?.[0]?.username ||
//                 selectedChat?.participants?.[0]?.email ||
//                 "Unknown"}
//             </Typography>
//           </Box>

//           {/* Messages Display */}
//           <Box
//             flexGrow={1}
//             p={2}
//             sx={{ overflowY: "auto", display: "flex", flexDirection: "column" }}
//           >
//             {loading ? (
//               <Box display="flex" justifyContent="center" alignItems="center">
//                 <CircularProgress size={24} />
//               </Box>
//             ) : messages.length > 0 ? (
//               messages.map((msg, index) => (
//                 <Box
//                   key={index}
//                   sx={{
//                     padding: "10px",
//                     borderRadius: "10px",
//                     marginBottom: "10px",
//                     maxWidth: "60%",
//                     alignSelf:
//                       msg.sender?.username === "You"
//                         ? "flex-end"
//                         : "flex-start",
//                     backgroundColor:
//                       msg.sender?.username === "You" ? "#dcf8c6" : "#e5e5e5",
//                   }}
//                 >
//                   <Typography
//                     variant="body1"
//                     sx={{ fontWeight: "bold", color: "#333" }}
//                   >
//                     {msg.sender?.username || "Unknown"}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "primary.main" }}>
//                     {msg.content}
//                   </Typography>
//                 </Box>
//               ))
//             ) : (
//               <Typography
//                 variant="body1"
//                 color="textSecondary"
//                 sx={{ textAlign: "center", mt: 3 }}
//               >
//                 Start a conversation...
//               </Typography>
//             )}
//             <div ref={messagesEndRef} />
//           </Box>

//           {/* Message Input */}
//           <Box
//             display="flex"
//             alignItems="center"
//             p={1}
//             sx={{ backgroundColor: "white", borderTop: "1px solid #ddd" }}
//           >
//             <TextField
//               fullWidth
//               placeholder="Type a message..."
//               variant="outlined"
//               value={currentMessage}
//               onChange={(e) => setCurrentMessage(e.target.value)}
//               onKeyDown={(e) =>
//                 e.key === "Enter" && !e.shiftKey && handleSendMessage()
//               }
//             />
//             <IconButton
//               color="primary"
//               onClick={handleSendMessage}
//               disabled={!currentMessage.trim()}
//             >
//               <SendIcon />
//             </IconButton>
//           </Box>
//         </>
//       ) : (
//         <Box
//           flexGrow={1}
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           sx={{ backgroundColor: "#f5f5f5" }}
//         >
//           <img
//             src="/images/logo.png"
//             alt="ChatSphere Logo"
//             style={{
//               width: "60px",
//               height: "auto",
//               marginBottom: "15px",
//               borderRadius: "50%",
//             }}
//           />
//           <Typography
//             variant="h4"
//             color="primary.main"
//             sx={{ fontWeight: "bold", mb: 1 }}
//           >
//             Welcome to ChatSphere
//           </Typography>
//           <Typography
//             variant="h6"
//             color="textSecondary"
//             sx={{ fontWeight: "bold" }}
//           >
//             Select a chat to start messaging
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ChatScreen;

// /* eslint-disable react/prop-types */
// import { useState } from "react";
// import { Box, Avatar, Typography, IconButton, TextField } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import SendIcon from "@mui/icons-material/Send";

// const ChatScreen = ({ selectedChat, setSelectedChat }) => {
//   const [messages, setMessages] = useState({});
//   const [currentMessage, setCurrentMessage] = useState("");

//   const handleSendMessage = () => {
//     if (!currentMessage.trim() || !selectedChat) return;

//     setMessages((prevMessages) => ({
//       ...prevMessages,
//       [selectedChat.id]: [
//         ...(prevMessages[selectedChat.id] || []),
//         { text: currentMessage, sender: "You" },
//       ],
//     }));

//     setCurrentMessage("");
//   };

//   return (
//     <Box flexGrow={1} display="flex" flexDirection="column">
//       {selectedChat ? (
//         <>
//           {/* Chat Header */}
//           <Box
//             display="flex"
//             alignItems="center"
//             p={1.5}
//             sx={{
//               backgroundColor: "primary.main",
//               color: "white",
//               borderBottom: "2px solid #ddd",
//             }}
//           >
//             <IconButton
//               onClick={() => setSelectedChat(null)}
//               sx={{ color: "white", mr: 1 }}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
//               {selectedChat.name[0].toUpperCase() || "?"}
//             </Avatar>
//             <Typography variant="h6">
//               {selectedChat.name
//                 .replace(/_/g, " ")
//                 .replace(/\b\w/g, (char) => char.toUpperCase())}
//             </Typography>
//           </Box>

//           {/* Messages Display */}
//           <Box
//             flexGrow={1}
//             p={2}
//             sx={{
//               overflowY: "auto",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             {messages[selectedChat.id]?.length > 0 ? (
//               messages[selectedChat.id].map((msg, index) => (
//                 <Box
//                   key={index}
//                   sx={{
//                     padding: "10px",
//                     borderRadius: "10px",
//                     marginBottom: "10px",
//                     maxWidth: "60%",
//                     alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
//                     backgroundColor:
//                       msg.sender === "You" ? "#dcf8c6" : "#e5e5e5", // Fixed!
//                   }}
//                 >
//                   <Typography
//                     variant="body1"
//                     sx={{ fontWeight: "bold", color: "#333" }}
//                   >
//                     {msg.sender}
//                   </Typography>
//                   <Typography variant="body2">{msg.text}</Typography>
//                 </Box>
//               ))
//             ) : (
//               <Typography
//                 variant="body1"
//                 color="textSecondary"
//                 sx={{ textAlign: "center", mt: 3 }}
//               >
//                 Start a conversation...
//               </Typography>
//             )}
//           </Box>

//           {/* Message Input */}
//           <Box
//             display="flex"
//             alignItems="center"
//             p={1}
//             sx={{
//               backgroundColor: "white",
//               borderTop: "1px solid #ddd",
//             }}
//           >
//             <TextField
//               fullWidth
//               placeholder="Type a message..."
//               variant="outlined"
//               value={currentMessage}
//               onChange={(e) => setCurrentMessage(e.target.value)}
//             />
//             <IconButton color="primary" onClick={handleSendMessage}>
//               <SendIcon />
//             </IconButton>
//           </Box>
//         </>
//       ) : (
//         <Box
//           flexGrow={1}
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           sx={{ backgroundColor: "#f5f5f5" }}
//         >
//           <img
//             src="/images/logo.png"
//             alt="ChatSphere Logo"
//             style={{
//               width: "60px",
//               height: "auto",
//               marginBottom: "15px",
//               borderRadius: "50%",
//             }}
//           />
//           <Typography
//             variant="h4"
//             color="primary.main"
//             sx={{ fontWeight: "bold", mb: 1 }}
//           >
//             Welcome to ChatSphere
//           </Typography>
//           <Typography
//             variant="h6"
//             color="textSecondary"
//             sx={{ fontWeight: "bold" }}
//           >
//             Select a chat to start messaging
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ChatScreen;
