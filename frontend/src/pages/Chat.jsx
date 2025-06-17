/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import Sidebar from "../components/chat/Sidebar";
import ChatScreen from "../components/chat/ChatScreen";
import Navbar from "../components/chat/Navbar";
import API_ENDPOINTS from "../helpers/constants";
import "../components/styles/Chat.css";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.GET_CHATS, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setChats(data || []);
        setError(null);
      } else {
        setError(data.message || "Failed to load chats");
      }
    } catch (error) {
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <>
      <Navbar />
      <div className="chat-wrapper">
        <Sidebar
          chats={chats}
          setChats={setChats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          refreshChats={fetchChats}
        />

        <div className="chat-container">
          {loading ? (
            <div className="chat-loading">
              <CircularProgress />
            </div>
          ) : error ? (
            <div className="chat-error">{error}</div>
          ) : (
            <ChatScreen
              key={selectedChat?._id || "welcome"}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              setChats={setChats}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
