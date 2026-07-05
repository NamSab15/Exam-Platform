"use client";

import { useState } from "react";
import Image from "next/image";

/* ── Shared style constants ─────────────────────────────────────
   Every color / radius / spacing references the design-project
   tokens defined in globals.css. */

const inputBase = [
  "w-full bg-card border border-[#d5c1cc] rounded-md",
  "text-sm text-foreground",
  "py-2 px-4 transition-all duration-200",
  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:outline-none",
].join(" ");

const btnPrimary = [
  "w-full bg-primary text-white rounded-md",
  "font-medium text-sm tracking-[0.01em]",
  "py-2 px-4 transition-colors duration-200",
  "hover:bg-primary/90 cursor-pointer",
  "border-none outline-none",
  "flex justify-center items-center",
].join(" ");

const btnSSO = [
  "flex-1 bg-card border border-[#d5c1cc] text-foreground",
  "font-medium text-sm tracking-[0.01em]",
  "py-2 px-4 rounded-md",
  "hover:bg-muted transition-colors duration-200",
  "cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary",
].join(" ");

/* ── Page component ─────────────────────────────────────────── */

export default function LoginPage({ onNext }: { onNext?: () => void } = {}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password to continue.");
      return;
    }
    setError(null);
    if (onNext) {
      onNext();
      return;
    }
    console.log("Sign-in submitted");
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground antialiased p-4 md:p-0">
      {/* ── Card ────────────────────────────────────────────── */}
      <div className="w-full max-w-[400px] bg-card border border-[#d5c1cc] rounded-md p-8 flex flex-col gap-5 shadow-sm">
        {/* Brand + heading */}
        <div className="flex flex-col items-center gap-1">
          <Image
            src="/images/xebia-logo.png"
            alt="Xebia"
            width={80}
            height={80}
            className="mb-4"
            priority
          />
          <h1 className="font-heading font-semibold text-2xl text-foreground">
            Sign in
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Tenant detected automatically from subdomain
          </p>
        </div>

        {/* ── Form ──────────────────────────────────────────── */}
        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              className="font-medium text-xs tracking-[0.01em] text-muted-foreground"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={inputBase}
              id="email"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label
                className="font-medium text-xs tracking-[0.01em] text-muted-foreground"
                htmlFor="password"
              >
                Password
              </label>
              <button
                className="font-semibold text-xs text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
                type="button"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative w-full">
              <input
                className={`${inputBase} pr-8`}
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit + lockout notice */}
          <div className="flex flex-col gap-2 mt-1">
            <button className={btnPrimary} type="submit">
              Sign in
            </button>
            <p className="text-xs font-semibold text-muted-foreground text-center mt-1 opacity-80">
              Locks after 5 failed attempts in 15 minutes.
            </p>
            {/* Hidden until triggered by auth response */}
            <p className="text-xs font-semibold text-destructive text-center mt-1 hidden">
              Account locked due to multiple failed attempts.
            </p>
          </div>
        </form>

        {/* ── Divider ───────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="h-px bg-border flex-1" />
          <span className="font-semibold text-xs text-muted-foreground">
            or continue with
          </span>
          <div className="h-px bg-border flex-1" />
        </div>

        {/* ── SSO buttons ───────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            <button className={btnSSO} type="button">
              Google
            </button>
            <button className={btnSSO} type="button">
              Microsoft
            </button>
          </div>
          <p className="text-xs font-semibold text-muted-foreground text-center mt-1">
            SAML available for enterprise tenants
          </p>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="mt-1 pt-5 border-t border-border">
          {error && (
            <div className="mb-4 flex items-start gap-2 py-2 px-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
              <span className="material-symbols-outlined text-[20px] shrink-0 select-none">
                error
              </span>
              <span className="text-sm font-medium text-left">
                {error}
              </span>
            </div>
          )}
          <p className="text-xs font-semibold text-muted-foreground text-center">
            New tenant? Contact your admin for an invite
          </p>
        </div>
      </div>

      {/* ── Accessibility note (below card) ─────────────────── */}
      <div className="mt-5">
        <p className="text-xs font-semibold text-muted-foreground text-center">
          Accessibility: full keyboard navigation · screen-reader labels on
          all fields
        </p>
      </div>
    </main>
  );
}
