"use client";

import { useEffect, useState, useRef } from "react";
import { Paperclip, Send, X, File as FileIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AstrologyChart from "@/components/AstrologyChart";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatClient({ projectId, mode = "general" }: { projectId: string; mode?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safe fetch on mount
  useEffect(() => {
    const init = async () => {
      try {
        const url = `/api/chat/${projectId || "default"}`;
        const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || 'sk-samai-iddjkdL6A-9Z-1WAyj489toPWny5UOrNJp8WTqTZPxaj48jxplCNgw') : 'sk-samai-iddjkdL6A-9Z-1WAyj489toPWny5UOrNJp8WTqTZPxaj48jxplCNgw';
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data.map((m: any, i: number) => ({
            id: String(i),
            role: m.role === "user" ? "user" : "assistant",
            content: String(m.content || ""),
          })));
        } else {
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: "Hello! I am SAM AI Turbo Engine. I can analyze multiple files, PDFs, images, and remember our context. How can I help you today?",
          }]);
        }
      } catch {
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: "Hello! I am SAM AI Turbo Engine. How can I assist you today?",
        }]);
      }
    };
    init();
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if ((!text && attachments.length === 0) || loading) return;

    // Build user message preview
    let previewContent = text;
    if (attachments.length > 0) {
      previewContent += `\n\n*[Attached ${attachments.length} file(s)]*`;
    }

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: previewContent };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    
    // Cache attachments and clear UI immediately for better UX
    const filesToSend = [...attachments];
    setAttachments([]);
    setLoading(true);

    try {
      const formData = new FormData();
      if (text) formData.append("content", text);
      formData.append("mode", mode);
      
      filesToSend.forEach(file => {
        formData.append("files", file);
      });

      const url = `/api/chat/${projectId || "default"}`;
      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || 'sk-samai-iddjkdL6A-9Z-1WAyj489toPWny5UOrNJp8WTqTZPxaj48jxplCNgw') : 'sk-samai-iddjkdL6A-9Z-1WAyj489toPWny5UOrNJp8WTqTZPxaj48jxplCNgw';
      const res = await fetch(url, {
        method: "POST",
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
        body: formData,
      });
      const data = await res.json();
      const reply = data.content || data.message || "SAM AI processed your files successfully.";
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: String(reply),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
      <div className="chat-messages" style={{ flex: 1, overflowY: "auto", paddingBottom: "120px" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", gap: "1.5rem", maxWidth: "850px", margin: "0 auto", width: "100%", marginBottom: "2rem", padding: "0 1rem" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "4px", 
              background: msg.role === "user" ? "#ececec" : "#10a37f",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontWeight: "bold", color: msg.role === "user" ? "#171717" : "#fff", fontSize: "0.8rem" }}>{msg.role === "user" ? "U" : "AI"}</span>
            </div>
            <div style={{ flex: 1, color: "#ececec", lineHeight: "1.7", fontSize: "1rem", minWidth: 0 }}>
            {msg.role === "assistant" ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  components={{
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    if (!inline && match && match[1] === 'astrology-chart') {
                      try {
                        const planetsData = JSON.parse(String(children).replace(/\n/g, ''))
                        return <AstrologyChart planets={planetsData} />
                      } catch(e) {
                        return <div style={{color:'red'}}>Error rendering chart</div>
                      }
                    }
                    return !inline && match ? (
                      <pre className={className} {...props} style={{ background: "rgba(0,0,0,0.5)", padding: "1rem", borderRadius: "8px", overflowX: "auto", margin: "1rem 0", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className={className} {...props} style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.1)", padding: "0.1rem 0.3rem", borderRadius: "4px", fontSize: "0.9em" }}>
                        {children}
                      </code>
                    )
                  }
                }}
                >
                {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
            )}
            </div>
          </div>
        ))}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="message-bubble ai"
            style={{ padding: "1rem", borderRadius: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Loader2 className="animate-spin" size={18} color="var(--primary)" />
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>SAM AI is thinking...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ position: "fixed", bottom: "0", left: "0", right: "0", padding: "1rem", background: "linear-gradient(to top, var(--bg-dark) 70%, transparent)", display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ width: "100%", maxWidth: "900px", pointerEvents: "auto", position: "relative" }}>
          
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                style={{ display: "flex", gap: "0.5rem", padding: "0.5rem", overflowX: "auto", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", borderRadius: "12px 12px 0 0", border: "1px solid var(--border)", borderBottom: "none" }}
              >
                {attachments.map((file, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.1)", padding: "0.4rem 0.8rem", borderRadius: "8px", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                    {file.type.startsWith('image/') ? <ImageIcon size={14} color="var(--primary)" /> : <FileIcon size={14} color="var(--primary)" />}
                    <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</span>
                    <button type="button" onClick={() => removeAttachment(idx)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={sendMessage} style={{ 
            display: "flex", gap: "0.5rem", 
            background: "#2f2f2f", 
            border: "1px solid rgba(255,255,255,0.1)", 
            borderRadius: attachments.length > 0 ? "0 0 24px 24px" : "24px", 
            padding: "0.5rem 1rem",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)"
          }}>
            <input 
              type="file" 
              multiple 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: "none" }} 
            />
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              style={{ background: "transparent", border: "none", color: "#b4b4b4", padding: "0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Paperclip size={20} />
            </button>
            
            <input
              type="text"
              placeholder="Message SAM AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{ flex: 1, background: "none", border: "none", color: "#ececec", outline: "none", padding: "0 1rem", fontSize: "1rem" }}
              autoFocus
            />
            
            <button 
              type="submit" 
              disabled={loading || (!input.trim() && attachments.length === 0)}
              style={{ 
                background: (!input.trim() && attachments.length === 0) ? "#424242" : "#ececec", 
                border: "none", color: (!input.trim() && attachments.length === 0) ? "#b4b4b4" : "#171717", padding: "0.6rem", cursor: loading ? "wait" : "pointer", 
                borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 600px) {
          .hide-on-mobile { display: none; }
        }
        .prose p { margin-bottom: 0.8rem; }
        .prose pre { background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; border: 1px solid rgba(255,255,255,0.1); }
        .prose code { font-family: monospace; background: rgba(255,255,255,0.1); padding: 0.1rem 0.3rem; border-radius: 4px; font-size: 0.9em; }
        .prose pre code { background: none; padding: 0; }
        .prose ul, .prose ol { margin-left: 1.5rem; margin-bottom: 1rem; }
        .prose li { margin-bottom: 0.3rem; }
        .prose a { color: var(--primary); text-decoration: underline; }
      `}} />
    </div>
  );
}
