/**
 * Onboarding Step 2 — Branding
 * Route: /onboarding/step-2
 * BRD: §4.1.1 — Tenant branding configuration
 *
 * Lets the tenant admin upload a logo, pick a brand colour,
 * set a display name, and add an optional tagline.
 */

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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

/* ── Page component ─────────────────────────────────────────── */

export default function OnboardingStep2Page({ onNext }: { onNext?: () => void } = {}) {
  const router = useRouter();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState("#6C1D5F");
  const [displayName, setDisplayName] = useState("");
  const [tagline, setTagline] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Logo handling ──────────────────────────────────────────── */

  function handleFileSelect(file: File | undefined) {
    if (!file) return;
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreviewUrl(url);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  }

  function removeLogo() {
    setLogoFile(null);
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogoPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* ── Colour sync ────────────────────────────────────────────── */

  function handleHexInput(value: string) {
    setBrandColor(value);
  }

  function handleColorPicker(value: string) {
    setBrandColor(value);
  }

  /* ── Navigation ─────────────────────────────────────────────── */

  function handleBack() {
    router.push("/onboarding/step-1");
  }

  function handleNext() {
    if (onNext) {
      onNext();
      return;
    }
    console.log("Step 2 data:", {
      logoFile: logoFile?.name ?? null,
      brandColor,
      displayName,
      tagline,
    });
    router.push("/onboarding/step-3");
  }

  return (
    <main className="min-h-screen bg-background flex justify-center py-8 md:py-12 px-4 md:px-12 text-foreground">
      <div className="w-full max-w-[800px] flex flex-col">
        {/* ── Header ───────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="font-semibold text-[32px] leading-[40px] tracking-[-0.02em] text-foreground mb-1">
            Set up your organisation&apos;s branding
          </h1>
          <p className="text-[14px] leading-[20px] text-muted-foreground">
            These settings control how the platform appears to your candidates.
          </p>
        </header>

        {/* ── Progress stepper ─────────────────────────────── */}
        <div className="mb-8">
          <OnboardingStepper currentStep={2} />
        </div>

        {/* ── Main form card ───────────────────────────────── */}
        <div className="bg-background border border-border rounded-md p-6 mt-4">
          <h2 className="font-semibold text-[20px] leading-[28px] text-foreground mb-6">
            Step 2 — Branding
          </h2>

          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Logo upload */}
            <div>
              <label className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2">
                Logo
              </label>

              {logoPreviewUrl ? (
                <div className="flex items-center gap-4 border border-border rounded-md p-4">
                  <Image
                    src={logoPreviewUrl}
                    alt="Logo preview"
                    className="max-h-16 object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-[14px] text-foreground font-medium truncate">
                      {logoFile?.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {logoFile && `${(logoFile.size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeLogo}
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
                  className="border-dashed border-2 border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      fileInputRef.current?.click();
                  }}
                >
                  <span className="material-symbols-outlined text-border text-4xl mb-2">
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
                accept=".png,.svg,image/png,image/svg+xml"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
            </div>

            {/* Primary brand colour */}
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
                  value={brandColor}
                  onChange={(e) => handleColorPicker(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-none p-0 bg-transparent"
                  style={{ appearance: "none" }}
                  aria-label="Pick brand colour"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => handleHexInput(e.target.value)}
                  className={`${inputBase} max-w-[140px]`}
                  placeholder="#6C1D5F"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Display name */}
            <div>
              <label
                className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
                htmlFor="display_name"
              >
                Display name
              </label>
              <p className="text-[14px] leading-[20px] text-muted-foreground mb-2">
                Shown on the exam portal and in candidate emails. This is your
                public-facing name, separate from the organisation slug.
              </p>
              <input
                className={inputBase}
                id="display_name"
                name="display_name"
                placeholder="e.g. Acme University"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            {/* Tagline (optional) */}
            <div>
              <label
                className="block font-medium text-[14px] leading-[16px] tracking-[0.01em] text-muted-foreground mb-2"
                htmlFor="tagline"
              >
                Tagline (optional)
              </label>
              <input
                className={inputBase}
                id="tagline"
                name="tagline"
                placeholder="e.g. Excellence in Assessment"
                type="text"
                maxLength={80}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
              <p className="text-[12px] text-muted-foreground mt-1">
                {tagline.length} / 80
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
