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
  "w-full bg-card border border-[#d5c1cc] rounded-md",
  "text-sm text-foreground",
  "py-2 px-3 transition-all duration-200",
  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:outline-none",
].join(" ");

const btnPrimary = [
  "bg-primary text-white rounded-md font-medium",
  "text-sm tracking-[0.01em]",
  "py-2 px-6 transition-colors duration-200",
  "hover:bg-primary/90 cursor-pointer",
  "border-none outline-none",
  "flex items-center gap-2",
].join(" ");

const btnSecondary = [
  "bg-transparent text-foreground border border-[#d5c1cc] rounded-md font-medium",
  "text-sm tracking-[0.01em]",
  "py-2 px-6 transition-colors duration-200",
  "hover:bg-muted cursor-pointer outline-none",
].join(" ");

/* ── Plan tiers ─────────────────────────────────────────────── */

const PLAN_TIERS = ["Basic", "Professional", "Enterprise"] as const;
type PlanTier = (typeof PLAN_TIERS)[number];

/* ── Page component ─────────────────────────────────────────── */

interface OnboardingStep1Props {
  onNext?: () => void;
}

export default function OnboardingStep1({ onNext }: OnboardingStep1Props = {}) {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [planTier, setPlanTier] = useState<PlanTier>("Professional");

  function handleBack() {
    router.push("/login");
  }

  function handleNext() {
    localStorage.setItem("org_name", orgName || "Xebia India");
    localStorage.setItem("tenant_slug", tenantSlug || "xebia-india");
    localStorage.setItem("plan_tier", planTier);
    localStorage.setItem("contact_email", contactEmail || "admin@xebia.com");

    if (onNext) {
      onNext();
    } else {
      router.push("/onboarding/step-2");
    }
  }

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background flex justify-center pt-24 pb-8 md:pt-28 md:pb-12 px-4 md:px-12 text-foreground">
        <div className="w-full max-w-[800px] flex flex-col">
          {/* ── Header ───────────────────────────────────────── */}
          <header className="mb-8">
            <h1 className="font-heading font-semibold text-3xl text-foreground mb-1">
              Welcome — let&apos;s set up your organisation
            </h1>
            <p className="text-sm text-muted-foreground">
              Shown once, right after a tenant admin&apos;s first login.
            </p>
          </header>

          {/* ── Progress stepper ─────────────────────────────── */}
          <div className="mb-8">
            <OnboardingStepper currentStep={1} />
          </div>

          {/* ── Main form card ───────────────────────────────── */}
          <div className="bg-card border border-[#d5c1cc] rounded-md p-6 mt-4 shadow-sm">
            <h2 className="font-heading font-semibold text-2xl text-foreground mb-6">
              Step 1 — Organisation details
            </h2>

            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Organisation name */}
              <div>
                <label
                  className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
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
                  onChange={(e) => {
                    setOrgName(e.target.value);
                    setTenantSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")
                    );
                  }}
                />
              </div>

              {/* Tenant slug */}
              <div>
                <label
                  className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
                  htmlFor="tenant_slug"
                >
                  Tenant slug
                </label>
                <div className="flex border border-[#d5c1cc] rounded-md overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-200">
                  <span className="text-muted-foreground text-sm bg-muted px-3 py-2 border-r border-[#d5c1cc] shrink-0 flex items-center select-none font-mono">
                    xebia-platform.io/
                  </span>
                  <input
                    className="flex-1 bg-card text-sm text-foreground py-2 px-3 outline-none border-none font-mono"
                    id="tenant_slug"
                    name="tenant_slug"
                    placeholder="your-organisation"
                    type="text"
                    value={tenantSlug}
                    onChange={(e) => setTenantSlug(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used as your subdomain isolation key. Cannot be changed after
                  setup.
                </p>
              </div>

              {/* Plan tier */}
              <div>
                <label className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2">
                  Plan tier
                </label>
                <div className="flex gap-3">
                  {PLAN_TIERS.map((tier) => {
                    const isSelected = planTier === tier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setPlanTier(tier)}
                        className={[
                          "flex-1 border-2 rounded-md p-3 cursor-pointer",
                          "text-center font-medium text-sm transition-all duration-150",
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-[#d5c1cc] bg-card text-muted-foreground hover:border-primary/40",
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
                  className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
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
              <div className="border border-dashed border-[#d5c1cc] bg-muted p-4 rounded-md">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-muted-foreground text-[20px] mt-px animate-none">
                    info
                  </span>
                  <div>
                    <p className="font-semibold text-sm tracking-[0.01em] text-foreground mb-1">
                      Note: tenant isolation key created here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This ID is attached to every record going forward.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-[#d5c1cc] mt-2">
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
