"use client";

import { useState, useRef } from "react";
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
  const nextId = useRef(1);

  const [invites, setInvites] = useState<InviteRow[]>([
    { id: 1, name: "", email: "", role: "Exam Creator" },
  ]);

  /* ── Row management ──────────────────────────────────────── */

  function addRow() {
    if (invites.length >= MAX_INVITES) return;
    setInvites((prev) => [
      ...prev,
      { id: nextId.current++, name: "", email: "", role: "Exam Creator" },
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
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background flex justify-center pt-24 pb-8 md:pt-28 md:pb-12 px-4 md:px-12 text-foreground">
        <div className="w-full max-w-[800px] flex flex-col">
          {/* ── Header ───────────────────────────────────────── */}
          <header className="mb-8">
            <h1 className="font-heading font-semibold text-headline-lg text-foreground mb-1">
              Invite your team
            </h1>
            <p className="text-body-md text-muted-foreground">
              Add users to your organisation. You can always invite more later
              from the Users page.
            </p>
          </header>

          {/* ── Progress stepper ─────────────────────────────── */}
          <div className="mb-8">
            <OnboardingStepper currentStep={4} />
          </div>

          {/* ── Main form card ───────────────────────────────── */}
          <div className="bg-card border border-outline-variant rounded-md p-6 mt-4 shadow-elevation-1">
            <h2 className="font-heading font-semibold text-headline-md text-foreground mb-6">
              Step 4 — Invite users
            </h2>

            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Invite row builder */}
              <div className="flex flex-col gap-3">
                {/* Column labels */}
                <div className="hidden sm:grid grid-cols-[1fr_1fr_176px_36px] gap-3 text-label-sm font-semibold text-muted-foreground">
                  <span>Full name</span>
                  <span>Email address</span>
                  <span>Role</span>
                  <span />
                </div>

                {invites.map((row, idx) => (
                  <div key={row.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_176px_36px] gap-3 items-center">
                    <input
                      className={inputBase}
                      placeholder="Full name"
                      type="text"
                      value={row.name}
                      onChange={(e) => updateRow(row.id, "name", e.target.value)}
                    />
                    <input
                      className={inputBase}
                      placeholder="Email address"
                      type="email"
                      value={row.email}
                      onChange={(e) => updateRow(row.id, "email", e.target.value)}
                    />
                    <select
                      className="form-select cursor-pointer w-full"
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
                        "bg-transparent border-none p-1 self-center w-9 justify-self-center",
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
                  <p className="text-muted-foreground text-body-md mt-1">
                    Maximum of 10 invites at once. Add more after setup.
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px bg-outline-variant flex-1" />
                <span className="text-muted-foreground text-body-md font-medium">or</span>
                <div className="h-px bg-outline-variant flex-1" />
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
                <p className="text-body-md text-muted-foreground mt-2">
                  Use the Users page after setup to import hundreds of users at
                  once.
                </p>
              </div>

              {/* Info box */}
              <div className="border border-dashed border-outline-variant bg-muted rounded-md p-3 flex gap-2 items-start">
                <span className="material-symbols-outlined text-muted-foreground text-[20px] mt-px shrink-0 animate-none">
                  info
                </span>
                <p className="text-body-md text-muted-foreground">
                  Invitations will be sent by email once you complete setup in the
                  final step. Invited users will be asked to set their password on
                  first login.
                </p>
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
