"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingStepper from "../OnboardingStepper";
import AppNavbar from "@/components/AppNavbar";
import BottomNav from "@/components/BottomNav";

/* ── Shared style constants ─────────────────────────────────────
   Every color / radius / spacing references the design-project
   tokens defined in globals.css. */

const btnPrimary = [
  "bg-primary text-white rounded-md font-medium",
  "text-sm tracking-[0.01em]",
  "px-4 py-2 hover:bg-primary/90 transition-colors duration-200",
  "border-none outline-none cursor-pointer",
  "flex items-center gap-2",
].join(" ");

const btnSecondary = [
  "bg-transparent text-foreground border border-[#d5c1cc] rounded-md font-medium",
  "text-sm tracking-[0.01em]",
  "px-6 py-2 hover:bg-muted transition-colors duration-200",
  "cursor-pointer outline-none",
].join(" ");

/* ── Placeholder data ───────────────────────────────────────── */

const PLACEHOLDER = {
  orgName: "Acme University",
  slug: "acme-university",
  planTier: "Professional",
  primaryContact: "admin@acme.edu",

  brandColor: "#510047",
  displayName: "Acme University",
  tagline: "Excellence in Assessment",

  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  notifEmail: "exams@acme.edu",
  enabledNotifications: ["Exam reminders", "Result notifications"],

  invitedUsers: [
    { name: "Siddharth Sen", email: "siddharth@acme.edu", role: "Exam Creator" },
    { name: "Neha Sharma", email: "neha@acme.edu", role: "Evaluator" },
  ],
};

/* ── Summary row helper ─────────────────────────────────────── */

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2">
      <span className="text-muted-foreground text-sm shrink-0 sm:w-40">
        {label}
      </span>
      <span className="text-foreground text-sm">
        {children}
      </span>
    </div>
  );
}

/* ── Summary card helper ────────────────────────────────────── */

function SummaryCard({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="bg-card border border-[#d5c1cc] rounded-md p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => router.push(editHref)}
          className="text-primary text-xs hover:underline cursor-pointer bg-transparent border-none p-0 font-medium"
        >
          Edit
        </button>
      </div>
      <div className="divide-y divide-[#d5c1cc]">{children}</div>
    </div>
  );
}

/* ── Page component ─────────────────────────────────────────── */

export default function OnboardingStep5Page({ onNext }: { onNext?: () => void } = {}) {
  const router = useRouter();
  const [setupComplete, setSetupComplete] = useState(false);

  function handleBack() {
    router.push("/onboarding/step-4");
  }

  function handleComplete() {
    try {
      localStorage.setItem(
        "xebia_wizard_data",
        JSON.stringify({
          orgName: PLACEHOLDER.orgName,
          slug: PLACEHOLDER.slug,
          planTier: PLACEHOLDER.planTier,
          primaryContact: PLACEHOLDER.primaryContact,
          brandColor: PLACEHOLDER.brandColor,
          displayName: PLACEHOLDER.displayName,
          tagline: PLACEHOLDER.tagline,
          timezone: PLACEHOLDER.timezone,
          dateFormat: PLACEHOLDER.dateFormat,
          notifEmail: PLACEHOLDER.notifEmail,
          defaultInstructions: "",
          remindersOn: PLACEHOLDER.enabledNotifications.includes("Exam reminders"),
          resultsOn: PLACEHOLDER.enabledNotifications.includes("Result notifications"),
          assignmentsOn: false,
        })
      );
    } catch {
      // localStorage unavailable — org-settings will use defaults
    }

    setSetupComplete(true);
    console.log(
      "Onboarding complete — tenant slug:",
      PLACEHOLDER.slug
    );
    if (onNext) setTimeout(() => onNext(), 1500);
  }

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background flex justify-center pt-24 pb-8 md:pt-28 md:pb-12 px-4 md:px-12 text-foreground">
        <div className="w-full max-w-[800px] flex flex-col">
        {/* ── Header ───────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="font-heading font-semibold text-3xl text-foreground mb-1">
            Review your setup
          </h1>
          <p className="text-sm text-muted-foreground">
            Check everything before we create your organisation. You can change
            these settings later from the admin panel.
          </p>
        </header>

        {/* ── Progress stepper ─────────────────────────────── */}
        <div className="mb-8">
          <OnboardingStepper currentStep={5} />
        </div>

        {/* ── Summary cards ────────────────────────────────── */}
        <div className="flex flex-col gap-4 mt-4">
          {/* Card 1 — Organisation Details */}
          <SummaryCard
            title="Organisation Details"
            editHref="/onboarding/step-1"
          >
            <SummaryRow label="Organisation name">
              {PLACEHOLDER.orgName}
            </SummaryRow>
            <SummaryRow label="Tenant slug">
              <span className="font-mono">{PLACEHOLDER.slug}</span>
              <span className="block text-muted-foreground text-xs mt-0.5">
                (your unique isolation key — cannot be changed after setup)
              </span>
            </SummaryRow>
            <SummaryRow label="Plan tier">
              <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium inline-block">
                {PLACEHOLDER.planTier}
              </span>
            </SummaryRow>
            <SummaryRow label="Primary contact">
              {PLACEHOLDER.primaryContact}
            </SummaryRow>
          </SummaryCard>

          {/* Card 2 — Branding */}
          <SummaryCard title="Branding" editHref="/onboarding/step-2">
            <SummaryRow label="Logo">
              <div className="w-16 h-16 bg-muted rounded border border-[#d5c1cc] flex items-center justify-center text-muted-foreground text-xs">
                No logo
              </div>
            </SummaryRow>
            <SummaryRow label="Brand colour">
              <span className="flex items-center gap-2 font-mono">
                <span
                  className="w-5 h-5 rounded-full inline-block border border-[#d5c1cc]"
                  style={{ backgroundColor: PLACEHOLDER.brandColor }}
                />
                {PLACEHOLDER.brandColor}
              </span>
            </SummaryRow>
            <SummaryRow label="Display name">
              {PLACEHOLDER.displayName}
            </SummaryRow>
            <SummaryRow label="Tagline">
              {PLACEHOLDER.tagline || "—"}
            </SummaryRow>
          </SummaryCard>

          {/* Card 3 — Timezone & Notifications */}
          <SummaryCard
            title="Timezone & Notifications"
            editHref="/onboarding/step-3"
          >
            <SummaryRow label="Timezone">{PLACEHOLDER.timezone}</SummaryRow>
            <SummaryRow label="Date format">
              {PLACEHOLDER.dateFormat}
            </SummaryRow>
            <SummaryRow label="Notification email">
              {PLACEHOLDER.notifEmail}
            </SummaryRow>
            <SummaryRow label="Active notifications">
              <span className="flex flex-wrap gap-1">
                {PLACEHOLDER.enabledNotifications.map((n) => (
                  <span
                    key={n}
                    className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full border border-success/20 font-medium"
                  >
                    {n}
                  </span>
                ))}
              </span>
            </SummaryRow>
          </SummaryCard>

          {/* Card 4 — Invited Users */}
          <SummaryCard title="Invited Users" editHref="/onboarding/step-4">
            {PLACEHOLDER.invitedUsers.length === 0 ? (
              <p className="text-muted-foreground text-sm py-2">
                No users invited — you can add them after setup.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-semibold text-muted-foreground">
                        <th className="py-2 pr-4 font-semibold">Name</th>
                        <th className="py-2 pr-4 font-semibold">Email</th>
                        <th className="py-2 font-semibold">Role</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-foreground">
                      {PLACEHOLDER.invitedUsers.slice(0, 5).map((u) => (
                        <tr
                          key={u.email}
                          className="border-t border-[#d5c1cc]"
                        >
                          <td className="py-2 pr-4">{u.name}</td>
                          <td className="py-2 pr-4 text-muted-foreground font-mono">{u.email}</td>
                          <td className="py-2">{u.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {PLACEHOLDER.invitedUsers.length > 5 && (
                  <p className="text-muted-foreground text-sm pt-2">
                    + {PLACEHOLDER.invitedUsers.length - 5} more
                  </p>
                )}
              </>
            )}
          </SummaryCard>
        </div>

        {/* ── Onboarding checklist ─────────────────────────── */}
        <div className="bg-muted border border-[#d5c1cc] rounded-md p-4 mt-6">
          <p className="text-foreground font-semibold text-sm mb-3">
            Your organisation will be set up with:
          </p>
          <ul className="flex flex-col gap-2">
            {[
              `Tenant isolation enabled (slug: ${PLACEHOLDER.slug})`,
              `${PLACEHOLDER.invitedUsers.length} users invited`,
              "Keycloak authentication configured",
              "Welcome emails queued for dispatch",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-[20px]">
                  check_circle
                </span>
                <span className="text-sm text-foreground">
                  {item.includes(PLACEHOLDER.slug) ? (
                    <>
                      Tenant isolation enabled (slug: <span className="font-mono">{PLACEHOLDER.slug}</span>)
                    </>
                  ) : item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Action buttons ───────────────────────────────── */}
        <div className="flex justify-end gap-4 pt-6 mt-4">
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
            onClick={handleComplete}
          >
            Complete setup
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Success banner (shown after clicking Complete setup) */}
        {setupComplete && (
          <div className="bg-success/10 border border-success/30 rounded-md p-4 flex gap-3 items-center mt-4">
            <span className="material-symbols-outlined text-success text-[24px]">
              check_circle
            </span>
            <p className="text-foreground text-sm">
              Your organisation has been created! Sending invite emails and
              redirecting to your dashboard…
            </p>
          </div>
        )}
      </div>
    </main>
    <BottomNav />
  </>
  );
}
