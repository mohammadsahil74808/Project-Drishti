/**
 * SentinelX AI — AI Assistant Page
 *
 * Full-screen chat interface for the LangChain-backed assistant (SQL tool +
 * RAG tool, per the blueprint). Responses are simulated locally for now —
 * replace `simulateResponse` with a WebSocket connection to
 * `/api/v1/assistant/chat` once the backend agent is live.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
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

    await new Promise((r) => setTimeout(r, 900));

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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-white">AI Assistant</h1>
          <span className="flex items-center gap-1 text-[11px] text-sx-accent bg-sx-accent/10 border border-sx-accent/30 rounded-full px-2 py-0.5">
            <Sparkles className="h-3 w-3" /> LangChain · RAG + SQL
          </span>
        </div>
        <p className="text-sm text-sx-text-dim mt-1">
          Natural-language querying across structured case data and FIR narratives
        </p>
      </div>

      {/* Message stream */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === "assistant"
                  ? "bg-sx-accent/15 text-sx-accent"
                  : "bg-sx-panel-light text-sx-text-dim"
              }`}
            >
              {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div
              className={`max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "assistant"
                  ? "bg-sx-panel border border-sx-border text-sx-text"
                  : "bg-sx-accent text-white"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-lg bg-sx-accent/15 text-sx-accent flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-sx-panel border border-sx-border rounded-xl px-4 py-3 flex gap-1 items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-sx-text-faint animate-pulse-slow" />
              <span className="h-1.5 w-1.5 rounded-full bg-sx-text-faint animate-pulse-slow [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-sx-text-faint animate-pulse-slow [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts (shown when conversation is fresh) */}
      {messages.length <= 1 && (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="text-xs text-sx-text-dim bg-sx-panel border border-sx-border rounded-full px-3 py-1.5 hover:text-white hover:border-sx-accent/50 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <Card className="mx-6 mb-6 rounded-xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about crime trends, forecasts, hotspots…"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-sx-text placeholder:text-sx-text-faint focus:outline-none"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isThinking}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
