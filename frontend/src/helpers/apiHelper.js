import axios from "axios";

// Function to handle API calls
export const apiRequest = async (url, method, data) => {
  try {
    const response = await axios({ url, method, data });
    return response.data; // Return response data
  } catch (error) {
    throw error.response?.data?.message || "An error occurred";
  }
};
