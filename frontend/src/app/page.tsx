"use client";

import React, { useState } from "react";
import { Menu, Plus, MessageSquare, Send, Paperclip } from "lucide-react";

export default function SamAIHome() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState("general");

  const modules = [
    { id: "general", name: "General Chat", icon: "🌐" },
    { id: "admin_train", name: "Admin Training", icon: "🧠" },
    { id: "astrology", name: "Astrology Expert", icon: "🦀" },
    { id: "history", name: "Sri Lankan History", icon: "🏛️" },
    { id: "admin", name: "Admin & Legal", icon: "⚖️" },
    { id: "rag_search", name: "Live News & RAG", icon: "📰" },
    { id: "apk_decomp", name: "APK Decompiler", icon: "📱" },
    { id: "flutter_studio", name: "Flutter Studio", icon: "💻" }
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    const userMsg = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", userText);
      formData.append("mode", selectedModule);

      const { apiFetch } = await import("../utils/api");
      const data = await apiFetch("/chat/samai_desktop", {
        method: "POST",
        body: formData
      });
      
      const replyContent = data.response || data.content || (Array.isArray(data) ? data[data.length-1].content : JSON.stringify(data));

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyContent }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection to SamAI backend failed. Please ensure the Python server is running on port 8000." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div 
        className={`${isSidebarOpen ? "w-[260px]" : "w-0"} flex-shrink-0 bg-gray-50 flex flex-col transition-all duration-300 border-r border-gray-200`}
      >
        <div className="p-3 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-md text-gray-500"
            title="Close sidebar"
          >
            <Menu size={20} />
          </button>
          <button className="flex-1 ml-2 flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-md transition-colors text-sm font-medium">
            <Plus size={16} />
            <span>New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 mb-2 px-2">Today</p>
            <button className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-200 rounded-md text-sm text-left truncate text-gray-700">
              <MessageSquare size={16} className="flex-shrink-0" />
              <span className="truncate">How to use SamAI</span>
            </button>
          </div>
        </div>

        <div className="p-3 border-t border-gray-200">
          <button className="w-full flex items-center gap-2 px-2 py-3 hover:bg-gray-200 rounded-md text-sm text-gray-700 font-medium">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
              U
            </div>
            <span>User Profile</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Header (Mobile / Toggle) */}
        <div className="h-14 flex items-center px-4 justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md z-10 relative">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
                title="Open sidebar"
              >
                <Menu size={20} />
              </button>
            )}
            <span className="font-bold text-gray-800 text-xl tracking-tight hidden sm:block">Sam<span className="text-blue-600">AI</span></span>
            
            {/* Module Selector */}
            <div className="relative flex items-center">
              <select 
                value={selectedModule} 
                onChange={(e) => setSelectedModule(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 font-medium py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm shadow-sm">
            U
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pb-32 pt-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                <span className="text-3xl text-blue-600 font-bold">{modules.find(m => m.id === selectedModule)?.icon || "S"}</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">How can I help you today?</h2>
              <p className="text-gray-500 mb-8 font-medium">Currently using: <span className="text-blue-600">{modules.find(m => m.id === selectedModule)?.name}</span></p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  { icon: "💻", text: "Write a React component for a chat UI" },
                  { icon: "💡", text: "Give me ideas for a new startup" },
                  { icon: "📄", text: "Summarize this long article for me" },
                  { icon: "🎨", text: "Describe a beautiful sunset scene" }
                ].map((item, i) => (
                  <button key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm text-gray-600 font-medium">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full max-w-3xl mx-auto px-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 mb-8 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                      <span className="text-sm font-bold text-blue-600">S</span>
                    </div>
                  )}
                  
                  <div className={`px-5 py-3 rounded-2xl max-w-[85%] text-[15px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-gray-100 text-gray-800 rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-1">
                      U
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto relative">
            <div className="relative flex items-center w-full bg-gray-100 border border-transparent focus-within:border-gray-300 focus-within:bg-white rounded-3xl shadow-sm transition-all overflow-hidden pl-4 pr-2 py-2">
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip size={20} />
              </button>
              
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${modules.find(m => m.id === selectedModule)?.name}...`}
                className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 min-h-[44px] py-3 px-2 text-[15px]"
                rows={1}
                style={{ overflowY: 'auto' }}
              />
              
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-2 rounded-full flex items-center justify-center transition-colors ml-2 ${
                  input.trim() 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} className={input.trim() ? "ml-0.5" : ""} />
              </button>
            </div>
            
            <div className="text-center mt-3">
              <span className="text-xs text-gray-400">
                SamAI can make mistakes. Consider verifying important information.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
