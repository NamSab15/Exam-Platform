/**
 * OnboardingStepper — 5-step progress indicator for the tenant onboarding wizard.
 *
 * Reusable across all five onboarding steps. Pass `currentStep` (1–5)
 * and the component renders the correct active / completed / upcoming states.
 *
 * All colors / spacing / radii reference the design-project tokens in globals.css.
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
    <nav aria-label="Onboarding progress" className="w-full pb-6">
      <ol className="flex items-start w-full" role="list">
        {STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          const isLast = stepNum === STEPS.length;

          return (
            <li
              key={label}
              className="relative flex-1 flex flex-col items-center"
            >
              {/* Connector line (hidden on the last step) */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="absolute top-4 left-1/2 -translate-y-1/2 w-full h-px z-0 pointer-events-none"
                >
                  <div
                    className={`h-px w-full ${
                      isCompleted ? "bg-primary" : "bg-[#d5c1cc]"
                    }`}
                  />
                </div>
              )}

              {/* Circle */}
              <span
                aria-current={isActive ? "step" : undefined}
                className={[
                  "relative flex h-8 w-8 items-center justify-center rounded-full z-10",
                  "font-medium text-xs tracking-[0.01em]",
                  "transition-colors duration-200",
                  isActive || isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "border border-[#d5c1cc] bg-muted text-muted-foreground",
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
                  "mt-2 text-center font-semibold text-xs max-w-[120px] sm:max-w-[160px] break-words line-clamp-2 px-1 z-10",
                  isActive || isCompleted ? "text-foreground" : "text-muted-foreground",
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
