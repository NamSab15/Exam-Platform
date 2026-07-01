"use client";

import { useState } from "react";
import OnboardingStepper from "../OnboardingStepper";

/* ── Shared style constants ─────────────────────────────────────
   Every colour / radius / spacing references a design-token variable
   through the Tailwind theme (see globals.css @theme). */

const inputBase = [
  "w-full bg-background border border-border rounded-sm",
  "text-[16px] leading-[24px] text-heading",
  "py-2 px-3 transition-all duration-200",
  "outline-none focus:border-primary",
  "focus:shadow-[0_0_0_2px_rgba(108,29,95,0.2)]",
].join(" ");

const btnPrimary = [
  "bg-primary text-white rounded-md",
  "font-medium text-[14px] leading-[16px] tracking-[0.01em]",
  "py-2 px-6 transition-colors duration-200",
  "hover:bg-primary-hover cursor-pointer",
  "border-none outline-none",
  "flex items-center gap-2",
].join(" ");

const btnSecondary = [
  "bg-background text-body border border-border rounded-sm",
  "font-medium text-[14px] leading-[16px] tracking-[0.01em]",
  "py-2 px-6 transition-colors duration-200",
  "hover:bg-surface-hover cursor-pointer",
].join(" ");

/* ── Plan tiers ─────────────────────────────────────────────── */

const PLAN_TIERS = ["Starter", "Professional", "Enterprise"] as const;
type PlanTier = (typeof PLAN_TIERS)[number];

/* ── Page component ─────────────────────────────────────────── */

export default function OnboardingStep1Page({ onNext }: { onNext?: () => void } = {}) {
  const [orgName, setOrgName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [planTier, setPlanTier] = useState<PlanTier>("Professional");

  function handleBack() {
    // TODO: navigate to previous page once onboarding flow is wired up
    console.log("Back clicked — no previous step exists for Step 1");
  }

  function handleNext() {
    if (onNext) {
      onNext();
      return;
    }
    // TODO: navigate to /onboarding/step-2 once it's built
    console.log("Next clicked — Step 2 (Branding) not yet available", {
      orgName,
      tenantSlug,
      contactEmail,
      planTier,
    });
  }

  return (
    <main className="min-h-screen bg-background flex justify-center py-8 md:py-12 px-4 md:px-12">
      <div className="w-full max-w-[800px] flex flex-col">
        {/* ── Header ───────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="font-semibold text-[32px] leading-[40px] tracking-[-0.02em] text-heading mb-1">
            Welcome — let&apos;s set up your organisation
          </h1>
          <p className="text-[14px] leading-[20px] text-body">
            Shown once, right after a tenant admin&apos;s first login.
          </p>
        </header>

        {/* ── Progress stepper ─────────────────────────────── */}
        <div className="mb-8">
          <OnboardingStepper currentStep={1} />
        </div>

        {/* ── Main form card ───────────────────────────────── */}
        <div className="bg-background border border-border p-6 mt-4">
          <h2 className="font-semibold text-[20px] leading-[28px] text-heading mb-6">
            Step 1 — Organisation details
          </h2>

          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Organisation name */}
            <div>
              <label
                className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-body mb-2"
                htmlFor="org_name"
              >
                Organisation name
              </label>
              <input
                className={inputBase}
                id="org_name"
                name="org_name"
                placeholder="e.g. Northbridge University"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>

            {/* Tenant slug */}
            <div>
              <label
                className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-body mb-2"
                htmlFor="tenant_slug"
              >
                Tenant slug (used in URLs)
              </label>
              <input
                className={`${inputBase} mb-1`}
                id="tenant_slug"
                name="tenant_slug"
                placeholder="northbridge-university"
                type="text"
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
              />
              <p className="text-[14px] leading-[20px] text-body">
                must be unique, lowercase, no spaces
              </p>
            </div>

            {/* Plan tier selector */}
            <div>
              <label className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-body mb-2">
                Plan tier
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                {PLAN_TIERS.map((tier) => {
                  const isSelected = planTier === tier;
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setPlanTier(tier)}
                      className={[
                        "flex-1 border py-2 px-3 text-center",
                        "font-medium text-[14px] leading-[16px] tracking-[0.01em]",
                        "transition-colors duration-200 cursor-pointer",
                        isSelected
                          ? "bg-surface-hover text-heading border-heading"
                          : "bg-background text-body border-border hover:bg-surface-hover",
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
                className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-body mb-2"
                htmlFor="contact_email"
              >
                Primary contact email
              </label>
              <input
                className={inputBase}
                id="contact_email"
                name="contact_email"
                placeholder="admin@northbridge.edu"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            {/* Note box */}
            <div className="border border-dashed border-border bg-surface-hover p-4 rounded-sm">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-body text-[20px] mt-px">
                  info
                </span>
                <div>
                  <p className="font-medium text-[14px] leading-[16px] tracking-[0.01em] text-heading mb-1">
                    Note: tenant isolation key created here
                  </p>
                  <p className="text-[14px] leading-[20px] text-body">
                    This ID is attached to every record going forward.
                  </p>
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
  );
}
