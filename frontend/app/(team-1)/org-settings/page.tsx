/**
 * Organisation Settings — Tenant Admin control panel
 * Route: /org-settings
 * BRD: §4.1.1, §7.1, BR-10 — Post-onboarding settings management
 *
 * Six-tab settings page that mirrors and extends the onboarding
 * wizard. Pre-populates from localStorage (xebia_wizard_data)
 * written by step-5. All editable tabs include an audit-log note.
 */

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import AppNavbar from "@/components/AppNavbar";
import BottomNav from "@/components/BottomNav";

/* ── Shared style constants ─────────────────────────────────────
   Every color / radius / spacing references the design-project
   tokens defined in globals.css. */

const inputBase = [
  "w-full bg-card border border-[#d5c1cc] rounded-md",
  "text-sm text-foreground",
  "py-2 px-3 transition-all duration-200",
  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:outline-none",
].join(" ");

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

/* ── Tab definitions ────────────────────────────────────────── */

const TABS = [
  { id: "branding", label: "Branding", icon: "palette" },
  { id: "timezone", label: "Timezone & locale", icon: "schedule" },
  { id: "notifications", label: "Notifications", icon: "notifications" },
  { id: "smtp", label: "SMTP relay", icon: "mail" },
  { id: "plan", label: "Plan & usage", icon: "bar_chart" },
  { id: "audit", label: "Audit log", icon: "history" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ── Timezone options with UTC offsets ──────────────────────── */

const TIMEZONES = [
  { value: "UTC", label: "UTC (UTC+00:00)" },
  { value: "Europe/London", label: "Europe/London (UTC+00:00)" },
  { value: "Europe/Paris", label: "Europe/Paris (UTC+01:00)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (UTC+01:00)" },
  { value: "Europe/Moscow", label: "Europe/Moscow (UTC+03:00)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (UTC+04:00)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (UTC+05:30)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (UTC+08:00)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (UTC+09:00)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (UTC+10:00)" },
  { value: "America/New_York", label: "America/New_York (UTC−05:00)" },
  { value: "America/Chicago", label: "America/Chicago (UTC−06:00)" },
  { value: "America/Denver", label: "America/Denver (UTC−07:00)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (UTC−08:00)" },
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo (UTC−03:00)" },
  { value: "Pacific/Auckland", label: "Pacific/Auckland (UTC+12:00)" },
] as const;

const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] as const;
type DateFormat = (typeof DATE_FORMATS)[number];

/* ── Audit log static data ──────────────────────────────────── */

const AUDIT_ROWS = [
  { ts: "2026-07-04 06:22:18", actor: "admin@acme.edu", action: "settings.updated", entity: "branding.accent_colour", ip: "49.36.128.12" },
  { ts: "2026-07-04 06:21:55", actor: "admin@acme.edu", action: "settings.updated", entity: "notifications.reminders", ip: "49.36.128.12" },
  { ts: "2026-07-04 06:21:30", actor: "admin@acme.edu", action: "settings.updated", entity: "timezone (Asia/Kolkata)", ip: "49.36.128.12" },
  { ts: "2026-07-04 06:20:48", actor: "admin@acme.edu", action: "user.invited", entity: "lena@acme.edu (Candidate)", ip: "49.36.128.12" },
  { ts: "2026-07-04 06:20:32", actor: "admin@acme.edu", action: "user.invited", entity: "arjun@acme.edu (Proctor)", ip: "49.36.128.12" },
  { ts: "2026-07-04 06:20:18", actor: "admin@acme.edu", action: "user.invited", entity: "priya@acme.edu (Exam Creator)", ip: "49.36.128.12" },
  { ts: "2026-07-04 06:19:50", actor: "admin@acme.edu", action: "organisation.created", entity: "acme-university", ip: "49.36.128.12" },
  { ts: "2026-07-04 06:19:50", actor: "system", action: "tenant.provisioned", entity: "acme-university", ip: "—" },
  { ts: "2026-07-04 06:18:12", actor: "admin@acme.edu", action: "password.set", entity: "first-login", ip: "49.36.128.12" },
  { ts: "2026-07-04 06:17:45", actor: "admin@acme.edu", action: "auth.login", entity: "initial-login", ip: "49.36.128.12" },
];

/* ── Toggle sub-component ───────────────────────────────────── */

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
        <p className="text-sm text-foreground font-medium">
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
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

/* ── Audit log note (shown on every editable tab) ───────────── */

function AuditNote() {
  return (
    <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5 font-sans">
      <span className="material-symbols-outlined text-[14px]">history</span>
      Every change made here is recorded in the audit log.
    </p>
  );
}

/* ── Wizard data shape ──────────────────────────────────────── */

interface WizardData {
  orgName?: string;
  slug?: string;
  planTier?: string;
  primaryContact?: string;
  brandColor?: string;
  displayName?: string;
  tagline?: string;
  timezone?: string;
  dateFormat?: string;
  notifEmail?: string;
  defaultInstructions?: string;
  remindersOn?: boolean;
  resultsOn?: boolean;
  assignmentsOn?: boolean;
}

/* ── Read wizard data from localStorage (once) ─────────────── */

function getWizardData(): WizardData {
  try {
    const raw = localStorage.getItem("xebia_wizard_data");
    if (!raw) return {};
    return JSON.parse(raw) as WizardData;
  } catch {
    return {};
  }
}

/* ── Page component ─────────────────────────────────────────── */

export default function OrgSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("branding");

  /* Read wizard data once via lazy initialiser stored in a ref-like pattern */
  const [wizardSnapshot] = useState<WizardData>(getWizardData);

  /* ── Branding state ──────────────────────────────────────── */
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState(() => wizardSnapshot.brandColor ?? "#510047");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Timezone & locale state ─────────────────────────────── */
  const [timezone, setTimezone] = useState(() => wizardSnapshot.timezone ?? "Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState<DateFormat>(() => (wizardSnapshot.dateFormat as DateFormat) ?? "DD/MM/YYYY");

  /* ── Notifications state ─────────────────────────────────── */
  const [notifEmail, setNotifEmail] = useState(() => wizardSnapshot.notifEmail ?? "exams@acme.edu");
  const [defaultInstructions, setDefaultInstructions] = useState(() => wizardSnapshot.defaultInstructions ?? "");
  const [remindersOn, setRemindersOn] = useState(() => wizardSnapshot.remindersOn ?? true);
  const [resultsOn, setResultsOn] = useState(() => wizardSnapshot.resultsOn ?? true);
  const [assignmentsOn, setAssignmentsOn] = useState(() => wizardSnapshot.assignmentsOn ?? false);

  /* ── SMTP state ──────────────────────────────────────────── */
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [smtpEncryption, setSmtpEncryption] = useState<"TLS" | "SSL" | "None">("TLS");

  /* ── Org header state ────────────────────────────────────── */
  const tenantSlug = wizardSnapshot.slug ?? "acme-university";

  /* ── Logo helpers ────────────────────────────────────────── */
  function handleFileSelect(file: File | undefined) {
    if (!file) return;
    setLogoFileName(file.name);
    const url = URL.createObjectURL(file);
    setLogoPreviewUrl(url);
  }

  function removeLogo() {
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogoPreviewUrl(null);
    setLogoFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* ── Save / Cancel helpers (logging for demo) ────────────── */
  function handleSave() {
    console.log(`[org-settings] Saved tab: ${activeTab}`);
  }

  function handleCancel() {
    console.log(`[org-settings] Cancelled tab: ${activeTab}`);
  }

  /* ── Save/Cancel button row ──────────────────────────────── */
  function ActionRow() {
    return (
      <>
        <div className="flex justify-end gap-3 pt-6 border-t border-[#d5c1cc] mt-4">
          <button type="button" className={btnSecondary} onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className={btnPrimary} onClick={handleSave}>
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save changes
          </button>
        </div>
        <AuditNote />
      </>
    );
  }

  /* ── TAB CONTENT RENDERERS ───────────────────────────────── */

  function renderBranding() {
    return (
      <div className="flex flex-col gap-6">
        {/* BRD constraint note */}
        <div className="border border-[#d5c1cc] bg-muted rounded-md p-4 flex gap-3 items-start">
          <span className="material-symbols-outlined text-muted-foreground text-[20px] mt-px">info</span>
          <div>
            <p className="text-sm text-foreground font-semibold mb-1">
              Branding scope (BRD §7.1)
            </p>
            <p className="text-sm text-muted-foreground">
              Only the <strong>organisation logo</strong> and <strong>primary accent colour</strong> are
              tenant-configurable. Full white-labelling is not available at launch — the
              platform shell remains Xebia-branded.
            </p>
          </div>
        </div>

        {/* Logo upload */}
        <div>
          <label className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2">
            Organisation logo
          </label>

          {logoPreviewUrl ? (
            <div className="flex items-center gap-4 border border-[#d5c1cc] bg-card rounded-md p-4 shadow-sm">
              <Image
                src={logoPreviewUrl}
                alt="Logo preview"
                width={128}
                height={64}
                className="max-h-16 object-contain rounded"
                unoptimized
              />
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium truncate">
                  {logoFileName}
                </p>
              </div>
              <button
                type="button"
                onClick={removeLogo}
                className="text-destructive hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-1"
                aria-label="Remove logo"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          ) : (
            <div
              className="border-dashed border-2 border-[#d5c1cc] rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
              }}
            >
              <span className="material-symbols-outlined text-muted-foreground text-4xl mb-2">upload</span>
              <p className="text-foreground font-medium text-sm">Click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG / SVG — never stretched or recoloured
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.svg,image/png,image/svg+xml"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
        </div>

        {/* Primary accent colour */}
        <div>
          <label className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2">
            Primary accent colour
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-none p-0 bg-transparent"
              aria-label="Pick accent colour"
            />
            <input
              type="text"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className={`${inputBase} max-w-[140px] font-mono`}
              placeholder="#510047"
              maxLength={7}
            />
          </div>
          {/* Colour preview bar */}
          <div
            className="w-full h-8 rounded-md mt-3 border border-[#d5c1cc]"
            style={{ backgroundColor: brandColor }}
          />
        </div>

        <ActionRow />
      </div>
    );
  }

  function renderTimezone() {
    return (
      <div className="flex flex-col gap-6">
        {/* Timezone selector */}
        <div>
          <label
            className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
            htmlFor="tz_select"
          >
            Organisation timezone
          </label>
          <select
            className="form-select cursor-pointer"
            id="tz_select"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            All times are stored in UTC and displayed to candidates in their local
            timezone (BRD §4.3.2).
          </p>
        </div>

        {/* Date format radio group */}
        <div>
          <label className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2">
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
                    "flex items-center gap-3 px-3 py-2 rounded-md",
                    "transition-colors duration-200 cursor-pointer",
                    "border-none bg-transparent outline-none text-left w-full",
                    isSelected ? "bg-muted" : "hover:bg-muted/50",
                  ].join(" ")}
                >
                  {/* Radio circle */}
                  <span
                    className={[
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                      isSelected ? "border-primary" : "border-[#d5c1cc]",
                    ].join(" ")}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </span>
                  <span className="text-foreground text-sm font-sans">{fmt}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ActionRow />
      </div>
    );
  }

  function renderNotifications() {
    return (
      <div className="flex flex-col gap-6">
        {/* Notification sender email */}
        <div>
          <label
            className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
            htmlFor="notif_sender"
          >
            Notification sender email
          </label>
          <p className="text-sm text-muted-foreground mb-2">
            System emails (exam invites, results, certificates) are sent from this address.
          </p>
          <input
            className={inputBase}
            id="notif_sender"
            type="email"
            placeholder="exams@yourdomain.com"
            value={notifEmail}
            onChange={(e) => setNotifEmail(e.target.value)}
          />
        </div>

        {/* Default candidate instructions */}
        <div>
          <label
            className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
            htmlFor="default_instructions"
          >
            Default candidate instructions
          </label>
          <p className="text-sm text-muted-foreground mb-2">
            This text pre-fills on every new exam. Exam Creators can override it per exam.
          </p>
          <textarea
            className="form-textarea resize-none h-24"
            id="default_instructions"
            placeholder="e.g. Ensure you have a stable internet connection and a working webcam before starting."
            value={defaultInstructions}
            onChange={(e) => setDefaultInstructions(e.target.value)}
          />
        </div>

        {/* Toggle rows */}
        <div>
          <label className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2">
            Email notifications
          </label>
          <div className="border border-[#d5c1cc] rounded-md divide-y divide-[#d5c1cc] bg-card shadow-sm">
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

        <ActionRow />
      </div>
    );
  }

  function renderSmtp() {
    return (
      <div className="flex flex-col gap-6">
        {/* Warning box */}
        <div className="border border-dashed border-warning bg-warning/10 rounded-md p-4 flex gap-3 items-start">
          <span className="material-symbols-outlined text-warning text-[20px] mt-px">info</span>
          <div>
            <p className="text-sm font-semibold text-warning mb-1">
              Should-Have feature (BRD)
            </p>
            <p className="text-sm text-warning">
              The platform sends emails from Xebia&apos;s default address until a custom
              SMTP relay is configured here.
            </p>
          </div>
        </div>

        {/* SMTP host */}
        <div>
          <label
            className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
            htmlFor="smtp_host"
          >
            SMTP host
          </label>
          <input
            className={inputBase}
            id="smtp_host"
            type="text"
            placeholder="smtp.yourdomain.com"
            value={smtpHost}
            onChange={(e) => setSmtpHost(e.target.value)}
          />
        </div>

        {/* SMTP port */}
        <div>
          <label
            className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
            htmlFor="smtp_port"
          >
            SMTP port
          </label>
          <input
            className={`${inputBase} max-w-[140px] font-mono`}
            id="smtp_port"
            type="text"
            placeholder="587"
            value={smtpPort}
            onChange={(e) => setSmtpPort(e.target.value)}
          />
        </div>

        {/* Username */}
        <div>
          <label
            className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
            htmlFor="smtp_user"
          >
            Username
          </label>
          <input
            className={inputBase}
            id="smtp_user"
            type="text"
            placeholder="user@yourdomain.com"
            value={smtpUser}
            onChange={(e) => setSmtpUser(e.target.value)}
          />
        </div>

        {/* Password with show/hide */}
        <div>
          <label
            className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
            htmlFor="smtp_pass"
          >
            Password
          </label>
          <div className="relative">
            <input
              className={`${inputBase} pr-10`}
              id="smtp_pass"
              type={showSmtpPass ? "text" : "password"}
              placeholder="••••••••"
              value={smtpPass}
              onChange={(e) => setSmtpPass(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowSmtpPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0"
              aria-label={showSmtpPass ? "Hide password" : "Show password"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showSmtpPass ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Encryption selector */}
        <div>
          <label className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2">
            Encryption
          </label>
          <div className="flex gap-2">
            {(["TLS", "SSL", "None"] as const).map((enc) => {
              const isSelected = smtpEncryption === enc;
              return (
                <button
                  key={enc}
                  type="button"
                  onClick={() => setSmtpEncryption(enc)}
                  className={[
                    "flex-1 border py-2 px-3 text-center rounded-md",
                    "font-medium text-sm tracking-[0.01em]",
                    "transition-colors duration-200 cursor-pointer outline-none",
                    isSelected
                      ? "bg-muted text-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-[#d5c1cc] hover:bg-muted",
                  ].join(" ")}
                >
                  {enc}
                </button>
              );
            })}
          </div>
        </div>

        {/* Test connection */}
        <button
          type="button"
          className={`${btnSecondary} w-full flex items-center justify-center gap-2`}
          onClick={() => console.log("[smtp] Test connection clicked", { smtpHost, smtpPort, smtpUser, smtpEncryption })}
        >
          <span className="material-symbols-outlined text-[18px]">cable</span>
          Test connection
        </button>

        <ActionRow />
      </div>
    );
  }

  function renderPlan() {
    const meters = [
      { label: "Concurrent users", used: 47, limit: 500, unit: "" },
      { label: "Exams this month", used: 12, limit: 100, unit: "" },
      { label: "Storage used", used: 2.3, limit: 10, unit: "GB" },
    ];

    return (
      <div className="flex flex-col gap-6">
        {/* Plan tier card */}
        <div className="border border-[#d5c1cc] rounded-md p-5 flex items-center justify-between bg-card shadow-sm">
          <div>
            <p className="font-heading text-2xl font-semibold text-foreground">Professional</p>
            <p className="text-xs text-muted-foreground mt-1">
              Renews annually on 1 Jan 2027
            </p>
          </div>
          <button type="button" className={btnPrimary}>
            Upgrade plan
          </button>
        </div>

        {/* Usage meters */}
        {meters.map((m) => {
          const pct = Math.min((m.used / m.limit) * 100, 100);
          return (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-foreground font-medium">
                  {m.label}
                </span>
                <span className="text-sm text-muted-foreground font-mono">
                  {m.used}{m.unit} / {m.limit}{m.unit ? ` ${m.unit}` : ""}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Contact sales */}
        <p className="text-xs text-muted-foreground font-medium">
          Need more capacity?{" "}
          <a href="#" className="text-primary hover:underline font-semibold">
            Contact sales for Enterprise
          </a>
        </p>
      </div>
    );
  }

  function renderAudit() {
    return (
      <div className="flex flex-col gap-4">
        {/* Immutable info box */}
        <div className="border border-[#d5c1cc] bg-muted rounded-md p-4 flex gap-3 items-start">
          <span className="material-symbols-outlined text-muted-foreground text-[20px] mt-px">lock</span>
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Immutable audit log (BR-10)
            </p>
            <p className="text-sm text-muted-foreground">
              This log is append-only and cannot be edited, deleted, or tampered with.
              It is retained for compliance and forensic review.
            </p>
          </div>
        </div>

        {/* Audit table */}
        <div className="border border-[#d5c1cc] rounded-md overflow-hidden bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-[#d5c1cc] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="p-3 font-semibold">Timestamp</th>
                  <th className="p-3 font-semibold">Actor</th>
                  <th className="p-3 font-semibold">Action</th>
                  <th className="p-3 font-semibold">Entity</th>
                  <th className="p-3 font-semibold">IP Address</th>
                </tr>
              </thead>
              <tbody className="text-sm text-foreground">
                {AUDIT_ROWS.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#d5c1cc] hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-3 font-mono text-muted-foreground whitespace-nowrap">{row.ts}</td>
                    <td className="p-3 text-muted-foreground font-mono">{row.actor}</td>
                    <td className="p-3">
                      <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs font-medium font-mono">
                        {row.action}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{row.entity}</td>
                    <td className="p-3 font-mono text-muted-foreground">{row.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ── Tab content router ──────────────────────────────────── */

  function renderTabContent() {
    switch (activeTab) {
      case "branding":
        return renderBranding();
      case "timezone":
        return renderTimezone();
      case "notifications":
        return renderNotifications();
      case "smtp":
        return renderSmtp();
      case "plan":
        return renderPlan();
      case "audit":
        return renderAudit();
    }
  }

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-16">
      <AppNavbar />

      {/* ═══ Page header ══════════════════════════════════════ */}
      <header className="px-6 pt-8 pb-6 border-b border-[#d5c1cc]">
        <h1 className="font-heading font-semibold text-3xl text-foreground">
          Organisation settings
        </h1>
        <p className="font-mono text-xs text-muted-foreground mt-1 tracking-[0.05em]">
          {tenantSlug}
        </p>
      </header>

      {/* ═══ Main content — sidebar + panel ═══════════════════ */}
      <div className="flex flex-1 max-w-[1280px] w-full mx-auto">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-[#d5c1cc] py-4 px-2 flex flex-col justify-between">
          <nav className="flex flex-col gap-0.5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-left w-full",
                    "transition-colors duration-150 cursor-pointer",
                    "border-none outline-none",
                    isActive
                      ? "bg-muted text-foreground font-semibold"
                      : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </nav>
          <BottomNav isSidebar />
        </aside>

        {/* Content panel */}
        <main className="flex-1 p-8 max-w-[800px]">
          <h2 className="font-heading font-semibold text-2xl text-foreground mb-6">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
