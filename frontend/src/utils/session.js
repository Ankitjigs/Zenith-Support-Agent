import { v4 as uuidv4 } from "uuid";

export function generateUUID() {
  return uuidv4();
}

let newlyCreatedSessionId = null;

export function getSessionId() {
  const STORAGE_KEY = "ai_chat_session_id";
  let sessionId = localStorage.getItem(STORAGE_KEY);
  let isNew = false;

  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem(STORAGE_KEY, sessionId);
    newlyCreatedSessionId = sessionId;
    isNew = true;
  } else if (sessionId === newlyCreatedSessionId) {
    isNew = true;
  }

  return { sessionId, isNew };
}

export function clearSession() {
  const STORAGE_KEY = "ai_chat_session_id";
  localStorage.removeItem(STORAGE_KEY);
}

export function createNewSession() {
  clearSession();
  return getSessionId();
}
