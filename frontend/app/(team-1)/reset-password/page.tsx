"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

/* ── Shared style constants ─────────────────────────────────────
   Every color / radius / spacing references the design-project
   tokens defined in globals.css. */

const inputBase = [
  "w-full bg-card border border-[#d5c1cc] rounded-md",
  "text-sm text-foreground",
  "px-3 py-2 transition-all duration-200",
  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:outline-none",
].join(" ");

const btnPrimary = [
  "w-full bg-primary text-white rounded-md",
  "font-medium text-sm tracking-[0.01em]",
  "py-3 transition-colors duration-200",
  "hover:bg-primary/90 cursor-pointer",
  "border-none outline-none",
  "flex justify-center items-center",
].join(" ");

/* ── Password rules ─────────────────────────────────────────── */

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 10 characters", test: (pw) => pw.length >= 10 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One number", test: (pw) => /\d/.test(pw) },
  { label: "One symbol", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

/* ── Page component ─────────────────────────────────────────── */

export default function ResetPasswordPage({ onNext }: { onNext?: () => void } = {}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((rule) => rule.test(password)),
    [password],
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (onNext) {
      onNext();
      return;
    }
    console.log("Set password submitted");
  }

  return (
    <main className="min-h-screen flex justify-center items-center bg-background text-foreground antialiased p-4 md:p-0">
      <div className="w-full max-w-[400px]">
        {/* ── Card ──────────────────────────────────────────── */}
        <div className="bg-card border border-[#d5c1cc] rounded-md p-8 md:p-10 shadow-sm">
          {/* Brand badge */}
          <div className="flex justify-center mb-6">
            <Image
              src="/Logo-Purple.png"
              alt="Xebia"
              width={64}
              height={64}
              priority
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="font-heading font-semibold text-2xl text-foreground mb-2">
              Set your password
            </h1>
            <p className="text-sm text-muted-foreground">
              First login — this step is required before continuing.
            </p>
          </div>

          {/* Context bar */}
          <div className="bg-muted border border-[#d5c1cc] rounded-md px-3 py-2 mb-6 text-center">
            <span className="text-xs text-muted-foreground font-normal">
              Signed in as: <span className="font-mono">priya.sharma@university.edu</span>
            </span>
          </div>

          {/* ── Form ────────────────────────────────────────── */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* New password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  className="font-medium text-xs tracking-[0.01em] text-muted-foreground"
                  htmlFor="new_password"
                >
                  New password
                </label>
              </div>
              <div className="relative">
                <input
                  className={`${inputBase} pr-12`}
                  id="new_password"
                  name="new_password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-1"
                htmlFor="confirm_password"
              >
                Confirm new password
              </label>
              <div className="relative">
                <input
                  className={`${inputBase} pr-12`}
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="••••••••"
                  required
                  type={showConfirm ? "text" : "password"}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* ── Checklist panel ───────────────────────────── */}
            <div className="bg-muted border border-[#d5c1cc] rounded-md p-4">
              <ul className="space-y-2 mb-3">
                {PASSWORD_RULES.map((rule, i) => {
                  const met = ruleResults[i];
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center text-sm ${
                        met ? "text-success font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {met ? (
                        <svg
                          className="w-4 h-4 mr-2 shrink-0 text-success"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 mr-2 shrink-0 text-muted-foreground"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      )}
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-muted-foreground font-normal">
                Rules are tenant-configurable
              </p>
            </div>

            {/* ── MFA notice ────────────────────────────────── */}
            <div className="border border-dashed border-warning bg-warning/10 rounded-md p-3 text-center">
              <p className="text-sm text-warning">
                <span className="font-medium">If role requires MFA:</span> MFA
                enrollment shown next.
              </p>
            </div>

            {/* ── Submit ────────────────────────────────────── */}
            <button className={btnPrimary} type="submit">
              Set password and continue
            </button>
          </form>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-muted-foreground font-normal mt-6">
          On submit: redirect to tenant onboarding or dashboard by role
        </p>
      </div>
    </main>
  );
}
