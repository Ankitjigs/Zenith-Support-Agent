import Message from "./Message";
import WelcomeScreen from "./WelcomeScreen";
import LoadMoreButton from "./LoadMoreButton";
import TypingIndicator from "./TypingIndicator";
import LoadingSpinner from "./LoadingSpinner";
import { cn } from "../lib/utils";

export default function MessagesContainer({
  messagesContainerRef,
  messagesEndRef,
  isLoadingMore,
  onLoadMore,
  messages,
  isTyping,
  isInitialLoading,
  onQuestionSelect,
  hasMore,
}) {
  return (
    <div
      ref={messagesContainerRef}
      className={cn(
        "flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 border border-slate-200 relative scrollbar-hover"
      )}
    >
      {isInitialLoading && <LoadingSpinner />}

      {!isInitialLoading && (
        <LoadMoreButton
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onClick={onLoadMore}
        />
      )}

      {!isInitialLoading && messages.length === 0 && !isTyping && (
        <WelcomeScreen onQuestionSelect={onQuestionSelect} />
      )}

      {!isInitialLoading &&
        messages.map((msg) => <Message key={msg.id} message={msg} />)}

      {!isInitialLoading && isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
}
