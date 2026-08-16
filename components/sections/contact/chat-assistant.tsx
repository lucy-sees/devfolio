// components/sections/contact/chat-assistant.tsx
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";
import ReactMarkdown from "react-markdown";
import { buttonTap } from "@/lib/motion";

type Message = {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
};

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type QuickOption = {
  text: string;
  message: string;
};

type ConfirmClearState = {
  show: boolean;
  timeoutId?: ReturnType<typeof setTimeout>;
};

const RATE_LIMIT_KEY = "chatRateLimit";
const MAX_MESSAGES_PER_HOUR = 20;
const MESSAGE_HISTORY_LIMIT = 5;

const QUICK_OPTIONS: QuickOption[] = [
  {
    text: "👩‍💻 Skills & Experience",
    message: "Can you tell me about Lucy's main skills and experience?",
  },
  {
    text: "🚀 Project Collaboration",
    message: "I'm interested in working with Lucy. What's the best way to start?",
  },
  {
    text: "💼 Past Projects",
    message: "Could you share some examples of Lucy's past projects?",
  },
  {
    text: "⚡ AI Integration",
    message: "What kind of AI features can Lucy implement in projects?",
  },
];

const WELCOME_MESSAGE =
  "Hi! I'm Lucy's AI assistant. I can help you learn more about her skills, experience, or how she can help with your project. What would you like to know?";

export default function ChatAssistant() {
  const [remainingMessages, setRemainingMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      if (stored) {
        const { count, timestamp } = JSON.parse(stored);
        if (Date.now() - timestamp > 3600000) {
          return MAX_MESSAGES_PER_HOUR;
        }
        return count;
      }
    }
    return MAX_MESSAGES_PER_HOUR;
  });

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_MESSAGE, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [confirmClear, setConfirmClear] = useState<ConfirmClearState>({ show: false });

  useEffect(() => {
    if (remainingMessages < MAX_MESSAGES_PER_HOUR) {
      localStorage.setItem(
        RATE_LIMIT_KEY,
        JSON.stringify({ count: remainingMessages, timestamp: Date.now() })
      );
    }
  }, [remainingMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const debouncedApiCall = useCallback((chatMessages: ChatMessage[]) => {
    const apiCall = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatMessages.slice(-MESSAGE_HISTORY_LIMIT),
            config: { temperature: 0.7, maxTokens: 2048 },
          }),
        });

        if (!response.ok) throw new Error("Failed to get response");

        const data = await response.json();
        const content = data.content.replace(/<[^>]*>/g, "");

        setMessages((prev) => [
          ...prev,
          { role: "assistant" as const, content, timestamp: new Date() },
        ]);
      } catch (error) {
        console.error("Chat Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant" as const,
            content:
              "I apologize, but I'm having trouble connecting right now. Please try again or use the contact form.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    };
    return debounce(apiCall, 750)();
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    if (remainingMessages <= 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "You've reached the maximum number of messages for now. Please try again later or use the contact form.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    if (messages.length >= 15) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I've enjoyed our chat! For more detailed discussions, please use the contact form or reach out directly via email.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const userMessage: Message = { role: "user", content: text.trim(), timestamp: new Date() };
    const chatMessages: ChatMessage[] = [...messages, userMessage].map(({ role, content }) => ({
      role,
      content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setRemainingMessages((prev: number) => prev - 1);
    debouncedApiCall(chatMessages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickOptionClick = (option: QuickOption) => {
    if (isTyping || remainingMessages <= 0) return;
    sendMessage(option.message);
  };

  const handleClearClick = () => {
    if (confirmClear.show) {
      setMessages([{ role: "assistant", content: WELCOME_MESSAGE, timestamp: new Date() }]);
      if (confirmClear.timeoutId) clearTimeout(confirmClear.timeoutId);
      setConfirmClear({ show: false });
    } else {
      const timeoutId = setTimeout(() => setConfirmClear({ show: false }), 3000);
      setConfirmClear({ show: true, timeoutId });
    }
  };

  useEffect(() => {
    return () => {
      if (confirmClear.timeoutId) clearTimeout(confirmClear.timeoutId);
    };
  }, [confirmClear.timeoutId]);

  return (
    <div className="flex flex-col h-[500px] max-h-[500px] w-full bg-muted border border-border rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 border-b border-border bg-muted">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bot size={18} />
          <span>AI Assistant</span>
        </div>

        <motion.button
          onClick={handleClearClick}
          {...buttonTap}
          className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
            confirmClear.show
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "hover:bg-background/80"
          }`}
        >
          {confirmClear.show ? (
            <>
              <AlertCircle size={16} />
              <span className="text-sm">Confirm clear?</span>
            </>
          ) : (
            <Trash2 size={16} className="text-muted-foreground" />
          )}
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 hc-scrollbar text-sm">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "assistant" ? <Bot size={24} /> : <User size={24} />}
              <div
                style={{
                  clipPath:
                    msg.role === "assistant"
                      ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%, -10px 50%)"
                      : "polygon(0% 0%, 100% 0%, 100% 50%, calc(100% + 10px) 50%, 100% 100%, 0% 100%)",
                }}
                className={`rounded-2xl p-3 max-w-[80%] text-left ${
                  msg.role === "assistant" ? "bg-secondary/15" : "bg-primary/50"
                }`}
              >
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-normal prose-pre:bg-background/50 prose-pre:p-2">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-bold mb-2">{children}</h3>,
                    code: ({ children }) => (
                      <code className="bg-background/50 rounded px-1">{children}</code>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>

                {i === 0 && messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="mt-4 flex flex-col gap-2"
                  >
                    {QUICK_OPTIONS.map((option) => (
                      <motion.button
                        key={option.text}
                        {...buttonTap}
                        onClick={() => handleQuickOptionClick(option)}
                        className="text-left px-3 py-2 rounded-md bg-background/50 hover:bg-background/80 transition-colors text-sm"
                        disabled={isTyping || remainingMessages <= 0}
                      >
                        {option.text}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <Bot size={24} />
            <div className="bg-muted rounded-lg p-3">
              <span className="animate-pulse">...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-background rounded-lg px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isTyping}
          />
          <motion.button
            type="submit"
            disabled={isTyping || !input.trim()}
            {...buttonTap}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
