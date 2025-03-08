import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/sidebar/Sidebar";
import ChatScreen from "../components/chat/ChatScreen";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import NewChatDialog from "../components/chat/NewChatDialog";
import CreateGroupDialog from "../components/chat/CreateGroupDialog";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupEmails, setGroupEmails] = useState("");

  const handleCreateNewChat = () => {
    setSelectedChat({ id: newChatEmail, name: newChatEmail });
    setNewChatOpen(false);
    setNewChatEmail("");
  };

  const handleCreateGroup = () => {
    setSelectedChat({ id: groupName, name: groupName });
    setCreateGroupOpen(false);
    setGroupName("");
    setGroupEmails("");
  };

  return (
    <Box display="flex" height="100vh">
      <Sidebar
        setSelectedChat={setSelectedChat}
        setNewChatOpen={setNewChatOpen}
        setCreateGroupOpen={setCreateGroupOpen}
      />

      {selectedChat ? (
        <ChatScreen
          selectedChat={selectedChat}
          messages={messages}
          setMessages={setMessages}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
        />
      ) : (
        <WelcomeScreen />
      )}

      <NewChatDialog
        open={newChatOpen}
        setOpen={setNewChatOpen}
        newChatEmail={newChatEmail}
        setNewChatEmail={setNewChatEmail}
        handleCreateNewChat={handleCreateNewChat}
      />

      <CreateGroupDialog
        open={createGroupOpen}
        setOpen={setCreateGroupOpen}
        groupName={groupName}
        setGroupName={setGroupName}
        emails={groupEmails}
        setEmails={setGroupEmails}
        handleCreateGroup={handleCreateGroup}
      />
    </Box>
  );
};

export default Chat;
