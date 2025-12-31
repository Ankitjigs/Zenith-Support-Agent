export const MAX_MESSAGE_LENGTH = parseInt(
  process.env.MAX_MESSAGE_LENGTH || "2000"
);
export const MAX_CONTEXT_MESSAGES = parseInt(
  process.env.MAX_CONTEXT_MESSAGES || "10"
);

export function validateMessage(message: string): {
  valid: boolean;
  error?: string;
} {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: "Message cannot be empty" };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`,
    };
  }

  return { valid: true };
}

export function validateSessionId(sessionId: string): {
  valid: boolean;
  error?: string;
} {
  if (!sessionId || sessionId.trim().length === 0) {
    return { valid: false, error: "Session ID cannot be empty" };
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(sessionId)) {
    return { valid: false, error: "Invalid session ID format" };
  }

  return { valid: true };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}
