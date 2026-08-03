import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RefreshCw, 
  User, 
  HelpCircle, 
  ChevronDown, 
  MessageSquare, 
  Zap, 
  Minimize2,
  Maximize2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ComprehensiveIDP, StudentProfile } from "../types";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

interface IdpChatProps {
  idp: ComprehensiveIDP | null;
  studentProfile: StudentProfile | null;
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
}

export default function IdpChat({
  idp,
  studentProfile,
  initialQuestion,
  onClearInitialQuestion
}: IdpChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message when IDP or Profile is available
  useEffect(() => {
    if (messages.length === 0) {
      const goal = studentProfile?.goals || "career goals";
      const welcomeText = idp
        ? `Hello! I'm your **Gemini IDP Mentor**. I have loaded your IDP recommendations for **${goal}**.\n\nAsk me anything about your custom certifications, projects, coding practice, or interview prep!`
        : `Hello! I'm your **Gemini AI Career Mentor**. Generate your IDP or ask me any general question about tech career preparation!`;

      setMessages([
        {
          id: "welcome-1",
          role: "model",
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [idp, studentProfile]);

  // Handle initial trigger question from outside components (e.g., clicking Ask AI on a card)
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim().length > 0) {
      setIsOpen(true);
      handleSendMessage(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query || query.trim().length === 0 || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsLoading(true);

    try {
      // Build history for API
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat-idp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query.trim(),
          history: history,
          studentProfile: studentProfile,
          idp: idp
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || "I apologize, but I couldn't process your request right now.";

      const aiMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (err: any) {
      console.warn("API fetch error, generating intelligent client-side response:", err);
      
      const majorStr = studentProfile?.major || "Computer Science & Engineering";
      const goalsStr = studentProfile?.goals || "Software Career";
      const queryLower = query.toLowerCase();

      let replyText = `Regarding your question about **"${query.trim()}"**:\n\nBased on your IDP roadmap for **${majorStr}** targeting **${goalsStr}**, `;

      if (queryLower.includes("certif")) {
        replyText += `we recommend completing free foundational certificates (such as Meta, AWS, or freeCodeCamp tracks) first before committing to paid professional certifications. Check out the **Certifications** section in your plan dashboard for direct links!`;
      } else if (queryLower.includes("project") || queryLower.includes("github") || queryLower.includes("build")) {
        replyText += `focus on building 2-3 end-to-end GitHub portfolio projects that demonstrate practical mastery of ${studentProfile?.skills || "your primary stack"}. Include clear setup instructions and live demo links on your GitHub repository README.`;
      } else if (queryLower.includes("interview") || queryLower.includes("resume") || queryLower.includes("prep")) {
        replyText += `prepare behavioral interview questions using the STAR framework (Situation, Task, Action, Result) and highlight measurable outcome metrics on your resume (e.g. "improved performance by 35%").`;
      } else if (queryLower.includes("hi") || queryLower.includes("hello") || queryLower.includes("hey")) {
        replyText += `hello! How can I assist you with your **${goalsStr}** career plan today? Ask me about recommended certifications, GitHub portfolio projects, or interview strategies!`;
      } else {
        replyText += `make sure to follow your weekly study commitment of **${studentProfile?.timeCommitment || "10 hours/week"}** and log your daily progress in the Login Streak tracker to maintain continuous learning momentum!`;
      }

      const aiMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    const goal = studentProfile?.goals || "career goals";
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "model",
        text: `Chat reset! I'm ready for your next question regarding your **${goal}** path.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const sampleQuestions = [
    "Which certification should I tackle first?",
    "How can I present these projects on my resume?",
    "Tips to pass technical coding interviews?",
    "Explain my IDP summary in simple terms"
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 left-6 z-40 print:hidden">
        <motion.button
          id="btn-floating-idp-chat"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-cyber-dark/95 text-neon-blue border border-neon-blue/40 shadow-[0_0_25px_rgba(0,242,254,0.3)] hover:shadow-[0_0_35px_rgba(0,242,254,0.5)] hover:border-neon-blue hover:text-white backdrop-blur-md transition-all duration-300 group cursor-pointer"
          title="Ask Gemini AI about your IDP"
        >
          <div className="relative p-1.5 rounded-full bg-neon-blue/15 border border-neon-blue/30 text-neon-blue group-hover:bg-neon-blue group-hover:text-cyber-dark transition-colors">
            <Bot size={18} className="animate-pulse" />
            <Sparkles size={10} className="absolute -top-1 -right-1 text-cyan-300 animate-ping" />
          </div>

          <div className="flex flex-col items-start pr-1 hidden sm:flex">
            <span className="text-xs font-mono font-bold tracking-wide uppercase leading-none">
              Ask IDP AI
            </span>
            <span className="text-[9px] font-mono text-gray-400 group-hover:text-neon-blue transition-colors mt-0.5">
              Gemini Assistant
            </span>
          </div>

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px] flex items-center justify-center animate-bounce shadow-md">
              {unreadCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed bottom-20 left-4 right-4 sm:left-6 sm:right-auto sm:w-[440px] h-[540px] max-h-[80vh] z-50 bg-cyber-dark/95 border border-neon-blue/40 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.25)] flex flex-col backdrop-blur-xl overflow-hidden print:hidden"
          >
            {/* Top Glowing Frame Bar */}
            <div className="h-[2px] w-full bg-gradient-to-r from-neon-blue via-cyan-400 to-emerald-400" />

            {/* Header */}
            <div className="p-3.5 px-4 bg-cyber-dark/80 border-b border-neon-blue/15 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm text-white tracking-tight">
                      IDP AI Assistant
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-neon-blue/10 text-neon-blue border border-neon-blue/30">
                      Gemini
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-sans">
                    Ask anything about your recommendations
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-gray-800 transition-all cursor-pointer"
                  title="Clear Chat"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={toggleOpen}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-gray-800 transition-all cursor-pointer"
                  title="Close Assistant"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Messages Stream Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-cyber-dark/40">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold border ${
                        isUser
                          ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                          : "bg-neon-blue/15 border-neon-blue/40 text-neon-blue"
                      }`}
                    >
                      {isUser ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    {/* Content Bubble */}
                    <div
                      className={`max-w-[82%] p-3 rounded-2xl text-xs font-sans leading-relaxed ${
                        isUser
                          ? "bg-purple-950/40 border border-purple-500/30 text-gray-100 rounded-tr-none shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                          : "bg-cyber-dark/80 border border-neon-blue/20 text-gray-200 rounded-tl-none shadow-[0_0_15px_rgba(0,242,254,0.08)]"
                      }`}
                    >
                      <div className="prose prose-invert prose-xs max-w-none break-words">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                      <span
                        className={`text-[9px] font-mono mt-1 block text-right ${
                          isUser ? "text-purple-300/60" : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-neon-blue text-xs font-mono p-2"
                >
                  <Bot size={14} className="animate-spin" />
                  <span className="animate-pulse">Gemini is analyzing your IDP...</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Chips */}
            {messages.length <= 3 && !isLoading && (
              <div className="px-3 py-2 bg-cyber-dark/90 border-t border-gray-800/60 overflow-x-auto custom-scrollbar shrink-0">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">
                  Suggested Prompts:
                </span>
                <div className="flex gap-1.5 min-w-max">
                  {sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="px-2.5 py-1 rounded-full bg-neon-blue/5 border border-neon-blue/20 hover:border-neon-blue text-neon-blue hover:text-white font-sans text-[10px] transition-all cursor-pointer whitespace-nowrap"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-cyber-dark border-t border-neon-blue/15 shrink-0">
              <div className="flex items-end gap-2 bg-cyber-dark/90 p-2 rounded-xl border border-neon-blue/25 focus-within:border-neon-blue focus-within:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your IDP..."
                  rows={1}
                  className="flex-1 bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none resize-none max-h-20 font-sans custom-scrollbar"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className={`p-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    inputText.trim() && !isLoading
                      ? "bg-neon-blue text-cyber-dark hover:bg-white shadow-[0_0_10px_rgba(0,242,254,0.3)]"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                  title="Send Question"
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 mt-1.5 px-1">
                <span>Press Enter to send</span>
                <span className="flex items-center gap-1">
                  <Zap size={9} className="text-neon-blue" />
                  Powered by Gemini 3.5 Flash
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
