"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard, SAMPanel } from "@/components/sam/sam-card";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { Activity, Cpu, Database, Wifi, WifiOff, Server, BarChart3, Zap, HardDrive, MemoryStick, RefreshCw, AlertTriangle, CheckCircle, Clock, Users, Shield, Globe, Settings, Brain, Mic, Layers, Music, Film } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SystemPage() {
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 42,
    memory: 68,
    disk: 56,
    network: 12,
    temperature: 65,
    uptime: "12d 4h 32m",
  });

  const services = [
    { id: "api", name: "API Gateway", status: "online", latency: "12ms", uptime: "99.9%", icon: <Globe className="h-5 w-5" /> },
    { id: "ai-core", name: "SAM AI Core", status: "online", latency: "45ms", uptime: "99.8%", icon: <Brain className="h-5 w-5" /> },
    { id: "vocal", name: "Voice Lab Service", status: "online", latency: "220ms", uptime: "99.7%", icon: <Mic className="h-5 w-5" /> },
    { id: "stems", name: "Stem Separator", status: "degraded", latency: "850ms", uptime: "98.5%", icon: <Layers className="h-5 w-5" /> },
    { id: "midi", name: "MIDI Composer", status: "online", latency: "89ms", uptime: "99.9%", icon: <Music className="h-5 w-5" /> },
    { id: "film", name: "Film Score Engine", status: "offline", latency: "—", uptime: "—", icon: <Film className="h-5 w-5" /> },
  ];

  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(() => {
      setSystemMetrics({
        cpu: Math.floor(Math.random() * 30) + 35,
        memory: Math.floor(Math.random() * 20) + 60,
        disk: Math.floor(Math.random() * 10) + 50,
        network: Math.floor(Math.random() * 8) + 8,
        temperature: Math.floor(Math.random() * 15) + 58,
        uptime: "12d 4h 32m",
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const getServiceStatusColor = (status: string) => {
    return status === "online" ? "success" : status === "degraded" ? "active" : "error";
  };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">System Status</h1>
              <p className="text-sm text-muted-foreground mt-1">Infrastructure monitoring and service health</p>
            </div>
            <div className="flex items-center gap-2">
              <SAMButton size="sm" variant="ghost" onClick={() => setIsAutoRefresh(!isAutoRefresh)}>
                <RefreshCw className={`h-4 w-4 ${isAutoRefresh ? "animate-spin-slow" : ""}`} />
                Auto-refresh: {isAutoRefresh ? "ON" : "OFF"}
              </SAMButton>
              <SAMButton size="sm" variant="ghost"><Settings className="h-4 w-4" /></SAMButton>
            </div>
          </div>

          {/* System metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 sam-mono">
            <MetricCard title="CPU" value={`${systemMetrics.cpu}%`} icon={<Cpu className="h-4 w-4" />} color="hsl(210 60% 60%)" sub="4 cores" />
            <MetricCard title="Memory" value={`${systemMetrics.memory}%`} icon={<MemoryStick className="h-4 w-4" />} color="hsl(270 60% 60%)" sub="16GB" />
            <MetricCard title="Disk" value={`${systemMetrics.disk}%`} icon={<HardDrive className="h-4 w-4" />} color="hsl(30 60% 60%)" sub="500GB" />
            <MetricCard title="Network" value={`${systemMetrics.network} Mbps`} icon={<Wifi className="h-4 w-4" />} color="hsl(140 60% 60%)" sub="Outbound" />
            <MetricCard title="Temperature" value={`${systemMetrics.temperature}°C`} icon={<AlertTriangle className="h-4 w-4" />} color="hsl(30 90% 60%)" sub="CPU" />
            <MetricCard title="Uptime" value={systemMetrics.uptime} icon={<Clock className="h-4 w-4" />} color="hsl(150 60% 60%)" sub="Since 9/4/2026" />
          </div>

          {/* Services */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 sam-mono">Service Health</h2>
            <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {services.map((service) => (
                <div key={service.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 bg-surface-panel rounded-lg border border-border sam-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-xs text-muted-foreground">ID: {service.id}</p>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-3">
                      <SAMStatusBadge status={getServiceStatusColor(service.status)}>
                        {service.status}
                      </SAMStatusBadge>
                      <span className="text-sm text-muted-foreground font-mono">{service.latency}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm sam-mono">{service.uptime}</div>
                    <div className="text-xs text-muted-foreground">uptime</div>
                  </div>
                  <div className="flex gap-2">
                    <SAMButton size="sm" variant="ghost"><RefreshCw className="h-3 w-3" /></SAMButton>
                    <SAMButton size="sm" variant="ghost"><Settings className="h-3 w-3" /></SAMButton>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* System info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sam-mono">
            <SAMCard className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Server className="h-4 w-4" /> System Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Platform</span><span>Linux x86_64</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Kernel</span><span>6.8.0-31-generic</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Python</span><span>3.11.6</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Node.js</span><span>v20.11.1</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Docker</span><span>v26.0.0</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">SAM AI Core</span><span>v3.2.1</span></div>
              </div>
            </SAMCard>

            <SAMCard className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Shield className="h-4 w-4" /> Security</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">SSL/TLS</span><span className="text-green-400">Valid</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">API Key Auth</span><span className="text-green-400">Enabled</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Rate Limiting</span><span className="text-green-400">Active (120/min)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Audit Logs</span><span className="text-green-400">Recording</span></div>
              </div>
            </SAMCard>
          </div>
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, sub }: { title: string; value: string; icon: React.ReactNode; color: string; sub: string }) {
  return (
    <SAMCard className="p-4 text-center sam-mono">
      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </SAMCard>
  );
}
