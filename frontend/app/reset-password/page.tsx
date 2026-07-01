"use client";

import { useState, useMemo } from "react";

/* ── Shared style constants ─────────────────────────────────────
   Every colour / radius / spacing references a design-token variable
   through the Tailwind theme (see globals.css @theme). */

const inputBase = [
  "w-full bg-background border border-border rounded-sm",
  "text-[16px] leading-[24px] text-heading",
  "px-3 py-2 transition-all duration-200",
  "outline-none focus:border-primary",
  "focus:shadow-[0_0_0_2px_rgba(108,29,95,0.1)]",
].join(" ");

const btnPrimary = [
  "w-full bg-primary text-white rounded-md",
  "font-medium text-[14px] leading-[16px] tracking-[0.01em]",
  "py-3 transition-colors duration-200",
  "hover:bg-primary-hover cursor-pointer",
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
    // TODO: wire to PATCH /auth/set-password once the backend is ready
    console.log("Set password submitted");
  }

  return (
    <main className="min-h-screen flex justify-center items-center bg-background text-heading antialiased p-4 md:p-0">
      <div className="w-full max-w-[400px]">
        {/* ── Card ──────────────────────────────────────────── */}
        <div className="bg-background border border-border rounded-lg p-8 md:p-10">
          {/* Brand badge */}
          <div className="flex justify-center mb-6">
            <span className="bg-primary text-white px-3 py-1 rounded-full font-bold text-[14px] tracking-[0.5px] inline-block">
              Xebia
            </span>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="font-semibold text-[20px] leading-[28px] text-heading mb-2">
              Set your password
            </h1>
            <p className="text-[14px] leading-[20px] text-body">
              First login — this step is required before continuing.
            </p>
          </div>

          {/* Context bar */}
          <div className="bg-surface-hover border border-border rounded px-3 py-2 mb-6 text-center">
            <span className="text-[12px] leading-[16px] text-body font-normal">
              Signed in as: priya.sharma@university.edu
            </span>
          </div>

          {/* ── Form ────────────────────────────────────────── */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* New password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  className="font-medium text-[14px] leading-[16px] tracking-[0.01em] text-heading"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-[12px] leading-[16px] text-body hover:text-heading transition-colors cursor-pointer bg-transparent border-none p-0"
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
                className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-heading mb-1"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-[12px] leading-[16px] text-body hover:text-heading transition-colors cursor-pointer bg-transparent border-none p-0"
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* ── Checklist panel ───────────────────────────── */}
            <div className="bg-surface-hover border border-border rounded p-4">
              <ul className="space-y-2 mb-3">
                {PASSWORD_RULES.map((rule, i) => {
                  const met = ruleResults[i];
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center text-[14px] leading-[20px] ${
                        met ? "text-success-text" : "text-body"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] mr-2 ${
                          met ? "text-success-text" : "text-check-unchecked"
                        }`}
                      >
                        {met ? "check_circle" : "radio_button_unchecked"}
                      </span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
              <p className="text-[12px] leading-[16px] text-check-unchecked font-normal">
                Rules are tenant-configurable
              </p>
            </div>

            {/* ── MFA notice ────────────────────────────────── */}
            <div className="border border-dashed border-warning-border bg-warning-bg rounded p-3 text-center">
              <p className="text-[14px] leading-[20px] text-warning-text">
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
        <p className="text-center text-[12px] leading-[16px] text-body font-normal mt-6">
          On submit: redirect to tenant onboarding or dashboard by role
        </p>
      </div>
    </main>
  );
}
