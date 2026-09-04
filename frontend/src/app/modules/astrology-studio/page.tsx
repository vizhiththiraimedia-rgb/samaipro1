"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../utils/api';
import { 
  ArrowLeft, Moon, Sun, Sparkles, MapPin, Calendar, Clock,
  User
} from 'lucide-react';

export default function AstrologyStudio() {
  const [formData, setFormData] = useState({
    name: "SAM AI User",
    gender: "Male",
    dob: "1995-05-15",
    tob: "08:30",
    pob: "Chennai, India",
    latitude: 13.0827,
    longitude: 80.2707,
    timezone_offset: 5.5
  });
  
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);

  const calculate = async () => {
    setLoading(true);
    setChartData(null);
    try {
      const res = await apiFetch("/astrology/calculate-chart", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setChartData(res);
    } catch (e) {
      console.error(e);
      alert("Failed to calculate chart.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Link href="/modules" style={{ color: "#3b82f6", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <ArrowLeft size={18} /> Back to Modules
        </Link>
        <h1 style={{ fontSize: "2.5rem", background: "linear-gradient(135deg, #a855f7, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          <Sparkles style={{ display: "inline", marginRight: "10px", color: "#a855f7" }} />
          Advanced Astrology Engine
        </h1>
        <p>Universal High-Precision Astronomical Ephemeris Engine (Keplerian Orbital Mechanics + Lahiri Ayanamsa).</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px", marginTop: "30px" }}>
          
          {/* Form */}
          <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #30363d" }}>
            <h3 style={{ marginTop: 0, color: "#fff" }}>Birth Details</h3>
            
            <label style={{ display: "block", marginTop: "15px" }}>Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "10px", background: "#000", border: "1px solid #30363d", color: "#fff", borderRadius: "6px" }} />

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block" }}>Date (YYYY-MM-DD)</label>
                <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} style={{ width: "100%", padding: "10px", background: "#000", border: "1px solid #30363d", color: "#fff", borderRadius: "6px" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block" }}>Time (HH:MM)</label>
                <input type="time" value={formData.tob} onChange={e => setFormData({...formData, tob: e.target.value})} style={{ width: "100%", padding: "10px", background: "#000", border: "1px solid #30363d", color: "#fff", borderRadius: "6px" }} />
              </div>
            </div>

            <label style={{ display: "block", marginTop: "15px" }}>Place of Birth</label>
            <input type="text" value={formData.pob} onChange={e => setFormData({...formData, pob: e.target.value})} style={{ width: "100%", padding: "10px", background: "#000", border: "1px solid #30363d", color: "#fff", borderRadius: "6px" }} />
            
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block" }}>Latitude</label>
                <input type="number" step="0.0001" value={formData.latitude} onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value)})} style={{ width: "100%", padding: "10px", background: "#000", border: "1px solid #30363d", color: "#fff", borderRadius: "6px" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block" }}>Longitude</label>
                <input type="number" step="0.0001" value={formData.longitude} onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value)})} style={{ width: "100%", padding: "10px", background: "#000", border: "1px solid #30363d", color: "#fff", borderRadius: "6px" }} />
              </div>
            </div>

            <button onClick={calculate} disabled={loading} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", marginTop: "20px", cursor: "pointer" }}>
              {loading ? "Calculating Astronomy..." : "Generate Kundli / Chart"}
            </button>
          </div>

          {/* Results */}
          <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #30363d", minHeight: "400px" }}>
            <h3 style={{ marginTop: 0, color: "#fff" }}>Astrological & Astronomical Output</h3>
            {!chartData ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80%", color: "#8b949e" }}>
                Enter birth details and click Generate to see planetary positions.
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div style={{ background: "rgba(168, 85, 247, 0.1)", padding: "15px", borderRadius: "8px", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                    <h4 style={{ color: "#a855f7", margin: "0 0 10px 0" }}>Lagna (Ascendant)</h4>
                    <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>
                      {chartData.lagna?.rasi?.name} ({chartData.lagna?.degree?.toFixed(2)}°)
                    </p>
                    <p style={{ margin: "5px 0 0 0", color: "#8b949e" }}>Lord: {chartData.lagna?.rasi?.lord}</p>
                  </div>
                  <div style={{ background: "rgba(99, 102, 241, 0.1)", padding: "15px", borderRadius: "8px", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                    <h4 style={{ color: "#6366f1", margin: "0 0 10px 0" }}>Moon Sign (Rasi)</h4>
                    <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>
                      {chartData.planets?.Moon?.rasi?.name} 
                    </p>
                    <p style={{ margin: "5px 0 0 0", color: "#8b949e" }}>Nakshatra: {chartData.planets?.Moon?.nakshatra?.name}</p>
                  </div>
                </div>

                <h4 style={{ borderBottom: "1px solid #30363d", paddingBottom: "10px" }}>Planetary Positions (Grahas)</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {Object.keys(chartData.planets || {}).map(p => (
                    <div key={p} style={{ background: "#0d1117", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}>
                      <strong style={{ color: "#38bdf8" }}>{p}</strong>
                      <span style={{ color: "#fff" }}>
                        {chartData.planets[p].rasi?.name} ({chartData.planets[p].degree?.toFixed(2)}°)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
