/**
 * Onboarding Step 5 — Review & Confirm
 * Route: /onboarding/step-5
 * BRD: §4.1.1, §4.1.2 — Final review before tenant creation
 *
 * Read-only summary of all previous steps with edit links.
 * "Complete setup" triggers a placeholder success state.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingStepper from "../OnboardingStepper";

/* ── Shared style constants ─────────────────────────────────────
   Every colour / radius / spacing references a design-token variable
   through the Tailwind theme (see globals.css @theme). */

const btnPrimary = [
  "bg-primary text-white rounded-md font-medium",
  "text-[14px] leading-[16px] tracking-[0.01em]",
  "px-4 py-2 hover:bg-primary-hover transition-colors duration-200",
  "border-none outline-none cursor-pointer",
  "flex items-center gap-2",
].join(" ");

const btnSecondary = [
  "bg-background text-body border border-border rounded-sm font-medium",
  "text-[14px] leading-[16px] tracking-[0.01em]",
  "px-6 py-2 hover:bg-surface-hover transition-colors duration-200",
  "cursor-pointer",
].join(" ");

/* ── Placeholder data ───────────────────────────────────────── */
/* TODO: replace with context/API data from previous steps      */

const PLACEHOLDER = {
  orgName: "Acme University",
  slug: "acme-university",
  planTier: "Professional",
  primaryContact: "admin@acme.edu",

  brandColor: "#6C1D5F",
  displayName: "Acme University",
  tagline: "Excellence in Assessment",

  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  notifEmail: "exams@acme.edu",
  enabledNotifications: ["Exam reminders", "Result notifications"],

  invitedUsers: [
    { name: "Priya Sharma", email: "priya@acme.edu", role: "Exam Creator" },
    { name: "Arjun Mehta", email: "arjun@acme.edu", role: "Proctor" },
    { name: "Lena Fischer", email: "lena@acme.edu", role: "Candidate" },
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
      <span className="text-muted text-[14px] leading-[20px] shrink-0 sm:w-40">
        {label}
      </span>
      <span className="text-heading text-[14px] leading-[20px]">
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
    <div className="border border-border rounded-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-heading font-semibold text-[16px] leading-[24px]">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => router.push(editHref)}
          className="text-primary text-[14px] hover:underline cursor-pointer bg-transparent border-none p-0 font-medium"
        >
          Edit
        </button>
      </div>
      <div className="divide-y divide-border">{children}</div>
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
    setSetupComplete(true);
    console.log(
      "Onboarding complete — tenant slug:",
      PLACEHOLDER.slug
    );
    if (onNext) setTimeout(() => onNext(), 1500);
  }

  return (
    <main className="min-h-screen bg-background flex justify-center py-8 md:py-12 px-4 md:px-12">
      <div className="w-full max-w-[800px] flex flex-col">
        {/* ── Header ───────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="font-semibold text-[32px] leading-[40px] tracking-[-0.02em] text-heading mb-1">
            Review your setup
          </h1>
          <p className="text-[14px] leading-[20px] text-body">
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
            {/* TODO: replace with context/API data */}
            <SummaryRow label="Organisation name">
              {PLACEHOLDER.orgName}
            </SummaryRow>
            <SummaryRow label="Tenant slug">
              <span>{PLACEHOLDER.slug}</span>
              <span className="block text-muted text-[12px] leading-[16px] mt-0.5">
                (your unique isolation key — cannot be changed after setup)
              </span>
            </SummaryRow>
            <SummaryRow label="Plan tier">
              <span className="bg-surface-hover text-heading rounded-full px-3 py-1 text-[14px] font-medium inline-block">
                {PLACEHOLDER.planTier}
              </span>
            </SummaryRow>
            <SummaryRow label="Primary contact">
              {PLACEHOLDER.primaryContact}
            </SummaryRow>
          </SummaryCard>

          {/* Card 2 — Branding */}
          <SummaryCard title="Branding" editHref="/onboarding/step-2">
            {/* TODO: replace with context/API data */}
            <SummaryRow label="Logo">
              <div className="w-16 h-16 bg-surface-hover rounded border border-border flex items-center justify-center text-muted text-[12px]">
                No logo
              </div>
            </SummaryRow>
            <SummaryRow label="Brand colour">
              <span className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full inline-block border border-border"
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
            {/* TODO: replace with context/API data */}
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
                  /* no token — add to tokens.css if reused */
                  <span
                    key={n}
                    className="bg-[#E8F5E9] text-success-text text-[12px] px-2 py-0.5 rounded-full"
                  >
                    {n}
                  </span>
                ))}
              </span>
            </SummaryRow>
          </SummaryCard>

          {/* Card 4 — Invited Users */}
          <SummaryCard title="Invited Users" editHref="/onboarding/step-4">
            {/* TODO: replace with context/API data */}
            {PLACEHOLDER.invitedUsers.length === 0 ? (
              <p className="text-muted text-[14px] leading-[20px] py-2">
                No users invited — you can add them after setup.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[12px] leading-[16px] font-semibold text-body">
                        <th className="py-2 pr-4 font-medium">Name</th>
                        <th className="py-2 pr-4 font-medium">Email</th>
                        <th className="py-2 font-medium">Role</th>
                      </tr>
                    </thead>
                    <tbody className="text-[14px] leading-[20px] text-heading">
                      {PLACEHOLDER.invitedUsers.slice(0, 5).map((u) => (
                        <tr
                          key={u.email}
                          className="border-t border-border"
                        >
                          <td className="py-2 pr-4">{u.name}</td>
                          <td className="py-2 pr-4 text-body">{u.email}</td>
                          <td className="py-2">{u.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {PLACEHOLDER.invitedUsers.length > 5 && (
                  <p className="text-muted text-[14px] leading-[20px] pt-2">
                    + {PLACEHOLDER.invitedUsers.length - 5} more
                  </p>
                )}
              </>
            )}
          </SummaryCard>
        </div>

        {/* ── Onboarding checklist ─────────────────────────── */}
        {/* TODO: populate dynamically from previous steps */}
        <div className="border border-border rounded-md p-4 mt-6">
          <p className="text-heading font-semibold text-[14px] leading-[20px] mb-3">
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
                <span className="material-symbols-outlined text-success-text text-[20px]">
                  check_circle
                </span>
                <span className="text-[14px] leading-[20px] text-heading">
                  {item}
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
          /* no token — add to tokens.css if reused */
          <div className="bg-[#E8F5E9] border border-[#4CAF50] rounded-md p-4 flex gap-3 items-center mt-4">
            <span className="material-symbols-outlined text-success-text text-[24px]">
              check_circle
            </span>
            <p className="text-heading text-[14px] leading-[20px]">
              Your organisation has been created! Sending invite emails and
              redirecting to your dashboard…
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
