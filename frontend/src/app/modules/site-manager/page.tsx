"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Server, ExternalLink, Settings, ArrowLeft, 
  CheckCircle2, Plus, Edit2, Trash2, Shield
} from 'lucide-react';
import { apiFetch } from '../../../utils/api';

type Site = {
  id: string;
  name: string;
  type: string;
  status: string;
  manageUrl: string;
  siteUrl: string;
};

export default function SiteManager() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await apiFetch("/site-manager/sites");
      if (res.sites) setSites(res.sites);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const addDemoSite = async () => {
    const site = {
      name: "New Client Site",
      type: "WordPress CMS",
      status: "Live",
      manageUrl: "https://example.com/wp-admin",
      siteUrl: "https://example.com"
    };
    try {
      const res = await apiFetch("/site-manager/sites", { method: "POST", body: JSON.stringify(site) });
      if (res.site) setSites([...sites, res.site]);
    } catch (e) {}
  };

  const deleteSite = async (id: string) => {
    try {
      await apiFetch(`/site-manager/sites/${id}`, { method: "DELETE" });
      setSites(sites.filter(s => s.id !== id));
    } catch (e) {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <Link href="/modules" style={{ color: "#3b82f6", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px", fontWeight: 600 }}>
              <ArrowLeft size={18} /> Back to Modules
            </Link>
            <h1 style={{ fontSize: "2.5rem", margin: 0, background: "linear-gradient(135deg, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", gap: "15px" }}>
              <Globe size={36} color="#f59e0b" /> Web CMS Manager
            </h1>
            <p style={{ color: "#8b949e", fontSize: "1.1rem", marginTop: "10px" }}>
              Manage all client websites (3zero, AusLanka, Kannagi) securely from SAM AI Server.
            </p>
          </div>
          <button 
            onClick={addDemoSite}
            style={{ background: "#f59e0b", color: "#000", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          >
            <Plus size={20} /> Add New Client Site
          </button>
        </div>

        {loading ? <p>Loading sites from Database...</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "25px" }}>
            {sites.map(site => (
              <div key={site.id} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "16px", padding: "25px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#fff" }}>{site.name}</h2>
                  <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "5px" }}>
                    <CheckCircle2 size={14} /> {site.status}
                  </span>
                </div>
                
                <p style={{ color: "#8b949e", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Server size={16} /> {site.type}
                </p>

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <a href={site.manageUrl} target="_blank" style={{ flex: 1, background: "rgba(255, 255, 255, 0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", padding: "10px", borderRadius: "8px", textDecoration: "none", textAlign: "center", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                    <Settings size={16} /> Admin
                  </a>
                  <a href={site.siteUrl} target="_blank" style={{ flex: 1, background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", textDecoration: "none", textAlign: "center", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                    <ExternalLink size={16} /> Visit Site
                  </a>
                </div>
                <div style={{marginTop: "10px", textAlign: "right"}}>
                  <button onClick={() => deleteSite(site.id)} style={{background: "transparent", border: "none", color: "#ef4444", cursor: "pointer"}}><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
