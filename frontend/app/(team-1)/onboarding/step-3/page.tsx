/**
 * Onboarding Step 3 — Timezone & Notifications
 * Route: /onboarding/step-3
 * BRD: §4.1.1 — Tenant timezone, date format, and notification settings
 *
 * Configures the organisation's default timezone, date format,
 * notification sender address, default candidate instructions,
 * and notification toggle preferences.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingStepper from "../OnboardingStepper";
import AppNavbar from "@/components/AppNavbar";
import BottomNav from "@/components/BottomNav";

/* ── Shared style constants ─────────────────────────────────────
   Every colour / radius / spacing references the design-project
   tokens defined in globals.css. */

const inputBase = [
  "w-full bg-card border border-[#d5c1cc] rounded-md",
  "text-[16px] leading-[24px] text-foreground",
  "py-2 px-3 transition-all duration-200",
  "outline-none focus:border-primary focus:ring-1 focus:ring-primary",
].join(" ");

const btnPrimary = [
  "bg-primary text-white rounded-md font-medium",
  "text-[14px] leading-[16px] tracking-[0.01em]",
  "px-4 py-2 hover:bg-primary/80 transition-colors duration-200",
  "border-none outline-none cursor-pointer",
  "flex items-center gap-2",
].join(" ");

const btnSecondary = [
  "bg-transparent text-foreground border border-[#d5c1cc] rounded-md font-medium",
  "text-[14px] leading-[16px] tracking-[0.01em]",
  "px-6 py-2 hover:bg-muted transition-colors duration-200",
  "cursor-pointer outline-none",
].join(" ");

/* ── Timezone options ───────────────────────────────────────── */

const TIMEZONES = [
  "UTC",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Australia/Sydney",
] as const;

const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] as const;
type DateFormat = (typeof DATE_FORMATS)[number];

/* ── Toggle component (inline) ──────────────────────────────── */

function Toggle({
  enabled,
  onToggle,
  label,
  description,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex-1">
        <p className="text-[14px] leading-[20px] text-foreground font-medium">
          {label}
        </p>
        <p className="text-[14px] leading-[20px] text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={onToggle}
        className={[
          "relative inline-flex h-6 w-11 shrink-0 rounded-full",
          "cursor-pointer transition-all duration-200",
          "border-none outline-none p-0",
          enabled ? "bg-primary" : "bg-border",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-5 w-5 rounded-full bg-background",
            "shadow-sm transition-transform duration-200",
            "mt-0.5 ml-0.5",
            enabled ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

/* ── Page component ─────────────────────────────────────────── */

export default function OnboardingStep3Page({ onNext }: { onNext?: () => void } = {}) {
  const router = useRouter();

  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState<DateFormat>("DD/MM/YYYY");
  const [notifEmail, setNotifEmail] = useState("");
  const [defaultInstructions, setDefaultInstructions] = useState("");
  const [remindersOn, setRemindersOn] = useState(true);
  const [resultsOn, setResultsOn] = useState(true);
  const [assignmentsOn, setAssignmentsOn] = useState(false);

  function handleBack() {
    router.push("/onboarding/step-2");
  }

  function handleNext() {
    if (onNext) {
      onNext();
      return;
    }
    console.log("Step 3 data:", {
      timezone,
      dateFormat,
      notifEmail,
      defaultInstructions,
      remindersOn,
      resultsOn,
      assignmentsOn,
    });
    router.push("/onboarding/step-4");
  }

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background flex justify-center pt-24 pb-8 md:pt-28 md:pb-12 px-4 md:px-12 text-foreground">
        <div className="w-full max-w-[800px] flex flex-col">
        {/* ── Header ───────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="font-semibold text-[32px] leading-[40px] tracking-[-0.02em] text-foreground mb-1">
            Configure timezone and notifications
          </h1>
          <p className="text-[14px] leading-[20px] text-muted-foreground">
            These settings apply to all exams in your organisation unless
            overridden at the exam level.
          </p>
        </header>

        {/* ── Progress stepper ─────────────────────────────── */}
        <div className="mb-8">
          <OnboardingStepper currentStep={3} />
        </div>

        {/* ── Main form card ───────────────────────────────── */}
        <div className="bg-background border border-border rounded-md p-6 mt-4">
          <h2 className="font-semibold text-[20px] leading-[28px] text-foreground mb-6">
            Step 3 — Timezone &amp; Notifications
          </h2>

          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Timezone selector */}
            <div>
              <label
                className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
                htmlFor="timezone"
              >
                Organisation timezone
              </label>
              <p className="text-[14px] leading-[20px] text-muted-foreground mb-2">
                All exam scheduling times will be stored in UTC and displayed to
                candidates in this timezone.
              </p>
              <select
                className={`${inputBase} cursor-pointer`}
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            {/* Date format radio group */}
            <div>
              <label className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2">
                Date display format
              </label>
              <div className="flex flex-col gap-1">
                {DATE_FORMATS.map((fmt) => {
                  const isSelected = dateFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setDateFormat(fmt)}
                      className={[
                        "flex items-center gap-3 px-3 py-2 rounded-sm",
                        "transition-colors duration-200 cursor-pointer",
                        "border-none bg-transparent outline-none text-left w-full",
                        isSelected
                          ? "bg-muted"
                          : "hover:bg-muted",
                      ].join(" ")}
                    >
                      {/* Radio circle */}
                      <span
                        className={[
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                          isSelected ? "border-primary" : "border-border",
                        ].join(" ")}
                      >
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </span>
                      <span className="text-foreground text-[14px] leading-[20px]">
                        {fmt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notification email */}
            <div>
              <label
                className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
                htmlFor="notif_email"
              >
                Notification sender address
              </label>
              <p className="text-[14px] leading-[20px] text-muted-foreground mb-2">
                System emails (exam invites, results, certificates) will be sent
                from this address.
              </p>
              <input
                className={inputBase}
                id="notif_email"
                name="notif_email"
                placeholder="exams@yourdomain.com"
                type="email"
                value={notifEmail}
                onChange={(e) => setNotifEmail(e.target.value)}
              />
            </div>

            {/* Default candidate instructions */}
            <div>
              <label
                className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
                htmlFor="default_instructions"
              >
                Default candidate instructions
              </label>
              <p className="text-[14px] leading-[20px] text-muted-foreground mb-2">
                Pre-filled on every new exam. Exam creators can override this
                per exam.
              </p>
              <textarea
                className={`${inputBase} resize-none h-24`}
                id="default_instructions"
                name="default_instructions"
                placeholder="e.g. Ensure you have a stable internet connection and a working webcam before starting."
                value={defaultInstructions}
                onChange={(e) => setDefaultInstructions(e.target.value)}
              />
            </div>

            {/* Notification toggles */}
            <div>
              <label className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2">
                Email notifications
              </label>
              <div className="border border-border rounded-sm divide-y divide-border">
                <div className="px-4">
                  <Toggle
                    enabled={remindersOn}
                    onToggle={() => setRemindersOn((v) => !v)}
                    label="Exam reminders"
                    description="Send candidates a reminder 24 hours before their exam"
                  />
                </div>
                <div className="px-4">
                  <Toggle
                    enabled={resultsOn}
                    onToggle={() => setResultsOn((v) => !v)}
                    label="Result notifications"
                    description="Notify candidates when results are published"
                  />
                </div>
                <div className="px-4">
                  <Toggle
                    enabled={assignmentsOn}
                    onToggle={() => setAssignmentsOn((v) => !v)}
                    label="Evaluator assignments"
                    description="Notify evaluators when new answer sheets are assigned"
                  />
                </div>
              </div>
            </div>

            {/* Navigation actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-border mt-2">
              <button
                className={btnSecondary}
                type="button"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className={btnPrimary}
                type="button"
                onClick={handleNext}
              >
                Next
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
    <BottomNav />
  </>
  );
}
