/**
 * Root Page — Demo Presentation Flow
 * Route: /
 *
 * Renders the complete Accounts & Setup flow starting from the
 * Sign In screen. Clicking the primary action button on each
 * screen automatically advances to the next screen.
 */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Import all existing screen components
import LoginPage from "./login/page";
import ResetPasswordPage from "./reset-password/page";
import OnboardingStep1 from "./onboarding/step-1/page";
import OnboardingStep2 from "./onboarding/step-2/page";
import OnboardingStep3 from "./onboarding/step-3/page";
import OnboardingStep4 from "./onboarding/step-4/page";
import OnboardingStep5 from "./onboarding/step-5/page";

// Users page is a server component that exports `metadata` — dynamic
// import avoids the "metadata in client component" build error.
const UsersPage = dynamic(() => import("./users/page"), { ssr: false });

/* ── Screen registry ────────────────────────────────────────── */

type Screen =
  | "login"
  | "reset-password"
  | "onboarding-1"
  | "onboarding-2"
  | "onboarding-3"
  | "onboarding-4"
  | "onboarding-5"
  | "users";

/* ── Page component ─────────────────────────────────────────── */

export default function Home() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <>
      {screen === "login" && (
        <LoginPage onNext={() => setScreen("reset-password")} />
      )}
      {screen === "reset-password" && (
        <ResetPasswordPage onNext={() => setScreen("onboarding-1")} />
      )}
      {screen === "onboarding-1" && (
        <OnboardingStep1 onNext={() => setScreen("onboarding-2")} />
      )}
      {screen === "onboarding-2" && (
        <OnboardingStep2 onNext={() => setScreen("onboarding-3")} />
      )}
      {screen === "onboarding-3" && (
        <OnboardingStep3 onNext={() => setScreen("onboarding-4")} />
      )}
      {screen === "onboarding-4" && (
        <OnboardingStep4 onNext={() => setScreen("onboarding-5")} />
      )}
      {screen === "onboarding-5" && (
        <OnboardingStep5 onNext={() => setScreen("users")} />
      )}
      {screen === "users" && <UsersPage />}
    </>
  );
}
