/**
 * Demo / Presentation Page
 * Route: /demo
 *
 * Wires all existing Team 1 (Accounts & Setup) screens into
 * a single navigable presentation. No screens are rebuilt —
 * each is imported and rendered as-is.
 */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Import all existing screen components
import LoginPage from "../(team-1)/login/page";
import ResetPasswordPage from "../(team-1)/reset-password/page";
import OnboardingStep1 from "../(team-1)/onboarding/step-1/page";
import OnboardingStep2 from "../(team-1)/onboarding/step-2/page";
import OnboardingStep3 from "../(team-1)/onboarding/step-3/page";
import OnboardingStep4 from "../(team-1)/onboarding/step-4/page";
import OnboardingStep5 from "../(team-1)/onboarding/step-5/page";

// These pages use useEffect / localStorage — dynamic import avoids
// the "metadata in client component" build error.
const OrgSettingsPage = dynamic(() => import("../(team-1)/org-settings/page"), { ssr: false });
const UsersPage = dynamic(() => import("../(team-1)/users/page"), { ssr: false });
import Team1Layout from "../(team-1)/layout";

/* ── Screen registry ────────────────────────────────────────── */

type Screen =
  | "login"
  | "reset-password"
  | "onboarding-1"
  | "onboarding-2"
  | "onboarding-3"
  | "onboarding-4"
  | "onboarding-5"
  | "org-settings"
  | "users";

/* ── Page component ─────────────────────────────────────────── */

export default function DemoPage() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <Team1Layout>
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
        <OnboardingStep5 onNext={() => setScreen("org-settings")} />
      )}
      {screen === "org-settings" && <OrgSettingsPage />}
      {screen === "users" && <UsersPage />}
    </Team1Layout>
  );
}
