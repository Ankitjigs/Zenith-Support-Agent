import { Loader2 } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Loading messages...
          </p>
          <p className="text-xs text-muted-foreground mt-1">Please wait</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
