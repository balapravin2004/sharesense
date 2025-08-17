import { Bot } from "lucide-react";

export default function GeminiButton({ setShowGemini }) {
  return (
    <button
      onClick={() => setShowGemini(true)}
      className="z-[190] fixed bottom-[4rem] md:bottom-12 right-2 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out">
      <Bot size={20} />
    </button>
  );
}
