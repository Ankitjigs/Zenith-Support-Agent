function TopicCard({ icon, title, question, onClick }) {
  return (
    <button
      onClick={() => onClick(question)}
      className="group flex flex-col items-start p-3 hover:cursor-pointer bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary/30 rounded-xl transition-all duration-200 text-left shadow-sm hover:shadow-md"
    >
      <span className="material-symbols-outlined text-indigo-500 text-xl mb-1.5 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="text-xs font-semibold text-slate-700 group-hover:text-primary">
        {title}
      </span>
    </button>
  );
}

export default TopicCard;
