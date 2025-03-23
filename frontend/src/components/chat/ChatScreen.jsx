/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
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
      if (!token) {
        console.error("No token found, cannot fetch messages.");
        setLoading(false);
        return;
      }

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
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedChat?._id) return;
    const token = sessionStorage.getItem("token");

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
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: { username: "You" }, content: data.content },
        ]);
        setCurrentMessage("");
      } else {
        console.error(
          "Error sending message:",
          data?.message || "Unexpected error"
        );
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
            <IconButton
              onClick={() => setSelectedChat(null)}
              sx={{ color: "white", mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
              {selectedChat?.chatName?.[0]?.toUpperCase() ||
                selectedChat?.participants?.[0]?.username?.[0]?.toUpperCase() ||
                selectedChat?.participants?.[0]?.email?.[0]?.toUpperCase() ||
                "?"}
            </Avatar>
            <Typography variant="h6">
              {selectedChat?.chatName ||
                selectedChat?.participants?.[0]?.username ||
                selectedChat?.participants?.[0]?.email ||
                "Unknown"}
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
              messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    maxWidth: "60%",
                    alignSelf:
                      msg.sender?.username === "You"
                        ? "flex-end"
                        : "flex-start",
                    backgroundColor:
                      msg.sender?.username === "You" ? "#dcf8c6" : "#e5e5e5",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    {msg.sender?.username || "Unknown"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "primary.main" }}>
                    {msg.content}
                  </Typography>
                </Box>
              ))
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
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
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
