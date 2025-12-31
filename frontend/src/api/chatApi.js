import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function sendMessage(message, sessionId = null) {
  try {
    const response = await api.post("/chat/message", {
      message,
      sessionId,
    });

    return response.data;
  } catch (error) {
    console.error("Send message error: ", error);
    console.log("Configured API URL:", API_BASE_URL);

    if (error.response) {
      throw new Error(error.response.data.error || "Failed to send message");
    } else if (error.request) {
      throw new Error(
        "No response from server. Please check your connection.",
        error
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Request setup failed: ${error.message}`);
    }
  }
}

export async function getConversationHistory(
  sessionId,
  limit = 50,
  offset = 10
) {
  try {
    const response = await api.get(`/chat/history/${sessionId}`, {
      params: { limit, offset },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { messages: [], totalCount: 0, hasMore: false };
    }

    console.error("Get history error:", error);

    throw new Error("Failed to load conversation history");
  }
}
