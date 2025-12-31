import { Send, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

function ChatInput({
  inputRef,
  inputValue,
  isLoading,
  onInputChange,
  onKeyPress,
  onSend,
}) {
  return (
    <div className="p-4 bg-background border-t border-slate-100">
      <div className="flex gap-2">
        <textarea
          ref={inputRef}
          className={cn(
            "flex-1 px-4 py-3 rounded-lg border border-slate-200 bg-background resize-none",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "text-sm placeholder:text-muted-foreground"
          )}
          placeholder="Type your message..."
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          disabled={isLoading}
          rows="1"
        />
        <button
          onClick={onSend}
          disabled={isLoading || !inputValue.trim()}
          className={cn(
            "px-4 py-3 rounded-lg bg-primary text-primary-foreground",
            "hover:bg-primary/90 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary",
            "transition-all duration-200 shadow-sm hover:shadow-md",
            "flex items-center justify-center min-w-12"
          )}
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="text-center mt-3 px-4">
        <p className="text-xs text-slate-400 leading-relaxed">
          AI generated responses can be inaccurate. Please verify important
          information.
        </p>
      </div>
    </div>
  );
}

export default ChatInput;
