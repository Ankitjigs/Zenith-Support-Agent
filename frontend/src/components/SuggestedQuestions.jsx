function SuggestedQuestions({ suggestions, onSuggestionClick }) {
  return (
    <div className="space-y-2 w-full">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
        Suggested Questions
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-2.5 py-1 hover:cursor-pointer bg-card border border-border rounded-full text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors shadow-sm active:scale-95"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedQuestions;
