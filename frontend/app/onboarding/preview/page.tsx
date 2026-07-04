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
import Image from "next/image";
import OnboardingStepper from "../OnboardingStepper";

/* ── Shared style constants ─────────────────────────────────────
   Every color / radius / spacing references the design-project
   tokens defined in globals.css. */

const inputBase = [
  "w-full bg-surface-container-lowest border border-outline-variant rounded-default",
  "text-body-md text-on-surface",
  "py-2 px-3 transition-all duration-200",
  "outline-none focus:border-primary focus:ring-2 focus:ring-primary/10",
].join(" ");

const btnPrimary = [
  "bg-primary text-on-primary rounded-default font-medium",
  "text-body-md tracking-[0.01em]",
  "px-4 py-2 hover:bg-primary/90 transition-colors duration-200",
  "border-none outline-none cursor-pointer",
  "flex items-center gap-2",
].join(" ");

const btnSecondary = [
  "bg-transparent text-on-surface border border-outline-variant rounded-default font-medium",
  "text-body-md tracking-[0.01em]",
  "px-6 py-2 hover:bg-surface-container-low transition-colors duration-200",
  "cursor-pointer outline-none",
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
        on ? "bg-primary" : "bg-outline",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 w-5 h-5 bg-surface-container-lowest rounded-full shadow-sm",
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
    <div className="flex justify-between items-start py-2 border-b border-outline-variant last:border-0">
      <span className="text-on-surface-variant text-body-md w-40 shrink-0">
        {label}
      </span>
      <span className="text-on-surface text-body-md text-right">
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
    <div className="bg-surface-container-lowest border border-outline-variant rounded-default p-5 mb-4 shadow-elevation-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading font-semibold text-body-lg text-on-surface">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => goToStep(stepNum)}
          className="text-primary text-label-sm hover:underline cursor-pointer bg-transparent border-none p-0 font-medium"
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
        <h2 className="font-heading font-semibold text-headline-md text-on-surface mb-1">
          Welcome — let&apos;s set up your organisation
        </h2>
        <p className="text-body-md text-on-surface-variant">
          This information creates your tenant and cannot be changed after
          setup.
        </p>
      </div>

      {/* Organisation name */}
      <div>
        <label
          className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2"
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
          className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2"
          htmlFor="preview_slug"
        >
          Tenant slug
        </label>
        <div className="flex border border-outline-variant rounded-default overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <span className="text-on-surface-variant text-body-md bg-surface-container-low px-3 py-2 border-r border-outline-variant shrink-0 flex items-center">
            xebia-platform.io/
          </span>
          <input
            className="flex-1 bg-surface-container-lowest text-body-md text-on-surface py-2 px-3 outline-none border-none"
            id="preview_slug"
            placeholder="your-org"
            type="text"
            value={data.tenantSlug}
            onChange={(e) => update({ tenantSlug: e.target.value })}
          />
        </div>
        <p className="text-label-sm text-on-surface-variant mt-1">
          Your unique organisation ID — used in API calls and cannot be changed
          after setup.
        </p>
      </div>

      {/* Plan tier */}
      <div>
        <label className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2">
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
                  "flex-1 border-2 rounded-default p-3 cursor-pointer",
                  "text-center font-medium text-body-md transition-all duration-150",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/40",
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
          className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2"
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
        <h2 className="font-heading font-semibold text-headline-md text-on-surface mb-1">
          Set up your organisation&apos;s branding
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Controls how the platform appears to your candidates.
        </p>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2">
          Logo
        </label>

        {data.logoPreviewUrl ? (
          <div className="flex items-center gap-4 border border-outline-variant bg-surface-container-low rounded-default p-4">
            <Image
              src={data.logoPreviewUrl}
              alt="Logo preview"
              width={128}
              height={64}
              className="max-h-16 object-contain rounded"
              unoptimized
            />
            <span className="flex-1 text-body-md text-on-surface font-medium truncate">
              Uploaded logo
            </span>
            <button
              type="button"
              onClick={() => update({ logoPreviewUrl: "" })}
              className="text-error hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-1"
              aria-label="Remove logo"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>
        ) : (
          <div
            className="border-dashed border-2 border-outline rounded-default p-6 text-center cursor-pointer hover:bg-surface-container-low transition-colors bg-surface-container-lowest"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                fileInputRef.current?.click();
            }}
          >
            <span className="material-symbols-outlined text-outline text-4xl mb-2 block">
              upload
            </span>
            <p className="text-on-surface font-medium text-body-md">
              Drag &amp; drop your logo or click to browse
            </p>
            <p className="text-label-sm text-on-surface-variant mt-1">
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
        <label className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2">
          Primary brand colour
        </label>
        <p className="text-body-md text-on-surface-variant mb-2">
          Used for buttons and highlights on the candidate-facing portal.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={data.brandColor}
            onChange={(e) => update({ brandColor: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer border-none p-0 bg-transparent"
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
            placeholder="#510047"
            maxLength={7}
          />
        </div>
        {/* Live preview swatch */}
        <div
          className="w-full h-8 rounded border border-outline-variant mt-2"
          style={{ backgroundColor: data.brandColor }}
        />
        <p className="text-label-sm text-on-surface-variant mt-1">Preview</p>
      </div>

      {/* Display name */}
      <div>
        <label
          className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2"
          htmlFor="preview_display_name"
        >
          Display name
        </label>
        <p className="text-body-md text-on-surface-variant mb-2">
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
          className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2"
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
        <div className="text-right text-on-surface-variant text-label-sm mt-1">
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
        <h2 className="font-heading font-semibold text-headline-md text-on-surface mb-1">
          Configure timezone and notifications
        </h2>
        <p className="text-body-md text-on-surface-variant">
          These settings apply to all exams unless overridden at the exam level.
        </p>
      </div>

      {/* Timezone */}
      <div>
        <label
          className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2"
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
        <label className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2">
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
                  "flex items-center gap-3 p-3 border rounded-default",
                  "cursor-pointer hover:bg-surface-container-low/50 transition-colors duration-200",
                  "text-left w-full bg-transparent outline-none",
                  isSelected ? "border-primary bg-surface-container-low" : "border-outline-variant",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                    isSelected ? "border-primary" : "border-outline-variant",
                  ].join(" ")}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </span>
                <span className="text-on-surface text-body-md">
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
          className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2"
          htmlFor="preview_notif_email"
        >
          Notification sender address
        </label>
        <p className="text-body-md text-on-surface-variant mb-2">
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
          className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2"
          htmlFor="preview_instructions"
        >
          Default candidate instructions
        </label>
        <p className="text-body-md text-on-surface-variant mb-2">
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
        <label className="block font-medium text-label-sm tracking-[0.01em] text-on-surface-variant mb-2">
          Email notifications
        </label>
        <div className="border border-outline-variant rounded-default divide-y divide-outline-variant bg-surface-container-lowest">
          {/* Exam reminders */}
          <div className="flex items-center justify-between py-3 px-4">
            <div>
              <p className="text-body-md text-on-surface font-medium">
                Exam reminders
              </p>
              <p className="text-label-sm text-on-surface-variant">
                Notify candidates 24 hours before their exam
              </p>
            </div>
            <Toggle
              on={data.remindersOn}
              onToggle={() => update({ remindersOn: !data.remindersOn })}
            />
          </div>
          {/* Result notifications */}
          <div className="flex items-center justify-between py-3 px-4">
            <div>
              <p className="text-body-md text-on-surface font-medium">
                Result notifications
              </p>
              <p className="text-label-sm text-on-surface-variant">
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
              <p className="text-body-md text-on-surface font-medium">
                Evaluator assignments
              </p>
              <p className="text-label-sm text-on-surface-variant">
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
        <h2 className="font-heading font-semibold text-headline-md text-on-surface mb-1">
          Invite your team
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Add users to your organisation. You can always invite more later.
        </p>
      </div>

      {/* Invite rows */}
      <div>
        {/* Column labels */}
        <div className="hidden sm:flex gap-2 text-label-sm font-semibold text-on-surface-variant mb-2">
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
                "text-error hover:opacity-80 transition-colors cursor-pointer",
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
          <p className="text-on-surface-variant text-body-md mt-1">
            Maximum of 10 invites at once. Add more after setup.
          </p>
        )}
      </div>

      {/* Info box */}
      <div className="border border-dashed border-tertiary bg-tertiary-container/10 rounded-default p-3 flex gap-2 items-start mt-2">
        <span className="material-symbols-outlined text-tertiary text-[20px] mt-px shrink-0">
          info
        </span>
        <p className="text-body-md text-tertiary">
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
      <div className="flex flex-col items-center gap-4 py-8 text-center bg-surface-container-lowest">
        <span className="material-symbols-outlined text-success text-5xl animate-none">
          check_circle
        </span>
        <h2 className="font-heading font-semibold text-headline-md text-on-surface">
          Organisation created!
        </h2>
        <p className="text-on-surface-variant text-body-md">
          Invite emails have been queued. Redirecting to your dashboard…
        </p>
        <div className="text-on-surface-variant text-label-sm font-mono bg-surface-container-low border border-outline-variant rounded-default px-4 py-2">
          tenant: {data.tenantSlug || "your-org"}
        </div>
      </div>
    );
  }

  /* ── Review cards ────────────────────────────────────────── */

  const filledInvites = data.invites.filter((i) => i.name || i.email);

  return (
    <div className="flex flex-col gap-2 bg-surface-container-lowest">
      <div className="mb-4">
        <h2 className="font-heading font-semibold text-headline-md text-on-surface mb-1">
          Review your setup
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Everything looks good? Complete setup to create your organisation.
        </p>
      </div>

      {/* Card 1 — Org Details */}
      <ReviewCard title="Organisation Details" stepNum={1} goToStep={goToStep}>
        <ReviewRow label="Organisation name" value={data.orgName || "—"} />
        <ReviewRow
          label="Tenant slug"
          value={
            <span className="font-mono text-label-sm bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant">
              {data.tenantSlug || "—"}
            </span>
          }
        />
        <ReviewRow
          label="Plan tier"
          value={
            <span className="bg-surface-container-low text-on-surface rounded-full px-3 py-1 text-label-sm font-medium">
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
                width={64}
                height={32}
                className="h-8 rounded object-contain"
                unoptimized
              />
            ) : (
              <span className="text-on-surface-variant text-label-sm">No logo uploaded</span>
            )
          }
        />
        <ReviewRow
          label="Brand colour"
          value={
            <span className="flex items-center gap-2 justify-end">
              <span
                className="w-4 h-4 rounded-full border border-outline-variant inline-block"
                style={{ backgroundColor: data.brandColor }}
              />
              <span className="font-mono text-label-sm">{data.brandColor}</span>
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
                <span className="bg-success/10 text-success text-label-sm px-2 py-0.5 rounded-full border border-success/20 font-medium">
                  Exam reminders
                </span>
              )}
              {data.resultsOn && (
                <span className="bg-success/10 text-success text-label-sm px-2 py-0.5 rounded-full border border-success/20 font-medium">
                  Result notifications
                </span>
              )}
              {data.assignmentsOn && (
                <span className="bg-success/10 text-success text-label-sm px-2 py-0.5 rounded-full border border-success/20 font-medium">
                  Evaluator assignments
                </span>
              )}
              {!data.remindersOn &&
                !data.resultsOn &&
                !data.assignmentsOn && (
                  <span className="text-on-surface-variant text-label-sm">None enabled</span>
                )}
            </div>
          }
        />
      </ReviewCard>

      {/* Card 4 — Invited Users */}
      <ReviewCard title="Invited Users" stepNum={4} goToStep={goToStep}>
        {filledInvites.length === 0 ? (
          <p className="text-on-surface-variant text-body-md">
            No users invited — you can add them after setup.
          </p>
        ) : (
          <>
            <table className="w-full text-body-md text-left">
              <thead>
                <tr className="bg-surface-container-low text-label-sm font-semibold text-on-surface-variant">
                  <th className="py-2 px-3 rounded-tl font-semibold">
                    Name
                  </th>
                  <th className="py-2 px-3 font-semibold">
                    Email
                  </th>
                  <th className="py-2 px-3 rounded-tr font-semibold">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {filledInvites.slice(0, 5).map((i) => (
                  <tr
                    key={i.id}
                    className="border-b border-outline-variant last:border-0"
                  >
                    <td className="py-2 px-3 text-on-surface">
                      {i.name || "—"}
                    </td>
                    <td className="py-2 px-3 text-on-surface-variant">{i.email || "—"}</td>
                    <td className="py-2 px-3">
                      <span className="bg-surface-container-low text-on-surface text-label-sm px-2 py-0.5 rounded-full font-medium">
                        {i.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filledInvites.length > 5 && (
              <p className="text-on-surface-variant text-label-sm mt-2">
                + {filledInvites.length - 5} more
              </p>
            )}
          </>
        )}
      </ReviewCard>

      {/* Setup checklist */}
      <div className="bg-surface-container-low border border-outline-variant rounded-default p-4 mt-2">
        <p className="text-on-surface font-semibold text-body-md mb-3">
          Your organisation will be set up with:
        </p>
        {[
          `Tenant isolation enabled (slug: ${data.tenantSlug || "—"})`,
          `${data.invites.filter((i) => i.email).length} user(s) invited`,
          "Keycloak authentication configured",
          "Welcome emails queued for dispatch",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 py-1">
            <span className="material-symbols-outlined text-success text-[20px]">
              check_circle
            </span>
            <span className="text-on-surface text-body-md">{item}</span>
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
    brandColor: "#510047",
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
    <div className="min-h-screen bg-background flex flex-col text-on-background">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest border-b border-outline-variant px-8 py-4 flex items-center justify-between">
        <span className="text-primary font-heading font-bold text-headline-md tracking-tight">
          Xebia Exam Platform
        </span>
        <span className="text-on-surface-variant text-label-sm">Tenant Setup Wizard</span>
      </div>

      {/* ── Demo banner ─────────────────────────────────────── */}
      <div className="bg-tertiary-container/10 border-b border-tertiary px-8 py-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-tertiary text-[18px]">
          preview
        </span>
        <span className="text-body-md text-tertiary">
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
                  "text-label-sm px-3 py-1 rounded-full border font-medium",
                  "transition-colors duration-150 cursor-pointer",
                  "outline-none",
                  currentStep === n
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary",
                ].join(" ")}
              >
                Step {n}
              </button>
            ))}
          </div>

          {/* Stepper */}
          <OnboardingStepper currentStep={currentStep} />

          {/* Active step card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-default shadow-elevation-1 p-8">
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
