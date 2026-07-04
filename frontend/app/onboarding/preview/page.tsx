/**
 * Onboarding Preview — Single-page interactive prototype
 * Route: /onboarding/preview
 *
 * All 5 wizard steps rendered in one page with shared state,
 * real navigation, and a final confirmation screen.
 * Built for demoing and testing the full onboarding flow
 * without a backend.
 */

"use client";

import { useState, useRef } from "react";
import OnboardingStepper from "../OnboardingStepper";
import Image from "next/image";

/* ── Shared style constants ─────────────────────────────────────
   Every colour / radius / spacing references the design-project
   tokens defined in globals.css. */

const inputBase = [
  "w-full bg-background border border-border rounded-md",
  "text-[16px] leading-[24px] text-foreground",
  "py-2 px-3 transition-all duration-200",
  "outline-none focus:border-primary",
  "focus-visible:ring-2 focus-visible:ring-primary/20",
].join(" ");

const btnPrimary = [
  "bg-primary text-primary-foreground rounded-md font-medium",
  "text-[14px] leading-[16px] tracking-[0.01em]",
  "px-4 py-2 hover:bg-primary/80 transition-colors duration-200",
  "border-none outline-none cursor-pointer",
  "flex items-center gap-2",
].join(" ");

const btnSecondary = [
  "bg-background text-muted-foreground border border-border rounded-md font-medium",
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

interface WizardData {
  // Step 1
  orgName: string;
  tenantSlug: string;
  planTier: string;
  contactEmail: string;
  // Step 2
  logoPreviewUrl: string;
  brandColor: string;
  displayName: string;
  tagline: string;
  // Step 3
  timezone: string;
  dateFormat: string;
  notifEmail: string;
  defaultInstructions: string;
  remindersOn: boolean;
  resultsOn: boolean;
  assignmentsOn: boolean;
  // Step 4
  invites: InviteRow[];
}

/* ── Constants ──────────────────────────────────────────────── */

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

const PLAN_TIERS = ["Starter", "Professional", "Enterprise"] as const;

const ROLES = [
  "Tenant Admin",
  "Exam Creator",
  "Proctor",
  "Report Viewer",
  "Candidate",
] as const;

const autoSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ── Toggle ─────────────────────────────────────────────────── */

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={[
        "relative w-11 h-6 rounded-full transition-colors duration-200",
        "border-none outline-none cursor-pointer shrink-0 p-0",
        on ? "bg-primary" : "bg-border",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm",
          "transition-transform duration-200",
          on ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}

/* ── ReviewRow ──────────────────────────────────────────────── */

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground text-[14px] leading-[20px] w-40 shrink-0">
        {label}
      </span>
      <span className="text-foreground text-[14px] leading-[20px] text-right">
        {value}
      </span>
    </div>
  );
}

/* ── ReviewCard ─────────────────────────────────────────────── */

function ReviewCard({
  title,
  stepNum,
  children,
  goToStep,
}: {
  title: string;
  stepNum: number;
  children: React.ReactNode;
  goToStep: (n: number) => void;
}) {
  return (
    <div className="border border-border rounded-md p-5 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground text-[16px] leading-[24px]">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => goToStep(stepNum)}
          className="text-primary text-[14px] hover:underline cursor-pointer bg-transparent border-none p-0 font-medium"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 1 — Organisation Details
   ════════════════════════════════════════════════════════════════ */

function StepOne({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-semibold text-[20px] leading-[28px] text-foreground mb-1">
          Welcome — let&apos;s set up your organisation
        </h2>
        <p className="text-[14px] leading-[20px] text-muted-foreground">
          This information creates your tenant and cannot be changed after
          setup.
        </p>
      </div>

      {/* Organisation name */}
      <div>
        <label
          className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
          htmlFor="preview_org_name"
        >
          Organisation name
        </label>
        <input
          className={inputBase}
          id="preview_org_name"
          placeholder="e.g. Northbridge University"
          type="text"
          value={data.orgName}
          onChange={(e) =>
            update({
              orgName: e.target.value,
              tenantSlug: autoSlug(e.target.value),
            })
          }
        />
      </div>

      {/* Tenant slug */}
      <div>
        <label
          className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
          htmlFor="preview_slug"
        >
          Tenant slug
        </label>
        <div className="flex border border-border rounded-md overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <span className="text-muted-foreground text-[14px] bg-muted px-3 py-2 border-r border-border shrink-0 flex items-center">
            xebia-platform.io/
          </span>
          <input
            className="flex-1 bg-background text-[16px] leading-[24px] text-foreground py-2 px-3 outline-none border-none"
            id="preview_slug"
            placeholder="your-org"
            type="text"
            value={data.tenantSlug}
            onChange={(e) => update({ tenantSlug: e.target.value })}
          />
        </div>
        <p className="text-[14px] leading-[20px] text-muted-foreground mt-1">
          Your unique organisation ID — used in API calls and cannot be changed
          after setup.
        </p>
      </div>

      {/* Plan tier */}
      <div>
        <label className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2">
          Plan tier
        </label>
        <div className="flex gap-3">
          {PLAN_TIERS.map((tier) => {
            const isSelected = data.planTier === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => update({ planTier: tier })}
                className={[
                  "flex-1 border-2 rounded-md p-3 cursor-pointer",
                  "text-center font-medium text-[14px] transition-all duration-150",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/40",
                ].join(" ")}
              >
                {tier}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary contact email */}
      <div>
        <label
          className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
          htmlFor="preview_contact_email"
        >
          Primary contact email
        </label>
        <input
          className={inputBase}
          id="preview_contact_email"
          placeholder="admin@northbridge.edu"
          type="email"
          value={data.contactEmail}
          onChange={(e) => update({ contactEmail: e.target.value })}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 2 — Branding
   ════════════════════════════════════════════════════════════════ */

function StepTwo({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      update({ logoPreviewUrl: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-semibold text-[20px] leading-[28px] text-foreground mb-1">
          Set up your organisation&apos;s branding
        </h2>
        <p className="text-[14px] leading-[20px] text-muted-foreground">
          Controls how the platform appears to your candidates.
        </p>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2">
          Logo
        </label>

        {data.logoPreviewUrl ? (
          <div className="flex items-center gap-4 border border-border rounded-md p-4">
            <Image
              src={data.logoPreviewUrl}
              alt="Logo preview"
              className="max-h-16 object-contain rounded"
            />
            <span className="flex-1 text-[14px] text-foreground font-medium truncate">
              Uploaded logo
            </span>
            <button
              type="button"
              onClick={() => update({ logoPreviewUrl: "" })}
              className="text-destructive hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-1"
              aria-label="Remove logo"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>
        ) : (
          <div
            className="border-dashed border-2 border-border rounded-md p-6 text-center cursor-pointer hover:bg-muted transition-colors"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                fileInputRef.current?.click();
            }}
          >
            <span className="material-symbols-outlined text-border text-4xl mb-2 block">
              upload
            </span>
            <p className="text-foreground font-medium text-[14px]">
              Drag &amp; drop your logo or click to browse
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">
              PNG, SVG — max 2 MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/svg+xml"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />
      </div>

      {/* Brand colour */}
      <div>
        <label className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2">
          Primary brand colour
        </label>
        <p className="text-[14px] leading-[20px] text-muted-foreground mb-2">
          Used for buttons and highlights on the candidate-facing portal.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={data.brandColor}
            onChange={(e) => update({ brandColor: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
            aria-label="Pick brand colour"
          />
          <input
            type="text"
            value={data.brandColor}
            onChange={(e) => {
              const v = e.target.value;
              update({ brandColor: v });
            }}
            className={`${inputBase} w-36`}
            placeholder="#6C1D5F"
            maxLength={7}
          />
        </div>
        {/* Live preview swatch */}
        <div
          className="w-full h-8 rounded border border-border mt-2"
          style={{ backgroundColor: data.brandColor }}
        />
        <p className="text-[12px] text-muted-foreground mt-1">Preview</p>
      </div>

      {/* Display name */}
      <div>
        <label
          className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
          htmlFor="preview_display_name"
        >
          Display name
        </label>
        <p className="text-[14px] leading-[20px] text-muted-foreground mb-2">
          Shown on the exam portal and in candidate emails.
        </p>
        <input
          className={inputBase}
          id="preview_display_name"
          placeholder="e.g. Acme University"
          type="text"
          value={data.displayName}
          onChange={(e) => update({ displayName: e.target.value })}
        />
      </div>

      {/* Tagline */}
      <div>
        <label
          className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
          htmlFor="preview_tagline"
        >
          Tagline (optional)
        </label>
        <input
          className={inputBase}
          id="preview_tagline"
          placeholder="e.g. Excellence in Assessment"
          type="text"
          maxLength={80}
          value={data.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
        />
        <div className="text-right text-muted-foreground text-[12px] mt-1">
          {data.tagline.length} / 80
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 3 — Timezone & Notifications
   ════════════════════════════════════════════════════════════════ */

function StepThree({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-semibold text-[20px] leading-[28px] text-foreground mb-1">
          Configure timezone and notifications
        </h2>
        <p className="text-[14px] leading-[20px] text-muted-foreground">
          These settings apply to all exams unless overridden at the exam level.
        </p>
      </div>

      {/* Timezone */}
      <div>
        <label
          className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
          htmlFor="preview_timezone"
        >
          Organisation timezone
        </label>
        <select
          className={`${inputBase} cursor-pointer`}
          id="preview_timezone"
          value={data.timezone}
          onChange={(e) => update({ timezone: e.target.value })}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* Date format */}
      <div>
        <label className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2">
          Date display format
        </label>
        <div className="flex flex-col gap-2">
          {DATE_FORMATS.map((fmt) => {
            const isSelected = data.dateFormat === fmt;
            return (
              <button
                key={fmt}
                type="button"
                onClick={() => update({ dateFormat: fmt })}
                className={[
                  "flex items-center gap-3 p-3 border rounded-md",
                  "cursor-pointer hover:bg-muted transition-colors duration-200",
                  "text-left w-full bg-transparent outline-none",
                  isSelected ? "border-primary" : "border-border",
                ].join(" ")}
              >
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
          htmlFor="preview_notif_email"
        >
          Notification sender address
        </label>
        <p className="text-[14px] leading-[20px] text-muted-foreground mb-2">
          System emails will be sent from this address.
        </p>
        <input
          className={inputBase}
          id="preview_notif_email"
          placeholder="exams@yourdomain.com"
          type="email"
          value={data.notifEmail}
          onChange={(e) => update({ notifEmail: e.target.value })}
        />
      </div>

      {/* Default instructions */}
      <div>
        <label
          className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
          htmlFor="preview_instructions"
        >
          Default candidate instructions
        </label>
        <p className="text-[14px] leading-[20px] text-muted-foreground mb-2">
          Pre-filled on every new exam. Creators can override per exam.
        </p>
        <textarea
          className={`${inputBase} resize-none h-24`}
          id="preview_instructions"
          placeholder="e.g. Ensure you have a stable internet connection and a working webcam before starting."
          value={data.defaultInstructions}
          onChange={(e) => update({ defaultInstructions: e.target.value })}
        />
      </div>

      {/* Notification toggles */}
      <div>
        <label className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2">
          Email notifications
        </label>
        <div className="border border-border rounded-md">
          {/* Exam reminders */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-border">
            <div>
              <p className="text-[14px] leading-[20px] text-foreground font-medium">
                Exam reminders
              </p>
              <p className="text-[14px] leading-[20px] text-muted-foreground">
                Notify candidates 24 hours before their exam
              </p>
            </div>
            <Toggle
              on={data.remindersOn}
              onToggle={() => update({ remindersOn: !data.remindersOn })}
            />
          </div>
          {/* Result notifications */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-border">
            <div>
              <p className="text-[14px] leading-[20px] text-foreground font-medium">
                Result notifications
              </p>
              <p className="text-[14px] leading-[20px] text-muted-foreground">
                Notify candidates when results are published
              </p>
            </div>
            <Toggle
              on={data.resultsOn}
              onToggle={() => update({ resultsOn: !data.resultsOn })}
            />
          </div>
          {/* Evaluator assignments */}
          <div className="flex items-center justify-between py-3 px-4">
            <div>
              <p className="text-[14px] leading-[20px] text-foreground font-medium">
                Evaluator assignments
              </p>
              <p className="text-[14px] leading-[20px] text-muted-foreground">
                Notify evaluators when sheets are assigned
              </p>
            </div>
            <Toggle
              on={data.assignmentsOn}
              onToggle={() => update({ assignmentsOn: !data.assignmentsOn })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 4 — Invite Users
   ════════════════════════════════════════════════════════════════ */

function StepFour({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-semibold text-[20px] leading-[28px] text-foreground mb-1">
          Invite your team
        </h2>
        <p className="text-[14px] leading-[20px] text-muted-foreground">
          Add users to your organisation. You can always invite more later.
        </p>
      </div>

      {/* Invite rows */}
      <div>
        {/* Column labels */}
        <div className="hidden sm:flex gap-2 text-[12px] leading-[16px] font-semibold text-muted-foreground mb-2">
          <span className="flex-1">Full name</span>
          <span className="flex-1">Email address</span>
          <span className="w-44">Role</span>
          <span className="w-9" />
        </div>

        {data.invites.map((invite) => (
          <div key={invite.id} className="flex flex-col sm:flex-row gap-2 items-center mb-3">
            <input
              className={`${inputBase} flex-1`}
              placeholder="Full name"
              type="text"
              value={invite.name}
              onChange={(e) =>
                update({
                  invites: data.invites.map((r) =>
                    r.id === invite.id ? { ...r, name: e.target.value } : r
                  ),
                })
              }
            />
            <input
              className={`${inputBase} flex-1`}
              placeholder="Email address"
              type="email"
              value={invite.email}
              onChange={(e) =>
                update({
                  invites: data.invites.map((r) =>
                    r.id === invite.id ? { ...r, email: e.target.value } : r
                  ),
                })
              }
            />
            <select
              className={`${inputBase} w-full sm:w-44 cursor-pointer`}
              value={invite.role}
              onChange={(e) =>
                update({
                  invites: data.invites.map((r) =>
                    r.id === invite.id ? { ...r, role: e.target.value } : r
                  ),
                })
              }
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                update({
                  invites: data.invites.filter((r) => r.id !== invite.id),
                })
              }
              className={[
                "text-destructive hover:opacity-80 transition-colors cursor-pointer",
                "bg-transparent border-none p-1 shrink-0",
                data.invites.length === 1 ? "invisible" : "",
              ].join(" ")}
              aria-label="Remove invite"
            >
              <span className="material-symbols-outlined text-[20px]">
                delete
              </span>
            </button>
          </div>
        ))}

        {data.invites.length < 10 ? (
          <button
            type="button"
            className={`${btnSecondary} flex items-center gap-2 mt-1`}
            onClick={() =>
              update({
                invites: [
                  ...data.invites,
                  {
                    id: Date.now(),
                    name: "",
                    email: "",
                    role: "Exam Creator",
                  },
                ],
              })
            }
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add another person
          </button>
        ) : (
          <p className="text-muted-foreground text-[14px] leading-[20px] mt-1">
            Maximum of 10 invites at once. Add more after setup.
          </p>
        )}
      </div>

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-300 rounded-md p-3 flex gap-2 items-start mt-2">
        <span className="material-symbols-outlined text-amber-600 text-[20px] mt-px shrink-0">
          info
        </span>
        <p className="text-[14px] leading-[20px] text-foreground">
          Invitations will be sent by email once you complete setup. Invited
          users will be prompted to set their password on first login.
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 5 — Review & Confirm
   ════════════════════════════════════════════════════════════════ */

function StepFive({
  data,
  setupComplete,
  goToStep,
}: {
  data: WizardData;
  setupComplete: boolean;
  goToStep: (n: number) => void;
}) {
  /* ── Success screen ──────────────────────────────────────── */
  if (setupComplete) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="material-symbols-outlined text-green-700 text-5xl">
          check_circle
        </span>
        <h2 className="text-[24px] leading-[32px] font-bold text-foreground">
          Organisation created!
        </h2>
        <p className="text-muted-foreground text-[14px] leading-[20px]">
          Invite emails have been queued. Redirecting to your dashboard…
        </p>
        <div className="text-muted-foreground text-[14px] font-mono bg-muted border border-border rounded px-4 py-2">
          tenant: {data.tenantSlug || "your-org"}
        </div>
      </div>
    );
  }

  /* ── Review cards ────────────────────────────────────────── */

  const filledInvites = data.invites.filter((i) => i.name || i.email);

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-4">
        <h2 className="font-semibold text-[20px] leading-[28px] text-foreground mb-1">
          Review your setup
        </h2>
        <p className="text-[14px] leading-[20px] text-muted-foreground">
          Everything looks good? Complete setup to create your organisation.
        </p>
      </div>

      {/* Card 1 — Org Details */}
      <ReviewCard title="Organisation Details" stepNum={1} goToStep={goToStep}>
        <ReviewRow label="Organisation name" value={data.orgName || "—"} />
        <ReviewRow
          label="Tenant slug"
          value={
            <span className="font-mono text-[12px] bg-muted px-2 py-0.5 rounded border border-border">
              {data.tenantSlug || "—"}
            </span>
          }
        />
        <ReviewRow
          label="Plan tier"
          value={
            <span className="bg-muted text-foreground rounded-full px-3 py-1 text-[12px] font-medium">
              {data.planTier}
            </span>
          }
        />
        <ReviewRow label="Contact email" value={data.contactEmail || "—"} />
      </ReviewCard>

      {/* Card 2 — Branding */}
      <ReviewCard title="Branding" stepNum={2} goToStep={goToStep}>
        <ReviewRow
          label="Logo"
          value={
            data.logoPreviewUrl ? (
              <Image
                src={data.logoPreviewUrl}
                alt="Logo"
                className="h-8 rounded"
              />
            ) : (
              <span className="text-muted-foreground text-[12px]">No logo uploaded</span>
            )
          }
        />
        <ReviewRow
          label="Brand colour"
          value={
            <span className="flex items-center gap-2 justify-end">
              <span
                className="w-4 h-4 rounded-full border border-border inline-block"
                style={{ backgroundColor: data.brandColor }}
              />
              <span className="font-mono text-[12px]">{data.brandColor}</span>
            </span>
          }
        />
        <ReviewRow label="Display name" value={data.displayName || "—"} />
        <ReviewRow label="Tagline" value={data.tagline || "—"} />
      </ReviewCard>

      {/* Card 3 — Timezone & Notifications */}
      <ReviewCard
        title="Timezone & Notifications"
        stepNum={3}
        goToStep={goToStep}
      >
        <ReviewRow label="Timezone" value={data.timezone} />
        <ReviewRow label="Date format" value={data.dateFormat} />
        <ReviewRow label="Notification email" value={data.notifEmail || "—"} />
        <ReviewRow
          label="Active notifications"
          value={
            <div className="flex gap-1 flex-wrap justify-end">
              {data.remindersOn && (
                <span className="bg-green-50 text-green-700 text-[12px] px-2 py-0.5 rounded-full border border-green-200">
                  Exam reminders
                </span>
              )}
              {data.resultsOn && (
                <span className="bg-green-50 text-green-700 text-[12px] px-2 py-0.5 rounded-full border border-green-200">
                  Result notifications
                </span>
              )}
              {data.assignmentsOn && (
                <span className="bg-green-50 text-green-700 text-[12px] px-2 py-0.5 rounded-full border border-green-200">
                  Evaluator assignments
                </span>
              )}
              {!data.remindersOn &&
                !data.resultsOn &&
                !data.assignmentsOn && (
                  <span className="text-muted-foreground text-[12px]">None enabled</span>
                )}
            </div>
          }
        />
      </ReviewCard>

      {/* Card 4 — Invited Users */}
      <ReviewCard title="Invited Users" stepNum={4} goToStep={goToStep}>
        {filledInvites.length === 0 ? (
          <p className="text-muted-foreground text-[14px]">
            No users invited — you can add them after setup.
          </p>
        ) : (
          <>
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left text-muted-foreground font-medium py-2 px-3 rounded-tl">
                    Name
                  </th>
                  <th className="text-left text-muted-foreground font-medium py-2 px-3">
                    Email
                  </th>
                  <th className="text-left text-muted-foreground font-medium py-2 px-3 rounded-tr">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {filledInvites.slice(0, 5).map((i) => (
                  <tr
                    key={i.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-2 px-3 text-foreground">
                      {i.name || "—"}
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{i.email || "—"}</td>
                    <td className="py-2 px-3">
                      <span className="bg-muted text-foreground text-[12px] px-2 py-0.5 rounded-full">
                        {i.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filledInvites.length > 5 && (
              <p className="text-muted-foreground text-[12px] mt-2">
                + {filledInvites.length - 5} more
              </p>
            )}
          </>
        )}
      </ReviewCard>

      {/* Setup checklist */}
      <div className="border border-border rounded-md p-4 mt-2">
        <p className="text-foreground font-semibold text-[14px] mb-3">
          Your organisation will be set up with:
        </p>
        {[
          `Tenant isolation enabled (slug: ${data.tenantSlug || "—"})`,
          `${data.invites.filter((i) => i.email).length} user(s) invited`,
          "Keycloak authentication configured",
          "Welcome emails queued for dispatch",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 py-1">
            <span className="material-symbols-outlined text-green-700 text-[18px]">
              check_circle
            </span>
            <span className="text-muted-foreground text-[14px]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PREVIEW PAGE
   ════════════════════════════════════════════════════════════════ */

export default function OnboardingPreviewPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [setupComplete, setSetupComplete] = useState(false);

  const [wizardData, setWizardData] = useState<WizardData>({
    // Step 1
    orgName: "",
    tenantSlug: "",
    planTier: "Professional",
    contactEmail: "",
    // Step 2
    logoPreviewUrl: "",
    brandColor: "#6C1D5F",
    displayName: "",
    tagline: "",
    // Step 3
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    notifEmail: "",
    defaultInstructions: "",
    remindersOn: true,
    resultsOn: true,
    assignmentsOn: false,
    // Step 4
    invites: [{ id: 1, name: "", email: "", role: "Exam Creator" }],
  });

  const update = (patch: Partial<WizardData>) =>
    setWizardData((prev) => ({ ...prev, ...patch }));

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const goToStep = (n: number) => {
    setSetupComplete(false);
    setCurrentStep(n);
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col text-foreground">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="bg-background border-b border-border px-8 py-4 flex items-center justify-between">
        <span className="text-primary font-bold text-[20px] leading-[28px] tracking-tight">
          Xebia Exam Platform
        </span>
        <span className="text-muted-foreground text-[14px]">Tenant Setup Wizard</span>
      </div>

      {/* ── Demo banner ─────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-300 px-8 py-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-600 text-[18px]">
          preview
        </span>
        <span className="text-[14px] text-amber-900">
          Preview mode — all steps in one page for testing. Data persists as you
          move between steps.
        </span>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          {/* Step jump pills */}
          <div className="flex gap-2 justify-center mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => goToStep(n)}
                className={[
                  "text-[12px] px-3 py-1 rounded-full border font-medium",
                  "transition-colors duration-150 cursor-pointer",
                  "outline-none",
                  currentStep === n
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary",
                ].join(" ")}
              >
                Step {n}
              </button>
            ))}
          </div>

          {/* Stepper */}
          <OnboardingStepper currentStep={currentStep} />

          {/* Active step card */}
          <div className="bg-background border border-border rounded-lg shadow-sm p-8">
            {currentStep === 1 && (
              <StepOne data={wizardData} update={update} />
            )}
            {currentStep === 2 && (
              <StepTwo data={wizardData} update={update} />
            )}
            {currentStep === 3 && (
              <StepThree data={wizardData} update={update} />
            )}
            {currentStep === 4 && (
              <StepFour data={wizardData} update={update} />
            )}
            {currentStep === 5 && (
              <StepFive
                data={wizardData}
                setupComplete={setupComplete}
                goToStep={goToStep}
              />
            )}
          </div>

          {/* Nav buttons */}
          {!setupComplete && (
            <div className="flex justify-between">
              <button
                type="button"
                className={`${btnSecondary} ${
                  currentStep === 1
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
                onClick={goBack}
                disabled={currentStep === 1}
              >
                ← Back
              </button>
              {currentStep < 5 ? (
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={goNext}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={() => {
                    setSetupComplete(true);
                    console.log(
                      "Onboarding complete — tenant:",
                      wizardData.tenantSlug
                    );
                  }}
                >
                  Complete setup →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
