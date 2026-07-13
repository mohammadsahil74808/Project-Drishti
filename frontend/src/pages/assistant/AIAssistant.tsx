/**
 * SentinelX AI — AI Assistant Page
 *
 * Advanced Cyber-Intelligence Terminal UI.
 * Full-screen chat interface for the LangChain-backed assistant (SQL tool + RAG tool).
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Send, Sparkles, User, TerminalSquare } from "lucide-react";
import type { ChatMessage } from "@/types";

const SUGGESTED_PROMPTS = [
  "How many chain-snatching cases were reported in Bengaluru Urban this month?",
  "Show me the vehicle theft trend in Whitefield over the last 6 months",
  "Summarize common MO patterns in recent burglary cases",
  "Which districts have rising forecast risk this weekend?",
];

function simulateResponse(prompt: string): string {
  if (/vehicle theft|whitefield/i.test(prompt)) {
    return "Vehicle theft in Whitefield has declined 8% over the last 6 months, from 54 to 50 monthly cases, following increased night patrols introduced in March. Two-wheelers account for 71% of thefts, concentrated near ITPL Main Road between 10 PM–2 AM.";
  }
  if (/chain.snatching|bengaluru urban/i.test(prompt)) {
    return "Bengaluru Urban recorded 212 chain-snatching cases this month, up 34% quarter-over-quarter. 68% occurred on weekends between 7–9 PM, concentrated near transit hubs including Majestic and Shivajinagar.";
  }
  if (/burglary|mo pattern/i.test(prompt)) {
    return "Recent burglary cases show a recurring pattern: forced entry via rear windows during 1–4 AM on weekdays, with 40% of cases in gated communities where perimeter CCTV coverage is incomplete.";
  }
  if (/forecast|weekend/i.test(prompt)) {
    return "Bengaluru Urban and Mysuru show elevated forecast risk this weekend, driven by a festival + payday overlap. Predicted case volume is 18% above the 4-week baseline in both districts.";
  }
  return "Based on the latest FIR data and forecast models, I don't have a specific pattern to highlight for that query yet — try asking about a specific district, crime type, or time range.";
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "I'm the SentinelX AI Assistant. Ask me anything about crime trends, forecasts, hotspots, or case patterns — in plain English.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsThinking(true);

    await new Promise((r) => setTimeout(r, 1200));

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: simulateResponse(text),
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, assistantMsg]);
    setIsThinking(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#040814] to-[#040814]">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 border-b border-[#00F2FE]/10 bg-[#040814]/80 backdrop-blur-xl z-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#00F2FE]/10 flex items-center justify-center border border-[#00F2FE]/30 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <TerminalSquare className="h-5 w-5 text-[#00F2FE]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-wide font-rajdhani">SENTINEL_AI</h1>
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#00F2FE] bg-[#00F2FE]/10 border border-[#00F2FE]/30 rounded-full px-2.5 py-0.5 tracking-wider shadow-[0_0_10px_rgba(0,242,254,0.2)]">
                <Sparkles className="h-3 w-3" /> LangChain · RAG Core
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-inter">
              Encrypted Natural Language Intelligence Query System
            </p>
          </div>
        </div>
      </div>

      {/* Message stream */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                m.role === "assistant"
                  ? "bg-[#00F2FE]/10 text-[#00F2FE] border-[#00F2FE]/30 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
              }`}
            >
              {m.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed font-inter relative ${
                m.role === "assistant"
                  ? "bg-slate-900/60 text-slate-200 border-l-2 border-l-[#00F2FE] border-t border-r border-b border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md rounded-tl-sm"
                  : "bg-indigo-500/15 text-indigo-50 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] rounded-tr-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* Processing Animation */}
        {isThinking && (
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/50 shadow-[0_0_20px_rgba(0,242,254,0.4)] flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="h-5 w-5" />
            </div>
            <div className="bg-slate-900/60 border-l-2 border-l-[#00F2FE] border-y border-r border-white/5 rounded-2xl rounded-tl-sm px-6 py-4 flex items-center gap-3 w-48 backdrop-blur-md relative overflow-hidden">
              {/* Scanning bar effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00F2FE]/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              
              <span className="text-xs font-rajdhani text-[#00F2FE] uppercase tracking-widest font-bold">Processing</span>
              <div className="flex gap-1.5 ml-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] animate-bounce [animation-delay:-0.3s] shadow-[0_0_8px_#00F2FE]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] animate-bounce [animation-delay:-0.15s] shadow-[0_0_8px_#00F2FE]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] animate-bounce shadow-[0_0_8px_#00F2FE]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="px-8 pb-4 flex flex-wrap gap-3">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="text-xs text-slate-400 bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 hover:text-[#00F2FE] hover:border-[#00F2FE]/50 hover:bg-[#00F2FE]/5 hover:shadow-[0_0_15px_rgba(0,242,254,0.15)] transition-all duration-300 text-left backdrop-blur-md"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-6 bg-[#040814]/90 backdrop-blur-xl border-t border-[#00F2FE]/10">
        <form 
          onSubmit={handleSubmit} 
          className="relative group flex items-center bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden focus-within:border-[#00F2FE]/50 focus-within:shadow-[0_0_25px_rgba(0,242,254,0.15)] transition-all duration-300"
        >
          <div className="pl-4 pr-2 text-[#00F2FE] opacity-50 group-focus-within:opacity-100 transition-opacity">
            <TerminalSquare className="h-5 w-5" />
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Initialize query protocol..."
            className="flex-1 bg-transparent px-2 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none font-inter tracking-wide"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isThinking}
            className="mr-2 h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] disabled:opacity-30 disabled:hover:bg-indigo-500/20 disabled:hover:text-indigo-400 disabled:hover:shadow-none transition-all duration-300"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
