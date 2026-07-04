"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingStepper from "../OnboardingStepper";
import AppNavbar from "@/components/AppNavbar";
import BottomNav from "@/components/BottomNav";

/* ── Shared style constants ─────────────────────────────────────
   Every color / radius / spacing references the design-project
   tokens defined in globals.css. */

const inputBase = [
  "w-full bg-card border border-outline-variant rounded-md",
  "text-body-md text-foreground",
  "py-2 px-3 transition-all duration-200",
  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:outline-none",
].join(" ");

const btnPrimary = [
  "bg-primary text-on-primary rounded-md font-medium",
  "text-body-md tracking-[0.01em]",
  "px-4 py-2 hover:bg-primary/90 transition-colors duration-200",
  "border-none outline-none cursor-pointer",
  "flex items-center gap-2",
].join(" ");

const btnSecondary = [
  "bg-transparent text-foreground border border-outline-variant rounded-md font-medium",
  "text-body-md tracking-[0.01em]",
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
        <p className="text-body-md text-foreground font-medium">
          {label}
        </p>
        <p className="text-label-sm text-muted-foreground">{description}</p>
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
          enabled ? "bg-primary" : "bg-outline-variant",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-5 w-5 rounded-full bg-card",
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
            <h1 className="font-heading font-semibold text-headline-lg text-foreground mb-1">
              Configure timezone and notifications
            </h1>
            <p className="text-body-md text-muted-foreground">
              These settings apply to all exams in your organisation unless
              overridden at the exam level.
            </p>
          </header>

          {/* ── Progress stepper ─────────────────────────────── */}
          <div className="mb-8">
            <OnboardingStepper currentStep={3} />
          </div>

          {/* ── Main form card ───────────────────────────────── */}
          <div className="bg-card border border-outline-variant rounded-md p-6 mt-4 shadow-elevation-1">
            <h2 className="font-heading font-semibold text-headline-md text-foreground mb-6">
              Step 3 — Timezone &amp; Notifications
            </h2>

            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Timezone selector */}
              <div>
                <label className="block font-medium text-label-sm tracking-[0.01em] text-muted-foreground mb-2">
                  Default timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="form-select cursor-pointer"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date format selection */}
              <div>
                <label className="block font-medium text-label-sm tracking-[0.01em] text-muted-foreground mb-2">
                  Default date format
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  {DATE_FORMATS.map((fmt) => {
                    const isSelected = dateFormat === fmt;
                    return (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setDateFormat(fmt)}
                        className={[
                          "flex-1 border py-2 px-3 text-center",
                          "font-medium text-body-md tracking-[0.01em]",
                          "transition-colors duration-200 cursor-pointer",
                          isSelected
                            ? "bg-primary text-on-primary border-primary rounded-md"
                            : "bg-transparent text-muted-foreground border-outline-variant hover:bg-muted rounded-md",
                        ].join(" ")}
                      >
                        {fmt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Default instructions editor */}
              <div>
                <label
                  className="block font-medium text-label-sm tracking-[0.01em] text-muted-foreground mb-2"
                  htmlFor="default_instructions"
                >
                  Default candidate instructions
                </label>
                <textarea
                  className="form-textarea min-h-[100px] resize-y"
                  id="default_instructions"
                  name="default_instructions"
                  placeholder="e.g. Please ensure you have a stable internet connection..."
                  value={defaultInstructions}
                  onChange={(e) => setDefaultInstructions(e.target.value)}
                />
              </div>

              {/* Notification recipient email */}
              <div>
                <label
                  className="block font-medium text-label-sm tracking-[0.01em] text-muted-foreground mb-2"
                  htmlFor="notif_email"
                >
                  System notification email
                </label>
                <input
                  className={inputBase}
                  id="notif_email"
                  name="notif_email"
                  placeholder="alerts@northbridge.edu"
                  type="email"
                  value={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.value)}
                />
                <p className="text-label-sm text-muted-foreground mt-1">
                  Errors, audit trails, and security alerts are copied here.
                </p>
              </div>

              {/* Notification toggle switches */}
              <div>
                <label className="block font-medium text-label-sm tracking-[0.01em] text-muted-foreground mb-2">
                  Event notifications
                </label>
                <div className="border border-outline-variant bg-card rounded-md divide-y divide-outline-variant shadow-elevation-1">
                  <div className="px-4">
                    <Toggle
                      enabled={remindersOn}
                      onToggle={() => setRemindersOn((v) => !v)}
                      label="Candidate exam reminders"
                      description="Send email reminders 24 hours and 1 hour before scheduled exams"
                    />
                  </div>
                  <div className="px-4">
                    <Toggle
                      enabled={resultsOn}
                      onToggle={() => setResultsOn((v) => !v)}
                      label="Exam results published"
                      description="Notify candidates as soon as their results are released"
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
              <div className="flex justify-end gap-4 pt-6 border-t border-outline-variant mt-2">
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
