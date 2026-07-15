import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, User, TerminalSquare, Search, Plus, MessageSquare, Pin, MoreHorizontal, Mic, Paperclip, Copy, RotateCcw, ThumbsUp, ThumbsDown, ShieldAlert, FileText, Map, Activity, Shield, Brain } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { ChatMessage } from "@/types";
import { assistantApi } from "@/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

const SUGGESTED_PROMPTS = [
  { icon: ShieldAlert, text: "Show theft trends in Bengaluru" },
  { icon: FileText, text: "Summarize today's FIRs" },
  { icon: Map, text: "Predict tomorrow's hotspots" },
  { icon: Activity, text: "Analyze crime pattern" },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { mutate: sendChat, isPending: isThinking } = useMutation({
    mutationFn: (text: string) => assistantApi.chat(text),
    onSuccess: (data) => {
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response || data.content || "Message received but no content returned.",
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMsg]);
    },
    onError: (err: any) => {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request: " + (err.response?.data?.detail || err.message),
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, errorMsg]);
    }
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    
    sendChat(text);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-[#020617] overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      
      {/* Sidebar - Left */}
      <div className="w-72 bg-[#050B14]/80 backdrop-blur-2xl border-r border-white/10 flex flex-col shrink-0 hidden lg:flex">
         <div className="p-4 border-b border-white/5">
            <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-colors group">
               <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Plus className="w-4 h-4 text-[#00E5FF] group-hover:rotate-90 transition-transform duration-300" />
                  New Chat
               </div>
               <TerminalSquare className="w-4 h-4 text-white/30" />
            </button>
            <div className="mt-4 relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#00E5FF] transition-colors" />
               <input placeholder="Search chats..." className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF]/50 transition-colors" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
            <div>
               <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-2 mb-2 flex items-center gap-1.5"><Pin className="w-3 h-3"/> Pinned Chats</div>
               <div className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left group">
                     <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
                     <div className="flex-1 truncate text-xs text-white font-medium">Bengaluru Urban Analysis</div>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group">
                     <MessageSquare className="w-4 h-4 text-[#00E5FF]" />
                     <div className="flex-1 truncate text-xs text-white/70 group-hover:text-white font-medium">Missing Persons Correlation</div>
                  </button>
               </div>
            </div>
            
            <div>
               <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-2 mb-2">Recent Chats</div>
               <div className="space-y-1">
                  {[...Array(5)].map((_, i) => (
                     <button key={i} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <MessageSquare className="w-4 h-4 text-white/30 group-hover:text-white/50 shrink-0" />
                           <div className="flex-1 truncate text-xs text-white/50 group-hover:text-white/80 transition-colors">Historical crime rate in Mysore...</div>
                        </div>
                        <MoreHorizontal className="w-3 h-3 text-transparent group-hover:text-white/40 shrink-0" />
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Main Chat Area - Center */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-b from-[#020617] to-[#050B14]">
         {/* Top Header */}
         <div className="h-14 flex items-center px-6 border-b border-white/5 bg-black/20 backdrop-blur-md absolute top-0 w-full z-10">
            <div className="flex items-center gap-3">
               <Shield className="w-5 h-5 text-[#00E5FF]" />
               <span className="font-bold text-sm tracking-wider text-white">SentinelX Intelligence Core</span>
               <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[9px] font-bold uppercase tracking-widest text-[#8B5CF6]">v2.4 GPT-4</span>
            </div>
         </div>

         {/* Chat Scroll Area */}
         <div className="flex-1 overflow-y-auto px-4 md:px-12 lg:px-24 pt-24 pb-32 scrollbar-thin scrollbar-thumb-white/10 relative">
            {messages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-1000 min-h-[400px]">
                  <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
                     <div className="absolute inset-0 bg-[#00E5FF] blur-[60px] opacity-20 rounded-full" />
                     <div className="absolute inset-0 border-t border-r border-[#00E5FF]/40 rounded-full animate-[spin_4s_linear_infinite]" />
                     <div className="absolute inset-2 border-b border-l border-[#8B5CF6]/40 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                     <Brain className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] relative z-10" />
                  </div>
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-3 tracking-wide">How can I assist you today?</h2>
                  <p className="text-sm text-white/40 max-w-md mx-auto mb-12 leading-relaxed">I am SentinelX AI. Ask me to analyze crime patterns, generate automated reports, or predict regional hotspots across Karnataka.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                     {SUGGESTED_PROMPTS.map((p, i) => (
                        <button key={i} onClick={() => sendMessage(p.text)} className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/0 via-[#00E5FF]/0 to-[#00E5FF]/0 group-hover:via-[#00E5FF]/5 transition-colors" />
                           <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-[#00E5FF]/30 transition-colors shrink-0">
                              <p.icon className="w-5 h-5 text-white/50 group-hover:text-[#00E5FF] transition-colors" />
                           </div>
                           <div className="flex-1 mt-2">
                              <span className="text-sm text-white/70 group-hover:text-white transition-colors block leading-snug">{p.text}</span>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            ) : (
               <div className="space-y-8 pb-10 max-w-3xl mx-auto w-full">
                  {messages.map((m) => (
                     <motion.div 
                        key={m.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-5 w-full group ${m.role === "user" ? "flex-row-reverse" : ""}`}
                     >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg mt-1 ${m.role === "assistant" ? "bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 border border-[#00E5FF]/30" : "bg-white/10 border border-white/20"}`}>
                           {m.role === "assistant" ? <Brain className="w-4 h-4 text-[#00E5FF]" /> : <User className="w-4 h-4 text-white/70" />}
                        </div>
                        <div className={`flex-1 flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                           <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${m.role === "assistant" ? "bg-transparent text-white/90" : "bg-white/10 backdrop-blur-md border border-white/5 text-white"}`}>
                              {m.role === "assistant" ? (
                                 <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-th:text-[#00E5FF] prose-td:border-white/10 prose-table:border-white/10 prose-a:text-[#00E5FF]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                                 </div>
                              ) : (
                                 m.content
                              )}
                           </div>
                           {m.role === "assistant" && (
                              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="p-1.5 rounded-md text-white/30 hover:text-white hover:bg-white/10 transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                                 <button className="p-1.5 rounded-md text-white/30 hover:text-white hover:bg-white/10 transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
                                 <div className="w-[1px] h-3 bg-white/10 mx-1" />
                                 <button className="p-1.5 rounded-md text-white/30 hover:text-[#10B981] hover:bg-[#10B981]/10 transition-colors"><ThumbsUp className="w-3.5 h-3.5" /></button>
                                 <button className="p-1.5 rounded-md text-white/30 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><ThumbsDown className="w-3.5 h-3.5" /></button>
                              </div>
                           )}
                        </div>
                     </motion.div>
                  ))}
                  
                  {isThinking && (
                     <div className="flex gap-5 w-full">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 border border-[#00E5FF]/30 flex items-center justify-center shrink-0 shadow-lg mt-1">
                           <Brain className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                        </div>
                        <div className="flex-1 flex flex-col items-start pt-2.5">
                           <div className="flex items-center gap-1.5 px-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce [animation-delay:-0.3s]" />
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce [animation-delay:-0.15s]" />
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce" />
                           </div>
                        </div>
                     </div>
                  )}
                  <div ref={bottomRef} className="h-4" />
               </div>
            )}
         </div>

         {/* Floating Input Area */}
         <div className="absolute bottom-0 w-full px-4 md:px-12 lg:px-24 pb-8 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent pt-10">
            <div className="max-w-3xl mx-auto w-full relative group">
               <form onSubmit={handleSubmit} className="relative flex items-end bg-[#050B14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.6)] focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-500">
                  <div className="flex flex-col flex-1 pb-1">
                     <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmit(e as any);
                           }
                        }}
                        placeholder="Ask SentinelX AI about crimes, FIRs, hotspots, reports or investigations..."
                        className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none resize-none max-h-32 min-h-[44px] scrollbar-thin scrollbar-thumb-white/10"
                        rows={1}
                     />
                  </div>
                  <div className="flex items-center gap-2 p-1">
                     <button type="button" className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"><Paperclip className="w-4 h-4" /></button>
                     <button type="button" className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"><Mic className="w-4 h-4" /></button>
                     <button type="submit" disabled={!input.trim() || isThinking} className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-[#00E5FF] hover:text-black hover:shadow-[0_0_20px_#00E5FF] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300">
                        <Send className="w-4 h-4" />
                     </button>
                  </div>
               </form>
               <div className="text-center mt-3 text-[10px] text-white/30 tracking-wide">SentinelX AI can make mistakes. Verify important information with base sources.</div>
            </div>
         </div>
      </div>
    </div>
  );
}
