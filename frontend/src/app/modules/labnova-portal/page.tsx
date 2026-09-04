"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../utils/api';
import { ArrowLeft, Activity, Users, DollarSign, Server, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function LabNovaPortal() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/labnova/dashboard");
      setData(res);
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Link href="/modules" style={{ color: "#3b82f6", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <ArrowLeft size={18} /> Back to Modules
            </Link>
            <h1 style={{ fontSize: "2.5rem", background: "linear-gradient(135deg, #10b981, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              <Activity style={{ display: "inline", marginRight: "10px", color: "#10b981" }} />
              LabNova Enterprise Portal
            </h1>
          </div>
          <button onClick={fetchDashboard} style={{ background: "#10b981", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            Refresh Live Data
          </button>
        </div>

        {loading ? <p>Loading live portal metrics...</p> : data ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "40px" }}>
            <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #30363d" }}>
              <div style={{ color: "#8b949e", display: "flex", alignItems: "center", gap: "10px" }}><Users size={18}/> Active Users</div>
              <h2 style={{ fontSize: "2rem", margin: "10px 0 0 0", color: "#fff" }}>{data.active_users}</h2>
            </div>
            <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #30363d" }}>
              <div style={{ color: "#8b949e", display: "flex", alignItems: "center", gap: "10px" }}><DollarSign size={18}/> Total Revenue</div>
              <h2 style={{ fontSize: "2rem", margin: "10px 0 0 0", color: "#fff" }}></h2>
            </div>
            <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #30363d" }}>
              <div style={{ color: "#8b949e", display: "flex", alignItems: "center", gap: "10px" }}><Server size={18}/> Server Load</div>
              <h2 style={{ fontSize: "2rem", margin: "10px 0 0 0", color: "#fff" }}>{data.server_load}</h2>
            </div>
            
            <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #30363d", gridColumn: "span 3", marginTop: "20px" }}>
              <h3 style={{ margin: "0 0 20px 0", color: "#fff" }}>Recent Alerts</h3>
              {data.recent_alerts.map((a: any) => (
                <div key={a.id} style={{ padding: "15px", background: "#0d1117", borderRadius: "8px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  {a.type === "success" ? <CheckCircle2 color="#10b981" /> : <AlertTriangle color="#f59e0b" />}
                  {a.msg}
                </div>
              ))}
            </div>
          </div>
        ) : <p>Failed to load data.</p>}
      </div>
    </div>
  );
}
