import SuggestedQuestions from "./SuggestedQuestions";
import TopicCard from "./TopicCard";

const TOPICS = [
  {
    icon: "local_shipping",
    title: "Shipping & Delivery",
    question: " Tell me about shipping and delivery",
  },
  {
    icon: "assignment_return",
    title: "Returns & Refunds",
    question: "What is your return policy?",
  },
  {
    icon: "schedule",
    title: "Support Hours",
    question: "What are your support hours?",
  },
  {
    icon: "package_2",
    title: "Product Info",
    question: "Tell me about your products",
  },
];

const SUGGESTIONS = [
  "What is your return policy?",
  "Do you ship internationally?",
  "Track my order",
];

function WelcomeScreen({ onQuestionSelect }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-95 space-y-4">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-1 ring-1 ring-indigo-100">
            <span className="material-symbols-outlined text-[24px]">
              assistant
            </span>
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Welcome to Zenith Support Agent
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed px-4">
            I'm your AI assistant. Select a topic below or type your question to
            get started instantly.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 w-full">
          {TOPICS.map((topic) => (
            <TopicCard
              key={topic.title}
              icon={topic.icon}
              title={topic.title}
              question={topic.question}
              onClick={onQuestionSelect}
            />
          ))}
        </div>

        <SuggestedQuestions
          suggestions={SUGGESTIONS}
          onSuggestionClick={onQuestionSelect}
        />
      </div>
    </div>
  );
}

export default WelcomeScreen;
