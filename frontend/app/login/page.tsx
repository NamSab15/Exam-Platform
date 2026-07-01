"use client";

import { useState } from "react";
import type { Metadata } from "next";

/* ── Shared style constants ─────────────────────────────────────
   Every colour / radius / spacing references a design-token variable
   through the Tailwind theme (see globals.css @theme). */

const inputBase = [
  "w-full bg-background border border-border rounded-sm",
  "text-[16px] leading-[24px] text-heading",
  "py-2 px-4 transition-all duration-200",
  "outline-none focus:border-primary",
  "focus:shadow-[0_0_0_2px_rgba(108,29,95,0.2)]",
].join(" ");

const btnPrimary = [
  "w-full bg-primary text-white rounded-sm",
  "font-medium text-[14px] leading-[16px] tracking-[0.01em]",
  "py-2 px-4 transition-colors duration-200",
  "hover:bg-primary-hover cursor-pointer",
  "border-none outline-none",
  "flex justify-center items-center",
].join(" ");

const btnSSO = [
  "flex-1 bg-background border border-border text-heading",
  "font-medium text-[14px] leading-[16px] tracking-[0.01em]",
  "py-2 px-4 rounded-sm",
  "hover:bg-input-hover-bg transition-colors duration-200",
  "cursor-pointer",
].join(" ");

/* ── Page component ─────────────────────────────────────────── */

export default function LoginPage({ onNext }: { onNext?: () => void } = {}) {
  const [showPassword, setShowPassword] = useState(false);

  function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (onNext) {
      onNext();
      return;
    }
    // TODO: wire to POST /auth/login once the backend is ready
    console.log("Sign-in submitted");
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-background text-heading antialiased p-4 md:p-0">
      {/* ── Card ────────────────────────────────────────────── */}
      <div className="w-full max-w-[400px] bg-background border border-border p-8 flex flex-col gap-5">
        {/* Brand + heading */}
        <div className="flex flex-col items-center gap-1">
          <div className="bg-primary text-white px-5 py-1 rounded-full font-medium text-[14px] leading-[16px] tracking-widest uppercase mb-4">
            Xebia
          </div>
          <h1 className="font-semibold text-[20px] leading-[28px] text-heading">
            Sign in
          </h1>
          <p className="text-[14px] leading-[20px] text-body text-center">
            Tenant detected automatically from subdomain
          </p>
        </div>

        {/* ── Form ──────────────────────────────────────────── */}
        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              className="font-medium text-[14px] leading-[16px] tracking-[0.01em] text-body"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={inputBase}
              id="email"
              placeholder="name@company.com"
              required
              type="email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label
                className="font-medium text-[14px] leading-[16px] tracking-[0.01em] text-body"
                htmlFor="password"
              >
                Password
              </label>
              <button
                className="font-semibold text-[12px] leading-[16px] text-body hover:underline cursor-pointer bg-transparent border-none p-0"
                type="button"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative w-full">
              <input
                className={`${inputBase} pr-8`}
                id="password"
                required
                type={showPassword ? "text" : "password"}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-[12px] leading-[16px] text-body hover:text-heading transition-colors cursor-pointer bg-transparent border-none p-0"
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
            <p className="text-[12px] leading-[16px] font-semibold text-body text-center mt-1 opacity-80">
              Locks after 5 failed attempts in 15 minutes.
            </p>
            {/* Hidden until triggered by auth response */}
            <p className="text-[12px] leading-[16px] font-semibold text-error text-center mt-1 hidden">
              Account locked due to multiple failed attempts.
            </p>
          </div>
        </form>

        {/* ── Divider ───────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="h-px bg-border-light flex-1" />
          <span className="font-semibold text-[12px] leading-[16px] text-body">
            or continue with
          </span>
          <div className="h-px bg-border-light flex-1" />
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
          <p className="text-[12px] leading-[16px] font-semibold text-body text-center mt-1">
            SAML available for enterprise tenants
          </p>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="mt-1 pt-5 border-t border-border-light">
          <div className="mb-4 h-[24px] border border-dashed border-border rounded-sm" />
          <p className="text-[12px] leading-[16px] font-semibold text-body text-center">
            New tenant? Contact your admin for an invite
          </p>
        </div>
      </div>

      {/* ── Accessibility note (below card) ─────────────────── */}
      <div className="mt-5">
        <p className="text-[12px] leading-[16px] font-semibold text-body text-center">
          Accessibility: full keyboard navigation · screen-reader labels on
          all fields
        </p>
      </div>
    </main>
  );
}
