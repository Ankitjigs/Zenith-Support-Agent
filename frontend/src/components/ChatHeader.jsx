import { MessageCircle } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 shadow-md border border-primary">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center ">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Zenith Support Agent</h2>
          <p className="text-sm text-primary-foreground/80 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Online
          </p>
        </div>
      </div>
    </div>
  );
}
