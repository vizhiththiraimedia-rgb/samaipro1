"use client";

import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";
import { SAMFormInput } from "@/components/sam/sam-form-inputs";
import { Mail, Lock, User, Play, Globe, GitBranch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); window.location.href = "/dashboard"; }, 1000);
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
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground">Join thousands of AI music creators</p>
          </div>

          <SAMCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <SAMFormInput label="Full Name" type="text" value={name} onChange={setName} placeholder="Jane Doe" required />
              <SAMFormInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@studio.ai" required />
              <SAMFormInput label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" required />
              <div className="text-xs text-muted-foreground">
                Must contain at least 8 characters, including a number and symbol.
              </div>
              <SAMButton className="w-full" type="submit" loading={isLoading}>Create Account</SAMButton>
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
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-accent hover:underline">Sign in</Link>
            </div>
          </SAMCard>

          <div className="mt-6 text-center sam-mono text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-surface-panel">
        <div className="max-w-md text-center sam-mono">
          <div className="text-6xl mb-6">SAM AI</div>
          <h2 className="text-3xl font-bold mb-4 sam-display">Start Creating with AI</h2>
          <p className="text-muted-foreground">Compose music, clone voices, and master tracks with AI-powered tools.</p>
        </div>
      </div>
    </div>
  );
}
