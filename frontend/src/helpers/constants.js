const BASE_URL = "https://chatrealm.onrender.com/api";

export const API_ENDPOINTS = {
  // Auth Endpoints
  REGISTER: `${BASE_URL}/users/register`,
  LOGIN: `${BASE_URL}/users/login`,

  // Chat Endpoints
  CREATE_CHAT: `${BASE_URL}/chats/create`,
  GET_CHATS: `${BASE_URL}/chats/user-chats`,
  UPDATE_CHAT_NAME: (chatId) => `${BASE_URL}/chats/update-name/${chatId}`,
  DELETE_CHAT: (chatId) => `${BASE_URL}/chats/delete/${chatId}`,

  // Message Endpoints
  SEND_MESSAGE: `${BASE_URL}/chats/send-message`,
  GET_MESSAGES: (chatId) => `${BASE_URL}/chats/messages/${chatId}`,

  // Users
  GET_ALL_USERS: `${BASE_URL}/chats/users`,
};

export default API_ENDPOINTS;
