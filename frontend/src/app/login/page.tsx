"use client";

import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard, SAMPanel } from "@/components/sam/sam-card";
import { SAMFormInput } from "@/components/sam/sam-form-inputs";
import { Mail, Lock, Play, ExternalLink, GitBranch, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); window.location.href = "/dashboard"; }, 800);
  };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                <Play className="h-5 w-5 text-background" />
              </div>
              <span className="text-2xl font-bold sam-display">SAM AI</span>
            </div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to access your studio</p>
          </div>

          <SAMCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <SAMFormInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@studio.ai" required />
              <SAMFormInput label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
              <SAMButton className="w-full" type="submit" loading={isLoading}>Sign In</SAMButton>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="px-3 text-xs text-muted-foreground">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-2">
              <SAMButton variant="secondary" className="w-full" leftIcon={<Globe className="h-4 w-4" />}>Google</SAMButton>
              <SAMButton variant="secondary" className="w-full" leftIcon={<GitBranch className="h-4 w-4" />}>GitHub</SAMButton>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">New to SAM AI? </span>
              <Link href="/register" className="text-accent hover:underline">Create account</Link>
            </div>
          </SAMCard>

          <div className="mt-6 text-center sam-mono text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-surface-panel">
        <div className="max-w-md text-center sam-mono">
          <div className="text-6xl mb-6">AI</div>
          <h2 className="text-3xl font-bold mb-4 sam-display">Your AI Music Studio</h2>
          <p className="text-muted-foreground">Compose, generate, and master music with the power of AI.</p>
        </div>
      </div>
    </div>
  );
}
