import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

function LoadMoreButton({ hasMore, isLoadingMore, onClick }) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mb-4">
      <button
        onClick={onClick}
        disabled={isLoadingMore}
        className={cn(
          "flex items-center justify-center cursor-pointer gap-2 px-5 py-2 mb-4 text-xs font-semibold text-indigo-700 bg-indigo-50 borderborder-indigo-100 rounded-full shadow-sm hover:shadow-md hover:bg-indigo-100 transition-all duration-300 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/50 dark:hover:bg-indigo-900/40"
        )}
      >
        {isLoadingMore ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading older messages...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">
              refresh
            </span>
            Load previous messages
          </>
        )}
      </button>
    </div>
  );
}

export default LoadMoreButton;
