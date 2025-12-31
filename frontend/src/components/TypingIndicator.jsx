function TypingIndicator() {
  return (
    <div className="flex flex-col justify-start items-start gap-2 animate-in fade-in duration-300">
      <span className="text-xs text-muted-foreground italic">
        Agent is typing...
      </span>
      <div className="bg-card border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
