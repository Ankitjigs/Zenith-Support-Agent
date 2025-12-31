import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <div
      className="h-screen w-full flex justify-center items-center p-4  overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fec6aaff 0%, #fdba74 40%, #f77931ff 100%)",
      }}
    >
      <div className="w-full max-w-2xl h-[calc(100vh-2rem)]">
        <ChatWidget />
      </div>
    </div>
  );
}

export default App;
