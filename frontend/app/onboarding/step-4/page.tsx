/**
 * Onboarding Step 4 — Invite Users
 * Route: /onboarding/step-4
 * BRD: §4.1.2 — Initial user provisioning during tenant onboarding
 *
 * Lets the tenant admin invite up to 10 users by name, email,
 * and role. Also provides a shortcut to the CSV bulk import flow.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingStepper from "../OnboardingStepper";

/* ── Shared style constants ─────────────────────────────────────
   Every colour / radius / spacing references the design-project
   tokens defined in globals.css. */

const inputBase = [
  "w-full bg-background border border-border rounded-sm",
  "text-[16px] leading-[24px] text-foreground",
  "py-2 px-3 transition-all duration-200",
  "outline-none focus:border-primary",
  "focus-visible:ring-2 focus-visible:ring-ring/50",
].join(" ");

const btnPrimary = [
  "bg-primary text-primary-foreground rounded-md font-medium",
  "text-[14px] leading-[16px] tracking-[0.01em]",
  "px-4 py-2 hover:bg-primary/80 transition-colors duration-200",
  "border-none outline-none cursor-pointer",
  "flex items-center gap-2",
].join(" ");

const btnSecondary = [
  "bg-background text-muted-foreground border border-border rounded-sm font-medium",
  "text-[14px] leading-[16px] tracking-[0.01em]",
  "px-6 py-2 hover:bg-muted transition-colors duration-200",
  "cursor-pointer",
].join(" ");

/* ── Types ──────────────────────────────────────────────────── */

interface InviteRow {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ROLES = [
  "Tenant Admin",
  "Exam Creator",
  "Proctor",
  "Report Viewer",
  "Candidate",
] as const;

const MAX_INVITES = 10;

/* ── Page component ─────────────────────────────────────────── */

export default function OnboardingStep4Page({ onNext }: { onNext?: () => void } = {}) {
  const router = useRouter();

  const [invites, setInvites] = useState<InviteRow[]>([
    { id: Date.now(), name: "", email: "", role: "Exam Creator" },
  ]);

  /* ── Row management ──────────────────────────────────────── */

  function addRow() {
    if (invites.length >= MAX_INVITES) return;
    setInvites((prev) => [
      ...prev,
      { id: Date.now(), name: "", email: "", role: "Exam Creator" },
    ]);
  }

  function removeRow(id: number) {
    setInvites((prev) => prev.filter((row) => row.id !== id));
  }

  function updateRow(id: number, field: keyof InviteRow, value: string) {
    setInvites((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  /* ── Navigation ─────────────────────────────────────────── */

  function handleBack() {
    router.push("/onboarding/step-3");
  }

  function handleNext() {
    if (onNext) {
      onNext();
      return;
    }
    console.log("Step 4 data:", { invites });
    router.push("/onboarding/step-5");
  }

  return (
    <main className="min-h-screen bg-background flex justify-center py-8 md:py-12 px-4 md:px-12 text-foreground">
      <div className="w-full max-w-[800px] flex flex-col">
        {/* ── Header ───────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="font-semibold text-[32px] leading-[40px] tracking-[-0.02em] text-foreground mb-1">
            Invite your team
          </h1>
          <p className="text-[14px] leading-[20px] text-muted-foreground">
            Add users to your organisation. You can always invite more later
            from the Users page.
          </p>
        </header>

        {/* ── Progress stepper ─────────────────────────────── */}
        <div className="mb-8">
          <OnboardingStepper currentStep={4} />
        </div>

        {/* ── Main form card ───────────────────────────────── */}
        <div className="bg-background border border-border p-6 mt-4">
          <h2 className="font-semibold text-[20px] leading-[28px] text-foreground mb-6">
            Step 4 — Invite users
          </h2>

          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Invite row builder */}
            <div className="flex flex-col gap-3">
              {/* Column labels */}
              <div className="hidden sm:flex gap-3 text-[12px] leading-[16px] font-semibold text-muted-foreground">
                <span className="flex-1">Full name</span>
                <span className="flex-1">Email address</span>
                <span className="w-44">Role</span>
                <span className="w-9" />
              </div>

              {invites.map((row, idx) => (
                <div key={row.id} className="flex flex-col sm:flex-row gap-3">
                  <input
                    className={`${inputBase} flex-1`}
                    placeholder="Full name"
                    type="text"
                    value={row.name}
                    onChange={(e) => updateRow(row.id, "name", e.target.value)}
                  />
                  <input
                    className={`${inputBase} flex-1`}
                    placeholder="Email address"
                    type="email"
                    value={row.email}
                    onChange={(e) => updateRow(row.id, "email", e.target.value)}
                  />
                  <select
                    className={`${inputBase} w-full sm:w-44 cursor-pointer`}
                    value={row.role}
                    onChange={(e) => updateRow(row.id, "role", e.target.value)}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {/* Remove button — hidden on the first row */}
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className={[
                      "text-destructive hover:opacity-80 transition-colors cursor-pointer",
                      "bg-transparent border-none p-1 self-center",
                      idx === 0 ? "invisible" : "",
                    ].join(" ")}
                    aria-label={`Remove invite row ${idx + 1}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              ))}

              {/* Add another button or limit message */}
              {invites.length < MAX_INVITES ? (
                <button
                  type="button"
                  onClick={addRow}
                  className={`${btnSecondary} flex items-center gap-2 self-start mt-1`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                  Add another person
                </button>
              ) : (
                <p className="text-muted-foreground text-[14px] leading-[20px] mt-1">
                  Maximum of 10 invites at once. Add more after setup.
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px bg-border flex-1" />
              <span className="text-muted-foreground text-[14px] font-medium">or</span>
              <div className="h-px bg-border flex-1" />
            </div>

            {/* Bulk import shortcut */}
            <div>
              <button
                type="button"
                onClick={() => console.log("Navigate to bulk import")}
                className={`${btnSecondary} flex items-center gap-2`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  upload
                </span>
                Bulk import via CSV
              </button>
              <p className="text-[14px] leading-[20px] text-muted-foreground mt-2">
                Use the Users page after setup to import hundreds of users at
                once.
              </p>
            </div>

            {/* Info box */}
            <div className="bg-amber-50 border border-amber-300 rounded-md p-3 flex gap-2 items-start">
              <span className="material-symbols-outlined text-amber-600 text-[20px] mt-px shrink-0">
                info
              </span>
              <p className="text-[14px] leading-[20px] text-foreground">
                Invitations will be sent by email once you complete setup in the
                final step. Invited users will be asked to set their password on
                first login.
              </p>
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
  );
}
