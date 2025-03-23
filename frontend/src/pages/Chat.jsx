/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Sidebar from "../components/chat/Sidebar";
import ChatScreen from "../components/chat/ChatScreen";
import API_ENDPOINTS from "../helpers/constants"; // Import API endpoints

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user chats
  const fetchChats = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    setLoading(true); // Start loading

    try {
      const response = await fetch(API_ENDPOINTS.GET_CHATS, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setChats(data || []);
        setError(null); // Reset error if successful
      } else {
        setError(data.message || "Failed to load chats");
      }
    } catch (error) {
      setError("Unable to connect to the server");
    } finally {
      setLoading(false); // Stop loading
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <Box
      display="flex"
      width="100vw"
      height="100vh"
      sx={{
        pt: 8.6, // Adjust for Navbar spacing
        pb: 7.4, // Adjust for Footer spacing
      }}
    >
      {/* Sidebar for chat list */}
      <Sidebar
        chats={chats}
        setChats={setChats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        refreshChats={fetchChats} // Pass function to refresh chats
      />

      {/* Main Chat Area */}
      {loading ? (
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <ChatScreen
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      )}
    </Box>
  );
};

export default Chat;

// import { useState } from "react";
// import { Box } from "@mui/material";
// import Sidebar from "../components/chat/Sidebar";
// import ChatScreen from "../components/chat/ChatScreen";

// const Chat = () => {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [chats, setChats] = useState([]);

//   return (
//     <Box
//       display="flex"
//       width="100vw"
//       height="100vh"
//       sx={{
//         pt: 8.6, // Adjust for Navbar spacing
//         pb: 7.4, // Adjust for Footer spacing
//       }}
//     >
//       <Sidebar
//         chats={chats}
//         setChats={setChats}
//         selectedChat={selectedChat}
//         setSelectedChat={setSelectedChat}
//       />

//       <ChatScreen
//         selectedChat={selectedChat}
//         setSelectedChat={setSelectedChat}
//       />
//     </Box>
//   );
// };

// export default Chat;
