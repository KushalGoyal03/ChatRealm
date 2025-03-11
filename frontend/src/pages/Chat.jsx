import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/chat/Sidebar";
import ChatScreen from "../components/chat/ChatScreen";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]); // No hardcoded chats

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
      <Sidebar
        chats={chats}
        setChats={setChats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />

      <ChatScreen
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
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
//   const [chats, setChats] = useState([
//     { id: 1, name: "John_Doe", type: "individual" },
//     { id: 2, name: "Jane_Smith", type: "individual" },
//   ]);

//   return (
//     <Box
//       display="flex"
//       minWidth="100vw"
//       minHeight="100vh"
//       sx={{
//         pt: 8.6, // Adjust for Navbar spacing
//         pb: 7.4, // Adjust for Footer spacing
//       }}
//     >
//       {/* Sidebar should only be visible when no chat is selected */}
//       {!selectedChat && (
//         <Sidebar
//           chats={chats}
//           setChats={setChats}
//           selectedChat={selectedChat}
//           setSelectedChat={setSelectedChat}
//         />
//       )}

//       <ChatScreen
//         selectedChat={selectedChat}
//         setSelectedChat={setSelectedChat}
//       />
//     </Box>
//   );
// };

// export default Chat;
