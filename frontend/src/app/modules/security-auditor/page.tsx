"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, ShieldAlert, ShieldCheck, Code, AlertTriangle, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { motion } from "framer-motion";

export default function SecurityAuditorPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await apiFetch("/security/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      setResult(data);
    } catch (e: any) {
      alert("Error scanning code: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Secure") return "#10b981"; // Emerald
    if (status === "Vulnerable") return "#f59e0b"; // Amber
    if (status === "Critical") return "#ef4444"; // Red
    return "#6366f1"; // Indigo
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark)", color: "#fff", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <Link href="/modules" style={{ color: "#9ca3af", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "1rem", fontSize: "0.9rem" }}>
              <ArrowLeft size={16} /> Back to Modules
            </Link>
            <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "2.5rem", margin: 0, background: "linear-gradient(to right, #60a5fa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              <Shield size={40} color="#8b5cf6" /> SAM Code Guardian
            </h1>
            <p style={{ color: "#9ca3af", marginTop: "0.5rem", fontSize: "1.1rem" }}>AI-Powered Security Auditing & Vulnerability Patching</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: "2rem", transition: "all 0.3s ease" }}>
          
          {/* Input Section */}
          <div style={{ background: "rgba(30, 30, 40, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <Code size={20} color="#60a5fa" />
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>Source Code to Audit</h2>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your Express, React, or Python code here...&#10;We will scan for SQL Injection, XSS, Info Leaks, Missing Validation (Zod), and Hardcoded Secrets."
              style={{
                width: "100%", height: "400px", backgroundColor: "#0f1016", color: "#e5e7eb", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "1rem", fontFamily: "monospace", fontSize: "0.95rem", resize: "vertical", boxSizing: "border-box"
              }}
            />
            
            <button
              onClick={handleAudit}
              disabled={loading || !code.trim()}
              style={{
                width: "100%", marginTop: "1rem", padding: "1rem", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", opacity: (!code.trim() || loading) ? 0.7 : 1
              }}
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
              {loading ? "Scanning for vulnerabilities..." : "Run Security Audit"}
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Score Card */}
              <div style={{ background: "rgba(30, 30, 40, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: "#9ca3af", fontSize: "1rem" }}>Security Score</h3>
                  <div style={{ fontSize: "3rem", fontWeight: 800, color: getStatusColor(result.status) }}>
                    {result.score}/100
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "30px", background: `${getStatusColor(result.status)}20`, color: getStatusColor(result.status), fontWeight: 700, fontSize: "1.2rem" }}>
                    {result.status === "Secure" ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    {result.status}
                  </div>
                </div>
              </div>

              {/* Issues List */}
              <div style={{ background: "rgba(30, 30, 40, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem", flex: 1, overflowY: "auto", maxHeight: "400px" }}>
                <h3 style={{ margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertTriangle size={18} color="#f59e0b" /> Detected Vulnerabilities ({result.issues?.length || 0})
                </h3>
                
                {result.issues && result.issues.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {result.issues.map((issue: any, idx: number) => (
                      <div key={idx} style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "8px", borderLeft: `4px solid ${issue.severity === 'High' ? '#ef4444' : issue.severity === 'Medium' ? '#f59e0b' : '#3b82f6'}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                          <strong style={{ color: "#fff" }}>{issue.title}</strong>
                          <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", color: "#e5e7eb" }}>{issue.severity}</span>
                        </div>
                        <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#9ca3af", lineHeight: 1.5 }}>{issue.description}</p>
                        <div style={{ fontSize: "0.85rem", color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "8px", borderRadius: "6px" }}>
                          ?? <strong>Fix:</strong> {issue.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#10b981" }}>
                    <CheckCircle size={40} style={{ margin: "0 auto 1rem auto", opacity: 0.8 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No vulnerabilities detected! The code looks solid.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Fixed Code Section */}
        {result && result.fixed_code && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "2rem", background: "rgba(30, 30, 40, 0.6)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "16px", padding: "1.5rem" }}>
             <h3 style={{ margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "8px", color: "#10b981" }}>
               <ShieldCheck size={20} /> Secure Refactored Code
             </h3>
             <pre style={{ margin: 0, background: "#0f1016", padding: "1.5rem", borderRadius: "8px", overflowX: "auto", border: "1px solid rgba(255,255,255,0.05)" }}>
               <code style={{ color: "#e5e7eb", fontSize: "0.9rem", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                 {result.fixed_code}
               </code>
             </pre>
           </motion.div>
        )}

      </div>
    </div>
  );
}
