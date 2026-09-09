"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard, SAMPanel } from "@/components/sam/sam-card";
import { SAMFormInput } from "@/components/sam/sam-form-inputs";
import { SAMSlider } from "@/components/sam/sam-slider";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { User, Bell, Shield, Globe, Palette, Database, Key, Trash2, Save, Download, Upload, ExternalLink, ChevronRight, Monitor, Moon, Sun, Laptop } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("account");
  const [name, setName] = useState("Alex Chen");
  const [email, setEmail] = useState("alex@samai.studio");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);

  const sections = [
    { id: "account", name: "Account", icon: <User className="h-4 w-4" /> },
    { id: "appearance", name: "Appearance", icon: <Monitor className="h-4 w-4" /> },
    { id: "notifications", name: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "security", name: "Security", icon: <Shield className="h-4 w-4" /> },
    { id: "data", name: "Data & Storage", icon: <Database className="h-4 w-4" /> },
    { id: "credits", name: "Billing", icon: <Key className="h-4 w-4" /> },
  ];

  const themes: { id: string; name: string; icon: React.ReactNode }[] = [
    { id: "light", name: "Light", icon: <Sun className="h-4 w-4" /> },
    { id: "dark", name: "Dark", icon: <Moon className="h-4 w-4" /> },
    { id: "system", name: "System", icon: <Laptop className="h-4 w-4" /> },
  ];

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold sam-mono">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account and app preferences</p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-56 space-y-1 sam-mono">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeSection === section.id
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-panel"
                  }`}
                >
                  {section.icon}
                  {section.name}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 sam-mono">
              <AnimatePresence mode="wait">
                <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {activeSection === "account" && (
                    <SAMCard className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2"><User className="h-4 w-4" /> Account Settings</h3>
                      <div className="space-y-4 max-w-md">
                        <div className="flex items-end gap-4">
                          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                            <User className="h-10 w-10 text-accent" />
                          </div>
                          <div className="flex-1">
                            <SAMFormInput label="Display Name" value={name} onChange={setName} />
                            <SAMFormInput label="Email Address" type="email" value={email} onChange={setEmail} />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <SAMButton size="sm" leftIcon={<Upload className="h-3 w-3" />}>Upload Photo</SAMButton>
                          <SAMButton size="sm" variant="ghost" onClick={() => { setName("Alex Chen"); setEmail("alex@samai.studio"); }}>
                            Cancel
                          </SAMButton>
                        </div>
                        <div className="border-t border-border pt-4">
                          <SAMButton variant="ghost" leftIcon={<Save className="h-4 w-4" />}>Save Changes</SAMButton>
                        </div>
                      </div>
                    </SAMCard>
                  )}

                  {activeSection === "appearance" && (
                    <SAMCard className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2"><Palette className="h-4 w-4" /> Appearance</h3>
                      <div className="space-y-6 max-w-md">
                        <div>
                          <label className="text-xs text-muted-foreground mb-2 flex">Theme</label>
                          <div className="flex gap-2">
                            {themes.map((t) => (
                              <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                                  theme === t.id
                                    ? "border-accent bg-accent/5 text-accent"
                                    : "border-border hover:border-accent/50"
                                }`}
                              >
                                {t.icon} {t.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground mb-2 flex justify-between">
                            Accent Color
                            <span className="text-xs sam-mono text-foreground">hsl(230 90% 65%)</span>
                          </label>
                          <div className="h-2 bg-border rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-accent rounded-full" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm">Auto-save projects</label>
                          <label className="relative inline-flex h-5 w-10 items-center rounded-full">
                            <input type="checkbox" checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} className="sr-only" />
                            <span className={`inline-block h-5 w-10 rounded-full transition-colors ${autoSave ? "bg-accent" : "bg-border"}`}>
                              <span className={`inline-block h-4 w-4 rounded-full bg-background transform transition-transform ${autoSave ? "translate-x-5" : "translate-x-1"} mt-0.5`} />
                            </span>
                          </label>
                        </div>
                      </div>
                    </SAMCard>
                  )}

                  {activeSection === "notifications" && (
                    <SAMCard className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</h3>
                      <div className="space-y-4 max-w-md sam-mono">
                        <ToggleRow label="Enable notifications" description="Receive desktop notifications" checked={notifications} onChange={setNotifications} />
                        <ToggleRow label="Completion alerts" description="Notify when generations complete" checked={true} onChange={() => {}} />
                        <ToggleRow label="Training updates" description="Progress notifications for training jobs" checked={true} onChange={() => {}} />
                        <ToggleRow label="System status" description="Service downtime and maintenance alerts" checked={true} onChange={() => {}} />
                      </div>
                    </SAMCard>
                  )}

                  {activeSection === "security" && (
                    <SAMCard className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4" /> Security</h3>
                      <div className="space-y-4 max-w-md sam-mono">
                        <ToggleRow label="Two-factor authentication" description="Add an extra layer of security" checked={false} onChange={() => {}} />
                        <ToggleRow label="Session timeout" description="Auto-signout after 60 minutes" checked={true} onChange={() => {}} />
                        <ToggleRow label="Beta features" description="Enable experimental features" checked={betaFeatures} onChange={setBetaFeatures} />
                      </div>
                    </SAMCard>
                  )}

                  {activeSection === "data" && (
                    <SAMCard className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2"><Database className="h-4 w-4" /> Data & Storage</h3>
                      <div className="space-y-4 max-w-md sam-mono">
                        <div className="flex justify-between items-center p-3 bg-surface-panel rounded-lg">
                          <div>
                            <div className="font-medium">Storage used</div>
                            <div className="text-xs text-muted-foreground">42.5 GB of 200 GB</div>
                          </div>
                          <SAMStatusBadge status="active">85%</SAMStatusBadge>
                        </div>
                        <div className="flex gap-2">
                          <SAMButton size="sm" variant="ghost" leftIcon={<Download className="h-3 w-3" />}>Export Data</SAMButton>
                          <SAMButton size="sm" variant="ghost" leftIcon={<Upload className="h-3 w-3" />}>Import Project</SAMButton>
                        </div>
                      </div>
                    </SAMCard>
                  )}

                  {activeSection === "credits" && (
                    <SAMCard className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2"><Key className="h-4 w-4" /> Billing & Credits</h3>
                      <div className="space-y-4 max-w-md sam-mono">
                        <div className="p-4 bg-surface-panel rounded-lg">
                          <div className="text-2xl font-bold sam-display">1,158</div>
                          <div className="text-sm text-muted-foreground">Credits remaining</div>
                          <div className="h-2 bg-border rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-accent rounded-full w-3/4" />
                          </div>
                        </div>
                        <SAMButton leftIcon={<ExternalLink className="h-4 w-4" />}>Upgrade Credits</SAMButton>
                      </div>
                    </SAMCard>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="text-sm font-medium">{label}</label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <label className="relative inline-flex h-5 w-10 items-center rounded-full">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <span className={`inline-block h-5 w-10 rounded-full transition-colors ${checked ? "bg-accent" : "bg-border"}`}>
          <span className={`inline-block h-4 w-4 rounded-full bg-background transform transition-transform ${checked ? "translate-x-5" : "translate-x-1"} mt-0.5`} />
        </span>
      </label>
    </div>
  );
}
