import { AlertCircle } from "lucide-react";

function ErrorDisplay({ error, onClose }) {
  if (!error) return null;

  return (
    <div className="mx-4 mb-2 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
      <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
      <p className="text-sm text-destructive flex-1">{error}</p>
      <button
        onClick={onClose}
        className="text-destructive hover:text-destructive/80 transition-colors"
        aria-label="Close error"
      >
        <span className="text-lg leading-none">×</span>
      </button>
    </div>
  );
}

export default ErrorDisplay;
