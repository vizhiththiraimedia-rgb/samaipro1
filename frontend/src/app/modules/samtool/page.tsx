"use client";

import React, { useState, useRef } from "react";
import { apiFetch } from "../../../utils/api";
import {
  FileText, Download, Copy, Trash2, RotateCw,
  Scissors, Merge, Archive, QrCode,
  Link as LinkIcon, Code, Globe, FileDown,
  AlertCircle, BookOpen, ClipboardList,
  FileInput, Sparkles
} from "lucide-react";
import Image from "next/image";

type Tab = "pdf" | "encode" | "text" | "gov" | "invoice";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.6rem", background: "#111", border: "1px solid #333",
  borderRadius: "8px", color: "#fff", fontSize: "0.9rem"
};

const btnStyle: React.CSSProperties = {
  padding: "0.55rem 0.9rem", background: "#1e1e2e", border: "1px solid #333",
  borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "0.85rem",
  display: "flex", alignItems: "center", gap: "0.4rem", transition: "background 0.2s"
};

const ExternalLinkIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6l12 12 M18 18L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface ApiResult {
  status?: string;
  encoded?: string;
  decoded?: string;
  hash?: string;
  algorithm?: string;
  formatted?: string;
  base64?: string;
  uuids?: string[];
  results?: Record<string, unknown>[];
  gazettes?: Record<string, unknown>[];
  forms?: Record<string, unknown>[];
  invoice?: Record<string, unknown>;
  [key: string]: unknown;
}

export default function SamToolPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pdf");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);

  const [encText, setEncText] = useState("");
  const [encResult, setEncResult] = useState("");

  const [uuidCount, setUuidCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const [qrText, setQrText] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [govResults, setGovResults] = useState<Record<string, unknown>[]>([]);
  const [gazettes, setGazettes] = useState<Record<string, unknown>[]>([]);
  const [forms, setForms] = useState<Record<string, unknown>[]>([]);
  const [showGazettes, setShowGazettes] = useState(false);
  const [showForms, setShowForms] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    invoice_number: "",
    client_name: "",
    client_address: "",
    due_date: "",
    tax_rate: "0",
    items: [{ description: "", qty: 1, rate: 0, amount: 0 }],
    notes: "",
  });

  const mergeInputRef = useRef<HTMLInputElement>(null);
  const compressInputRef = useRef<HTMLInputElement>(null);
  const rotateInputRef = useRef<HTMLInputElement>(null);
  const splitInputRef = useRef<HTMLInputElement>(null);

  const callApi = async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await apiFetch(endpoint, options);
      setResult(data);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "pdf", name: "PDF Tools", icon: <FileText size={18} /> },
    { id: "encode", name: "Encoders", icon: <QrCode size={18} /> },
    { id: "text", name: "Text Tools", icon: <Code size={18} /> },
    { id: "gov", name: "Gov Services (LK)", icon: <Globe size={18} /> },
    { id: "invoice", name: "Invoice Generator", icon: <FileInput size={18} /> },
  ];

  const clearInput = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) ref.current.value = "";
  };

  const doEncode = async (endpoint: string) => {
    if (!encText.trim()) return;
    const fd = new FormData();
    fd.append("text", encText);
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch(endpoint, { method: "POST", body: fd });
      setEncResult(data.encoded || data.decoded || data.hash || data.formatted || JSON.stringify(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const generateUuids = async () => {
    const fd = new FormData();
    fd.append("count", String(uuidCount));
    const data = await callApi("/samtool/uuid/generate", { method: "POST", body: fd });
    if (data?.uuids) setUuids(data.uuids as string[]);
  };

  const generateQr = async () => {
    if (!qrText) return;
    const fd = new FormData();
    fd.append("data", qrText);
    await callApi("/samtool/qr/generate", { method: "POST", body: fd });
  };

  const searchGov = async () => {
    if (!searchQuery.trim()) return;
    const fd = new FormData();
    fd.append("query", searchQuery);
    const data = await callApi("/samtool/government/search", { method: "POST", body: fd });
    if (data?.results) setGovResults(data.results as Record<string, unknown>[]);
  };

  const loadGazettes = async () => {
    const data = await callApi("/samtool/government/gazettes");
    if (data?.gazettes) setGazettes(data.gazettes as Record<string, unknown>[]);
    setShowGazettes(true);
  };

  const loadForms = async () => {
    const data = await callApi("/samtool/government/forms");
    if (data?.forms) setForms(data.forms as Record<string, unknown>[]);
    setShowForms(true);
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: "", qty: 1, rate: 0, amount: 0 }],
    }));
  };

  const updateItem = (idx: number, field: string, value: string | number) => {
    setInvoiceData(prev => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [field]: value };
      if (field === "qty" || field === "rate") {
        items[idx].amount = items[idx].qty * items[idx].rate;
      }
      return { ...prev, items };
    });
  };

  const generateInvoice = async (fmt: "json" | "pdf") => {
    const fd = new FormData();
    fd.append("data", JSON.stringify({
      invoice_number: invoiceData.invoice_number || undefined,
      client_name: invoiceData.client_name,
      client_address: invoiceData.client_address,
      due_date: invoiceData.due_date,
      tax_rate: parseFloat(invoiceData.tax_rate) || 0,
      items: invoiceData.items,
      notes: invoiceData.notes,
    }));
    fd.append("format", fmt);
    await callApi("/samtool/invoice/generate", { method: "POST", body: fd });
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (parseFloat(invoiceData.tax_rate) || 0) / 100;
  const total = subtotal + tax;

  const renderResult = () => {
    if (!result) return null;
    if (result.hash) return `Algorithm: ${result.algorithm}\nHash: ${result.hash}`;
    if (result.encoded) return result.encoded as string;
    if (result.decoded) return result.decoded as string;
    if (result.formatted) return result.formatted as string;
    return "Done";
  };

  return (
    <div className="page-container" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", minHeight: "calc(100vh - 4rem)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #10a37f33, #10a37f11)", border: "1px solid #10a37f33", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={24} color="#10a37f" />
        </div>
        <div>
          <h1 style={{ fontSize: "1.75rem", margin: 0, fontWeight: 600 }}>SAM Toolbox</h1>
          <p style={{ color: "#888", fontSize: "0.95rem", margin: 0 }}>Utility tools: PDF manipulation, encoding, QR codes, government services, and invoicing</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", background: "#111", padding: "0.35rem", borderRadius: "10px", border: "1px solid #333" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as Tab); setResult(null); setError(""); }}
            style={{
              flex: 1, padding: "0.6rem 1rem", cursor: "pointer", border: "none", borderRadius: "8px",
              background: activeTab === tab.id ? "#10a37f" : "transparent",
              color: activeTab === tab.id ? "#0f1712" : "#888",
              fontSize: "0.9rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.4rem",
              transition: "all 0.2s"
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", background: "#7f1d1d", border: "1px solid #ef4444", borderRadius: "8px", color: "#fca5a5", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading && (
        <div style={{ padding: "1rem", background: "#1e1e2e", border: "1px solid #333", borderRadius: "10px", marginBottom: "1rem", color: "#888", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "16px", height: "16px", border: "2px solid #333", borderTopColor: "#10a37f", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          Processing...
        </div>
      )}

      <div style={{ background: "#171719", border: "1px solid #2a2a2e", borderRadius: "12px", padding: "1.5rem" }}>
        {activeTab === "pdf" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <button
              onClick={() => { clearInput(mergeInputRef); mergeInputRef.current?.click(); }}
              style={btnStyle}
            >
              <Merge size={18} color="#10a37f" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600 }}>Merge PDFs</div>
                <div style={{ fontSize: "0.75rem", color: "#888" }}>Combine multiple PDF files</div>
              </div>
              <input
                type="file"
                ref={mergeInputRef}
                multiple
                accept="application/pdf"
                hidden
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;
                  const fd = new FormData();
                  files.forEach(f => fd.append("files", f));
                  await callApi("/samtool/pdf/merge", { method: "POST", body: fd });
                  clearInput(mergeInputRef);
                }}
              />
            </button>

            <button
              onClick={() => { clearInput(compressInputRef); compressInputRef.current?.click(); }}
              style={btnStyle}
            >
              <Archive size={18} color="#3b82f6" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600 }}>Compress PDF</div>
                <div style={{ fontSize: "0.75rem", color: "#888" }}>Reduce file size</div>
              </div>
              <input
                type="file"
                ref={compressInputRef}
                accept="application/pdf"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  await callApi("/samtool/pdf/compress", { method: "POST", body: fd });
                  clearInput(compressInputRef);
                }}
              />
            </button>

            <div style={{ padding: "1rem", background: "#1e1e2e", border: "1px solid #333", borderRadius: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <RotateCw size={18} color="#f59e0b" />
                <strong>Rotate PDF</strong>
              </div>
              <input
                type="file"
                ref={rotateInputRef}
                accept="application/pdf"
                style={{ marginBottom: "0.5rem" }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  fd.append("angle", "90");
                  await callApi("/samtool/pdf/rotate", { method: "POST", body: fd });
                }}
              />
            </div>

            <div style={{ padding: "1rem", background: "#1e1e2e", border: "1px solid #333", borderRadius: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <Scissors size={18} color="#ef4444" />
                <strong>Split PDF</strong>
              </div>
              <input
                type="file"
                ref={splitInputRef}
                accept="application/pdf"
                style={{ marginBottom: "0.5rem" }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  fd.append("start_page", "1");
                  fd.append("end_page", "1");
                  await callApi("/samtool/pdf/split", { method: "POST", body: fd });
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "encode" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>Encoder / Decoder</h3>
              <textarea
                value={encText}
                onChange={(e) => setEncText(e.target.value)}
                placeholder="Enter text to encode or decode..."
                style={{ ...inputStyle, minHeight: "100px", fontFamily: "monospace" }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <button onClick={() => doEncode("/samtool/base64/encode")} disabled={loading} style={btnStyle}>Base64 Encode</button>
                <button onClick={() => doEncode("/samtool/base64/decode")} disabled={loading} style={btnStyle}>Base64 Decode</button>
                <button onClick={() => doEncode("/samtool/url/encode")} disabled={loading} style={btnStyle}>URL Encode</button>
                <button onClick={() => doEncode("/samtool/url/decode")} disabled={loading} style={btnStyle}>URL Decode</button>
                <button onClick={async () => {
                  if (!encText.trim()) return;
                  const fd = new FormData();
                  fd.append("text", encText);
                  fd.append("algorithm", "sha256");
                  const data = await callApi("/samtool/hash/generate", { method: "POST", body: fd });
                  if (data) {
                    setEncResult(`Algorithm: ${data.algorithm}\nHash: ${data.hash}`);
                  }
                }} disabled={loading} style={btnStyle}>SHA-256 Hash</button>
                <button onClick={() => doEncode("/samtool/json/format")} disabled={loading} style={btnStyle}>Format JSON</button>
              </div>
            </div>

            <div>
              <h3 style={{ margin: "0 0 0.5rem 0" }}>Result</h3>
              <div style={{ ...inputStyle, minHeight: "100px", fontFamily: "monospace", fontSize: "0.9rem", whiteSpace: "pre-wrap", overflow: "auto", background: "#1e1e2e" }}>
                {renderResult() || encResult || "No result yet."}
              </div>
              {(encResult || (result && renderResult())) && (
                <button
                  onClick={() => navigator.clipboard.writeText(encResult || renderResult() || "")}
                  style={{ marginTop: "0.5rem", padding: "0.4rem 0.75rem", background: "#333", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  <Copy size={14} /> Copy
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "text" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ padding: "1rem", background: "#1e1e2e", border: "1px solid #333", borderRadius: "10px" }}>
              <h3 style={{ margin: "0 0 0.75rem 0" }}>UUID Generator</h3>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <label style={{ fontSize: "0.9rem" }}>Count:</label>
                <input
                  type="number" min={1} max={100}
                  value={uuidCount}
                  onChange={(e) => setUuidCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  style={{ width: "80px", padding: "0.4rem", background: "#111", border: "1px solid #333", borderRadius: "6px", color: "#fff" }}
                />
                <button onClick={generateUuids} disabled={loading} style={{ ...btnStyle, background: "#10a37f", color: "#0f1712" }}>
                  Generate
                </button>
              </div>
              {uuids.length > 0 && (
                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {uuids.map((u, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "monospace", fontSize: "0.9rem" }}>
                      <span>{u}</span>
                      <button onClick={() => navigator.clipboard.writeText(u)} style={{ padding: "0.2rem", background: "none", border: "none", color: "#888", cursor: "pointer" }}>
                        <Copy size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: "1rem", background: "#1e1e2e", border: "1px solid #333", borderRadius: "10px" }}>
              <h3 style={{ margin: "0 0 0.75rem 0" }}>QR Code Generator</h3>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="Enter text or URL..."
                style={{ ...inputStyle, marginBottom: "0.5rem" }}
              />
              <button
                onClick={generateQr}
                disabled={loading || !qrText}
                style={{ ...btnStyle, background: "#8b5cf6", color: "#fff" }}
              >
                <QrCode size={16} /> Generate QR
              </button>
              {result?.base64 && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <Image
                    src={`data:image/png;base64,${result.base64 as string}`}
                    alt="QR Code"
                    width={150}
                    height={150}
                    style={{ maxWidth: "150px", border: "1px solid #333", borderRadius: "8px" }}
                  />
                  <div style={{ marginTop: "0.5rem" }}>
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = `data:image/png;base64,${result.base64 as string}`;
                        link.download = "qrcode.png";
                        link.click();
                      }}
                      style={{ padding: "0.4rem 0.75rem", background: "#333", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "0.85rem" }}
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "gov" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <h3 style={{ margin: "0 0 0.75rem 0" }}>Search Sri Lankan Government Services</h3>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., NIC, Passport, Driving License..."
                  style={{ flex: 1, ...inputStyle }}
                />
                <button onClick={searchGov} disabled={loading} style={{ ...btnStyle, background: "#10a37f", color: "#0f1712" }}>
                  Search
                </button>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button onClick={loadGazettes} disabled={loading} style={btnStyle}>
                  <BookOpen size={16} style={{ marginRight: "0.4rem" }} /> Gazettes
                </button>
                <button onClick={loadForms} disabled={loading} style={btnStyle}>
                  <ClipboardList size={16} style={{ marginRight: "0.4rem" }} /> Forms
                </button>
              </div>
            </div>

            {govResults.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {govResults.map((s) => (
                  <div key={s.id as string} style={{ padding: "1rem", background: "#1e1e2e", border: "1px solid #333", borderRadius: "10px" }}>
                    <h4 style={{ margin: "0 0 0.5rem 0" }}>{s.name as string}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "0.5rem" }}>{s.description as string}</p>
                    <p style={{ fontSize: "0.8rem", color: "#888" }}>Category: {s.category as string}</p>
                    {Array.isArray(s.requirements) && s.requirements.length > 0 && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <strong style={{ fontSize: "0.8rem" }}>Requirements:</strong>
                        <ul style={{ fontSize: "0.8rem", color: "#aaa", marginLeft: "1rem", marginTop: "0.25rem" }}>
                          {(s.requirements as string[]).map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                    <a href={s.link as string} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "#10a37f", display: "flex", alignItems: "center", gap: "0.2rem", marginTop: "0.5rem" }}>
                      <LinkIcon size={12} /> Visit Website
                    </a>
                  </div>
                ))}
              </div>
            )}

            {showGazettes && gazettes.length > 0 && (
              <div>
                <h3 style={{ margin: "0 0 0.75rem 0" }}>Recent Gazettes ({gazettes.length})</h3>
                {gazettes.map((g) => (
                  <div key={g.id as string} style={{ padding: "0.75rem", background: "#1e1e2e", border: "1px solid #333", borderRadius: "8px", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: "0.9rem" }}>{g.title as string}</strong>
                      <div style={{ fontSize: "0.8rem", color: "#888" }}>{g.date as string} · {g.category as string}</div>
                    </div>
                    {typeof g.url === "string" && g.url !== "#" && (
                      <a href={g.url as string} target="_blank" rel="noopener noreferrer" style={{ color: "#10a37f" }}>
                        <ExternalLinkIcon size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showForms && forms.length > 0 && (
              <div>
                <h3 style={{ margin: "0 0 0.75rem 0" }}>Government Forms ({forms.length})</h3>
                {forms.map((f) => (
                  <div key={f.id as string} style={{ padding: "0.75rem", background: "#1e1e2e", border: "1px solid #333", borderRadius: "8px", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: "0.9rem" }}>{f.name as string}</strong>
                      <div style={{ fontSize: "0.8rem", color: "#888" }}>{f.category as string}</div>
                      <p style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "0.25rem" }}>{f.description as string}</p>
                    </div>
                    {typeof f.download_url === "string" && f.download_url !== "#" && (
                      <a href={f.download_url as string} target="_blank" rel="noopener noreferrer" style={{ color: "#10a37f" }}>
                        <Download size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "invoice" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input type="text" placeholder="Invoice Number" value={invoiceData.invoice_number} onChange={(e) => setInvoiceData({ ...invoiceData, invoice_number: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Client Name" value={invoiceData.client_name} onChange={(e) => setInvoiceData({ ...invoiceData, client_name: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Client Address" value={invoiceData.client_address} onChange={(e) => setInvoiceData({ ...invoiceData, client_address: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
              <input type="date" value={invoiceData.due_date} onChange={(e) => setInvoiceData({ ...invoiceData, due_date: e.target.value })} style={inputStyle} />
              <input type="number" placeholder="Tax Rate (%)" value={invoiceData.tax_rate} onChange={(e) => setInvoiceData({ ...invoiceData, tax_rate: e.target.value })} style={inputStyle} />
            </div>

            <div>
              <h3 style={{ margin: "0 0 0.5rem 0" }}>Items</h3>
              {invoiceData.items.map((item, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                  <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} style={inputStyle} />
                  <input type="number" placeholder="Qty" value={item.qty} onChange={(e) => updateItem(idx, "qty", parseInt(e.target.value) || 0)} style={inputStyle} />
                  <input type="number" placeholder="Rate" value={item.rate} onChange={(e) => updateItem(idx, "rate", parseFloat(e.target.value) || 0)} style={inputStyle} />
                  <input type="number" placeholder="Amount" value={item.amount} readOnly style={{ ...inputStyle, background: "#111" }} />
                  {invoiceData.items.length > 1 && (
                    <button onClick={() => setInvoiceData({ ...invoiceData, items: invoiceData.items.filter((_, i) => i !== idx) })} style={{ padding: "0.3rem", background: "#ef4444", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addItem} style={{ ...btnStyle, background: "#111" }}>+ Add Item</button>
            </div>

            <textarea placeholder="Notes" value={invoiceData.notes} onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })} style={{ ...inputStyle, minHeight: "80px" }} />

            <div style={{ padding: "1rem", background: "#1e1e2e", border: "1px solid #333", borderRadius: "10px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem" }}>Subtotal: <strong>LKR {subtotal.toFixed(2)}</strong></div>
                  <div style={{ fontSize: "0.85rem" }}>Tax ({invoiceData.tax_rate}%): <strong>LKR {tax.toFixed(2)}</strong></div>
                  <div style={{ fontSize: "1rem", marginTop: "0.25rem" }}>Total: <strong>LKR {total.toFixed(2)}</strong></div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => generateInvoice("json")} disabled={loading} style={{ flex: 1, ...btnStyle, background: "#10a37f", color: "#0f1712" }}>
                <FileText size={16} /> Generate JSON
              </button>
              <button onClick={() => generateInvoice("pdf")} disabled={loading} style={{ flex: 1, ...btnStyle, background: "#3b82f6", color: "#fff" }}>
                <FileDown size={16} /> Generate PDF
              </button>
            </div>

            {result?.invoice && (
              <div style={{ padding: "1rem", background: "#1e1e2e", border: "1px solid #333", borderRadius: "10px", fontFamily: "monospace", fontSize: "0.9rem", whiteSpace: "pre-wrap", overflow: "auto" }}>
                {JSON.stringify(result.invoice, null, 2)}
              </div>
            )}

            {result?.base64 && (
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `data:application/pdf;base64,${result.base64 as string}`;
                    link.download = "invoice.pdf";
                    link.click();
                  }}
                  style={{ ...btnStyle, background: "#3b82f6", color: "#fff" }}
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
