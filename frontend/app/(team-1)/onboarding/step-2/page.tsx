"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
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

/* ── Page component ─────────────────────────────────────────── */

interface OnboardingStep2Props {
  onNext?: () => void;
}

export default function OnboardingStep2({ onNext }: OnboardingStep2Props = {}) {
  const router = useRouter();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>("");
  const [brandColor, setBrandColor] = useState("#510047");
  const [displayName, setDisplayName] = useState("");
  const [tagline, setTagline] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage for initial display
  useEffect(() => {
    const cachedName = localStorage.getItem("org_name") || "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayName(cachedName);
  }, []);

  /* ── Logo handling ──────────────────────────────────────────── */

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
      setLogoPreviewUrl("");
    }
  };

  /* ── Colour sync ────────────────────────────────────────────── */

  const handleColorPicker = (color: string) => {
    setBrandColor(color);
  };

  const handleHexInput = (hex: string) => {
    if (hex.startsWith("#") || hex.length === 0) {
      setBrandColor(hex);
    } else {
      setBrandColor("#" + hex);
    }
  };

  /* ── Navigation ─────────────────────────────────────────────── */

  const handleBack = () => {
    router.push("/onboarding/step-1");
  };

  const handleNext = () => {
    // Save to cache for preview page
    localStorage.setItem("brand_color", brandColor);
    localStorage.setItem("display_name", displayName || "Xebia India");
    localStorage.setItem("tagline", tagline || "Excellence in Assessment");

    // Convert file to base64 for persistent preview if set
    if (logoPreviewUrl) {
      localStorage.setItem("logo_url", logoPreviewUrl);
    } else {
      localStorage.removeItem("logo_url");
    }

    if (onNext) {
      onNext();
    } else {
      router.push("/onboarding/step-3");
    }
  };

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background flex justify-center pt-24 pb-8 md:pt-28 md:pb-12 px-4 md:px-12 text-foreground">
        <div className="w-full max-w-[800px] flex flex-col">
          {/* ── Header ───────────────────────────────────────── */}
          <header className="mb-8">
            <h1 className="font-heading font-semibold text-3xl text-foreground mb-1">
              Set up your organisation&apos;s branding
            </h1>
            <p className="text-sm text-muted-foreground">
              These settings control how the platform appears to your candidates.
            </p>
          </header>

          {/* ── Progress stepper ─────────────────────────────── */}
          <div className="mb-8">
            <OnboardingStepper currentStep={2} />
          </div>

          {/* ── Main form card ───────────────────────────────── */}
          <div className="bg-card border border-[#d5c1cc] rounded-md p-6 mt-4 shadow-sm">
            <h2 className="font-heading font-semibold text-2xl text-foreground mb-6">
              Step 2 — Branding
            </h2>

            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Organisation logo */}
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
                        {logoFile?.name}
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
                    className="border-dashed border-2 border-[#d5c1cc] rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    <span className="material-symbols-outlined text-muted-foreground text-4xl mb-2">
                      upload
                    </span>
                    <p className="text-foreground font-medium text-sm">
                      Drag &amp; drop your logo here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, SVG — max 2 MB (recommended aspect 4:1)
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

              {/* Brand Color Picker */}
              <div>
                <label className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2">
                  Primary brand colour
                </label>
                <p className="text-sm text-muted-foreground mb-2">
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
                    className={`${inputBase} max-w-[140px] font-mono`}
                    placeholder="#510047"
                    maxLength={7}
                  />
                </div>
              </div>

              {/* Display name */}
              <div>
                <label
                  className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
                  htmlFor="display_name"
                >
                  Display name
                </label>
                <p className="text-sm text-muted-foreground mb-2">
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
                  className="block font-medium text-xs tracking-[0.01em] text-muted-foreground mb-2"
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
                <p className="text-xs text-muted-foreground mt-1 text-right font-mono">
                  {tagline.length} / 80
                </p>
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
