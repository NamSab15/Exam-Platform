/**
 * OnboardingStepper — 5-step progress indicator for the tenant onboarding wizard.
 *
 * Reusable across all five onboarding steps.  Pass `currentStep` (1–5)
 * and the component renders the correct active / completed / upcoming states.
 *
 * Design source: Stitch screen "Tenant Onboarding Step 1" (Desktop 2560×2048).
 * All colours / spacing / radii reference tokens.css via the Tailwind theme.
 */

interface OnboardingStepperProps {
  /** Which step is currently active (1-based, 1–5). */
  currentStep: number;
}

const STEPS = [
  "Org details",
  "Branding",
  "Timezone & notif.",
  "Invite users",
  "Review",
] as const;

export default function OnboardingStepper({
  currentStep,
}: OnboardingStepperProps) {
  return (
    <nav aria-label="Onboarding progress" className="overflow-x-auto pb-2">
      <ol className="flex items-center" role="list">
        {STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          const isLast = stepNum === STEPS.length;

          return (
            <li
              key={label}
              className={`relative ${isLast ? "" : "pr-8 sm:pr-20"}`}
            >
              {/* Connector line (hidden on the last step) */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center"
                >
                  <div
                    className={`h-px w-full ${
                      isCompleted ? "bg-primary" : "bg-border"
                    }`}
                  />
                </div>
              )}

              {/* Circle */}
              <span
                aria-current={isActive ? "step" : undefined}
                className={[
                  "relative flex h-8 w-8 items-center justify-center rounded-full",
                  "font-medium text-[14px] leading-[16px] tracking-[0.01em]",
                  "transition-colors duration-200",
                  isActive || isCompleted
                    ? "bg-primary text-white"
                    : "border border-border bg-background text-body",
                ].join(" ")}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                ) : (
                  stepNum
                )}
                <span className="sr-only">{label}</span>
              </span>

              {/* Label below circle */}
              <span
                className={[
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap",
                  "font-semibold text-[12px] leading-[16px]",
                  isActive || isCompleted ? "text-heading" : "text-body",
                ].join(" ")}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
