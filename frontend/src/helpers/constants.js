const BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  REGISTER: `${BASE_URL}/users/register`,
  LOGIN: `${BASE_URL}/users/login`,
  PROFILE: `${BASE_URL}/users/profile`,
  CREATE_CHAT: `${BASE_URL}/chats/create`,
  GET_CHATS: `${BASE_URL}/chats/user-chats`,
  SEND_MESSAGE: `${BASE_URL}/chats/send-message`,
  GET_MESSAGES: (chatId) => `${BASE_URL}/chats/messages/${chatId}`, // ✅ Fix: Use function to insert chatId
};

export default API_ENDPOINTS;
