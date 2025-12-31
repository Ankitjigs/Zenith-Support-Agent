export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export type ConversationHistory = Array<ConversationMessage>;


export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}