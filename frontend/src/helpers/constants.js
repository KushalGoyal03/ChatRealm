const BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  REGISTER: `${BASE_URL}/users/register`,
  LOGIN: `${BASE_URL}/users/login`,
  PROFILE: `${BASE_URL}/users/profile`,
  CREATE_CHAT: `${BASE_URL}/chats/create`,
  GET_CHATS: `${BASE_URL}/chats/user-chats`,
  UPDATE_CHAT_NAME: (chatId) => `${BASE_URL}/chats/update-name/${chatId}`, // ✅ New: Update custom chat name
  SEND_MESSAGE: `${BASE_URL}/chats/send-message`,
  GET_MESSAGES: (chatId) => `${BASE_URL}/chats/messages/${chatId}`,
  MARK_MESSAGES_SEEN: (chatId) => `${BASE_URL}/chats/mark-seen/${chatId}`, // ✅ New: Mark messages as seen
};

export default API_ENDPOINTS;
