import { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessagesContainer from "./MessagesContainer";
import ErrorDisplay from "./ErrorDisplay";
import ChatInput from "./ChatInput";
import { sendMessage, getConversationHistory } from "../api/chatApi";
import { getSessionId } from "../utils/session";

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const shouldScrollToBottom = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (shouldScrollToBottom.current) {
      scrollToBottom();
    }

    shouldScrollToBottom.current = true;
  }, [messages, isTyping]);

  useEffect(() => {
    const loadHistory = async () => {
      const { sessionId: sid, isNew } = getSessionId();
      setSessionId(sid);
      setIsInitialLoading(true);

      if (isNew) {
        setIsInitialLoading(false);
        return;
      }

      try {
        const data = await getConversationHistory(sid, 50, 0);
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
        setHasMore(data.hasMore || false);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    const scrollHeightBefore = container.scrollHeight;
    const scrollTopBefore = container.scrollTop;

    setIsLoadingMore(true);

    shouldScrollToBottom.current = false;

    try {
      const data = await getConversationHistory(sessionId, 50, messages.length);

      if (data.messages && data.messages.length > 0) {
        setMessages((prev) => [...data.messages, ...prev]);

        requestAnimationFrame(() => {
          const scrollHeightAfter = container.scrollHeight;
          const heightDifference = scrollHeightAfter - scrollHeightBefore;
          container.scrollTop = scrollTopBefore + heightDifference;
        });
      }

      setHasMore(data.hasMore || false);
    } catch (err) {
      console.error("Failed to load more messages:", err);
      setError("Failed to load older messages");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSend = async () => {
    const message = inputValue.trim();

    if (!message) return;

    if (message.length > 2000) {
      setError("Message is too long. Maximum 2000 characters allowed.");
      return;
    }
    setInputValue("");
    setError(null);
    setIsLoading(true);

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      setIsTyping(true);
      const response = await sendMessage(message, sessionId);
      setIsTyping(false);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
      }
    } catch (err) {
      setIsTyping(false);
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-2xl shadow-xl overflow-hidden">
      <ChatHeader />

      <MessagesContainer
        messagesContainerRef={messagesContainerRef}
        messagesEndRef={messagesEndRef}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={handleLoadMore}
        messages={messages}
        isTyping={isTyping}
        isInitialLoading={isInitialLoading}
        onQuestionSelect={setInputValue}
      />

      <ErrorDisplay error={error} onClose={() => setError(null)} />

      <ChatInput
        inputRef={inputRef}
        inputValue={inputValue}
        isLoading={isLoading}
        onInputChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        onSend={handleSend}
      />
    </div>
  );
}

export default ChatWidget;
