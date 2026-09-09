"use client";

import React, { useState, useEffect } from "react";
import { Download, Cpu, HardDrive, Play, Save, CheckCircle2, AlertTriangle, Zap, Terminal } from "lucide-react";

export default function SamMastermindPage() {
  const [modelStatus, setModelStatus] = useState("Checking...");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const { getApiBaseUrl } = await import("../../../utils/api");
      const res = await fetch(`${getApiBaseUrl()}/api/mastermind/status`);
      const data = await res.json();
      if (data.status === "ready") {
        setModelStatus("Ready (Offline Mode)");
        setProgress(100);
        setLoading(false);
      } else if (data.status === "downloading") {
        setModelStatus("Downloading Weights (MiniMind / Qwen 0.5B GGUF)...");
        setProgress(data.percent);
        setLoading(true);
      } else if (data.status.startsWith("error")) {
        setModelStatus("Error: " + data.status);
        setLoading(false);
      } else {
        setModelStatus("Not Downloaded");
        setLoading(false);
      }
    } catch (e) {
      console.error("Backend not running", e);
    }
  };

  const handleDownloadModel = async () => {
    setLoading(true);
    setModelStatus("Starting Download...");
    try {
      const { getApiBaseUrl } = await import("../../../utils/api");
      await fetch(`${getApiBaseUrl()}/api/mastermind/download`, { method: "POST" });
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    
    try {
      const { getApiBaseUrl } = await import("../../../utils/api");
      const res = await fetch(`${getApiBaseUrl()}/api/mastermind/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: `[SYSTEM ERROR] ${data.detail || "Inference Failed"}` }]);
        return;
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `[SYSTEM ERROR] Cannot reach Local Engine. ${e.message}` }]);
    }
  };

  return (
    <div style={{ padding: "2rem", color: "#fff", maxWidth: "1200px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
        <Cpu size={40} color="#3b82f6" />
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, background: "linear-gradient(to right, #3b82f6, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SAM Mastermind Foundry
          </h1>
          <p style={{ color: "#9ca3af", margin: "4px 0 0 0" }}>Local LLM Integration & Offline Engine</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Left Panel: Engine Control */}
        <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "16px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
            <HardDrive size={20} color="#ec4899" /> Engine Status
          </h2>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ color: "#9ca3af" }}>Model Name:</span>
            <span style={{ fontWeight: 600 }}>SAM-Mastermind.gguf (Real API)</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <span style={{ color: "#9ca3af" }}>Status:</span>
            <span style={{ fontWeight: 600, color: modelStatus.includes("Ready") ? "#10b981" : "#f59e0b" }}>{modelStatus}</span>
          </div>

          {progress > 0 && progress < 100 && (
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", marginBottom: "1.5rem", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #3b82f6, #ec4899)", transition: "width 0.3s ease" }}></div>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "4px", textAlign: "right" }}>{progress}% Downloaded</div>
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              onClick={handleDownloadModel}
              disabled={loading || modelStatus.includes("Ready")}
              style={{ flex: 1, padding: "0.8rem", borderRadius: "8px", border: "none", background: modelStatus.includes("Ready") ? "rgba(255,255,255,0.1)" : "#3b82f6", color: "#fff", fontWeight: 600, cursor: (loading || modelStatus.includes("Ready")) ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
            >
              {modelStatus.includes("Ready") ? <CheckCircle2 size={18} /> : <Download size={18} />} 
              {modelStatus.includes("Ready") ? "Model Cached Locally" : "Start Real Download"}
            </button>
            <button 
              onClick={() => setChatMode(true)}
              disabled={!modelStatus.includes("Ready")}
              style={{ flex: 1, padding: "0.8rem", borderRadius: "8px", border: "none", background: !modelStatus.includes("Ready") ? "rgba(255,255,255,0.1)" : "#ec4899", color: "#fff", fontWeight: 600, cursor: !modelStatus.includes("Ready") ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
            >
              <Zap size={18} /> Launch Inference
            </button>
          </div>
        </div>

        {/* Right Panel: Chat */}
        <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(236, 72, 153, 0.3)", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem", marginBottom: "1rem" }}>
            <Terminal size={20} color="#3b82f6" /> Offline Engine Workspace
          </h2>

          {!chatMode ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#9ca3af", textAlign: "center", gap: "1rem" }}>
              <AlertTriangle size={48} color="#f59e0b" opacity={0.5} />
              <p>Engine is offline. Download the real weights and Launch Inference to chat with SAM Mastermind locally via llama-cpp.</p>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#9ca3af", marginTop: "2rem" }}>Local Engine Active. True Offline Inference.</div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#3b82f6" : "rgba(255,255,255,0.1)", padding: "0.8rem 1.2rem", borderRadius: "12px", maxWidth: "80%" }}>
                      {m.content}
                    </div>
                  ))
                )}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleChat()}
                  placeholder="Ask the local model..."
                  style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "0.8rem", color: "#fff", outline: "none" }}
                />
                <button onClick={handleChat} style={{ background: "#ec4899", border: "none", borderRadius: "8px", padding: "0 1.2rem", color: "#fff", cursor: "pointer" }}>
                  <Play size={18} />
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
