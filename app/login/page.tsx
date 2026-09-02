"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HardHat, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-base flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-[55%] bg-ink flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#FAFAF7"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <HardHat size={20} className="text-white" />
            </div>
            <div>
              <span className="text-white text-xl font-semibold tracking-tight">
                CivilOS
              </span>
              <span className="text-white/30 text-xs ml-2">v2.4</span>
            </div>
          </div>

          <h2 className="text-white/90 text-4xl font-semibold leading-tight tracking-tight max-w-xs">
            Construction records,
            <br />
            <span className="text-accent-light">where they belong.</span>
          </h2>

          <p className="mt-5 text-white/40 text-sm leading-relaxed max-w-sm">
            Measurement books, RA billing, material ledgers, and site progress —
            all in one place. Built for Nepal&apos;s construction industry.
          </p>

          {/* Stats row */}
          <div className="mt-12 flex gap-8">
            {[
              { label: "Active Projects", value: "3" },
              { label: "RA Bills Tracked", value: "₨ 8.4Cr" },
              { label: "DPR Entries", value: "2,847" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-white text-2xl font-semibold">
                  {s.value}
                </div>
                <div className="text-white/30 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="text-white/20 text-xs">
            Narayan Constructions Pvt. Ltd. &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <HardHat size={17} className="text-white" />
            </div>
            <span className="text-ink text-lg font-semibold">CivilOS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-ink tracking-tight">
              Sign in
            </h1>
            <p className="text-muted text-sm mt-1.5">
              Narayan Constructions — Site Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-ink mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                defaultValue="pushkar.jha"
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-white text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-ink mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  defaultValue="civilos123"
                  className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-white text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                Keep me signed in
              </label>
              <button
                type="button"
                className="text-xs text-accent hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-accent hover:bg-accent-dark text-white font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in to CivilOS"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted text-center">
              Demo credentials pre-filled. Click &ldquo;Sign in&rdquo; to
              explore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
