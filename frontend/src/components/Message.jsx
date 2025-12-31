import { cn } from "../lib/utils";

function Message({ message }) {
    const isUser = message.sender === "user";

    const formatTimeStamp = (timestamp) => {
        const date = new Date(timestamp);

        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div
            className={cn(
                "flex mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "max-w-[80%] flex flex-col gap-1",
                    isUser ? "items-end" : "items-start"
                )}
            >
                <div
                    className={cn(
                        "px-4 py-3 rounded-2xl shadow-sm",
                        isUser
                            ? " bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card border-slate-200 text-card-foreground rounded-bl-sm"
                    )}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                        {message.text}
                    </p>
                </div>
                {message.timestamp && (
                    <span className="text-xs text-muted-foreground px-2">
                        {formatTimeStamp(message.timestamp)}
                    </span>
                )}
            </div>
        </div>
    );
}

export default Message;