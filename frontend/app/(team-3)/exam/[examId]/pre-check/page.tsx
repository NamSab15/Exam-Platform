"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Camera,
  Mic,
  Monitor,
  Shield,
  FileText,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustScorePanel } from "@/components/(team-3)/TrustScorePanel";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Types                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

type CheckStatus = "idle" | "checking" | "pass" | "fail";

interface HardwareCheck {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
  status: CheckStatus;
  detail?: string;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Constants                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

const TERMS_CONTENT = `XEBIA EXAM PLATFORM — TERMS & CONDITIONS

1. GENERAL
These Terms and Conditions govern your use of the Xebia Exam Platform ("Platform") for taking proctored examinations. By proceeding, you agree to abide by these terms in their entirety.

2. EXAM INTEGRITY
You agree to attempt this examination independently and honestly. You must not:
• Receive or provide assistance from or to any other person during the exam.
• Use unauthorised reference materials, websites, or tools unless explicitly permitted.
• Share exam content, questions, or answers with any third party.
• Attempt to circumvent the proctoring system in any way.

Any violation of exam integrity may result in immediate disqualification, cancellation of results, and may be reported to your employer or institution.

3. PROCTORING CONSENT
By proceeding, you consent to:
• Your webcam being active and capturing video during the entire exam session.
• Your microphone being active to detect audio anomalies.
• Your screen activity being recorded or monitored.
• AI-powered analysis of your video and audio feeds to detect violations.
• A "Trust Score" being computed in real time based on your behaviour during the exam.

These recordings may be reviewed by human proctors and stored securely in accordance with the data protection policy.

4. TRUST SCORE
The Trust Score is a real-time confidence metric (0–100) calculated by the AI proctoring engine based on:
• Face visibility and identity consistency.
• Eye gaze direction and focus.
• Audio background noise and speech detection.
• Tab switching, window changes, and copy/paste events.

A low Trust Score may trigger a human proctor review. Repeated violations may result in exam termination.

5. TECHNICAL REQUIREMENTS
You are responsible for ensuring your device meets the minimum technical requirements:
• A working webcam with at least 720p resolution.
• A microphone that can detect ambient audio.
• A stable internet connection (minimum 2 Mbps).
• A supported browser (Chrome 90+, Edge 90+, Firefox 85+).
• Fullscreen mode must remain active for the duration of the exam.

6. DATA PROTECTION
All collected data (video, audio, screen captures, Trust Score logs) is processed in accordance with applicable data protection law. Data is retained for a period of 90 days from exam completion unless required longer for dispute resolution.

7. DISCLAIMER
The Platform is provided "as is". Xebia is not liable for technical failures beyond its control, including but not limited to power outages, internet disconnections, or browser crashes. In such events, you should contact the exam administrator immediately.

8. AGREEMENT
By clicking "I Agree" and proceeding to the next step, you confirm that:
• You have read and understood these Terms and Conditions in full.
• You consent to AI proctoring, webcam/audio monitoring, and Trust Score computation.
• You agree to uphold exam integrity throughout the session.`;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Pre-Exam Wizard Page                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

export default function PreCheckPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const router = useRouter();
  const [examId, setExamId] = useState<string>("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  /* Step 1 state */
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);

  /* Step 2 state */
  const [proctoringConsented, setProctoringConsented] = useState(false);
  const [candidateName, setCandidateName] = useState("");

  /* Step 3 state */
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [checks, setChecks] = useState<HardwareCheck[]>([
    {
      id: "webcam",
      label: "Webcam",
      description: "Live video feed for identity verification",
      icon: <Camera className="w-5 h-5" />,
      required: true,
      status: "idle",
    },
    {
      id: "microphone",
      label: "Microphone",
      description: "Audio monitoring for ambient sound detection",
      icon: <Mic className="w-5 h-5" />,
      required: true,
      status: "idle",
    },
    {
      id: "screenshare",
      label: "Screen Share",
      description: "Screen recording capability",
      icon: <Monitor className="w-5 h-5" />,
      required: false,
      status: "idle",
    },
    {
      id: "browser",
      label: "Browser Compatibility",
      description: "IndexedDB, WebRTC, and Fullscreen support",
      icon: <Shield className="w-5 h-5" />,
      required: true,
      status: "idle",
    },
  ]);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [allRequiredPassed, setAllRequiredPassed] = useState(false);

  /* Resolve params */
  useEffect(() => {
    params.then((p) => setExamId(p.examId));
  }, [params]);

  /* Cleanup webcam stream when leaving step 3 or unmounting */
  useEffect(() => {
    return () => {
      webcamStream?.getTracks().forEach((t) => t.stop());
    };
  }, [webcamStream]);

  /* Watch required checks */
  useEffect(() => {
    const required = checks.filter((c) => c.required);
    setAllRequiredPassed(required.every((c) => c.status === "pass"));
  }, [checks]);

  /* ── Step 1 helpers ── */

  const handleTermsScroll = () => {
    const el = termsRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 8;
    if (atBottom) setScrolledToBottom(true);
  };

  /* ── Step 3 helpers ── */

  const updateCheck = (
    id: string,
    status: CheckStatus,
    detail?: string
  ) => {
    setChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, detail } : c))
    );
  };

  const runHardwareChecks = async () => {
    /* Reset all */
    setChecks((prev) => prev.map((c) => ({ ...c, status: "checking" as CheckStatus })));

    /* 1. Browser compatibility */
    await new Promise((r) => setTimeout(r, 300));
    const hasIDB = typeof indexedDB !== "undefined";
    const hasFullscreen = document.fullscreenEnabled;
    const hasWebRTC = !!navigator.mediaDevices?.getUserMedia;
    if (hasIDB && hasFullscreen && hasWebRTC) {
      updateCheck("browser", "pass", "IndexedDB ✓  Fullscreen ✓  WebRTC ✓");
    } else {
      const missing = [
        !hasIDB && "IndexedDB",
        !hasFullscreen && "Fullscreen",
        !hasWebRTC && "WebRTC",
      ]
        .filter(Boolean)
        .join(", ");
      updateCheck("browser", "fail", `Missing: ${missing}`);
    }

    /* 2. Webcam */
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
      updateCheck("webcam", "pass", "Camera detected and active");
    } catch {
      updateCheck("webcam", "fail", "Camera permission denied or not available");
    }

    /* 3. Microphone */
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.getTracks().forEach((t) => t.stop()); // just check permission
      updateCheck("microphone", "pass", "Microphone detected");
    } catch {
      updateCheck("microphone", "fail", "Microphone permission denied or not available");
    }

    /* 4. Screen share (just check API availability) */
    if (typeof navigator.mediaDevices?.getDisplayMedia === "function") {
      updateCheck("screenshare", "pass", "Screen share API available");
    } else {
      updateCheck("screenshare", "fail", "Screen share not supported in this browser");
    }
  };

  /* ── Start Exam ── */

  const handleStartExam = async () => {
    /* Request fullscreen */
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* Some browsers require user gesture; layout.tsx also attempts this */
    }
    /* Stop webcam preview (exam layout will re-request as needed) */
    webcamStream?.getTracks().forEach((t) => t.stop());
    router.push(`/exam/${examId}`);
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  /*  Render                                                                   */
  /* ─────────────────────────────────────────────────────────────────────── */

  const stepTitles = [
    "Terms & Conditions",
    "Proctoring Consent",
    "Hardware Check",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fc] via-[#fff0f8] to-[#f0f4ff] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#d5c1cc] px-6 py-4 flex items-center gap-3 shadow-sm">
        <Image src="/Logo-Purple.png" alt="Xebia" width={28} height={28} className="object-contain" />
        <div>
          <h1 className="font-bold text-[#21191e] text-lg leading-none">Xebia Assessment</h1>
          <p className="text-xs text-[#51434c] mt-0.5">Pre-Exam Setup</p>
        </div>
      </header>

      {/* Progress stepper */}
      <div className="bg-white border-b border-[#d5c1cc] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-0">
          {stepTitles.map((title, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <React.Fragment key={n}>
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      done
                        ? "bg-[#01ac9f] text-white"
                        : active
                        ? "bg-[#6c1d5f] text-white shadow-lg shadow-[#6c1d5f]/30"
                        : "bg-[#eddfe5] text-[#83727c]"
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-5 h-5" /> : n}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      active ? "text-[#6c1d5f]" : done ? "text-[#01ac9f]" : "text-[#83727c]"
                    }`}
                  >
                    {title}
                  </span>
                </div>
                {i < stepTitles.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 mt-[-16px] transition-colors ${
                      step > n ? "bg-[#01ac9f]" : "bg-[#eddfe5]"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* ── STEP 1: Terms & Conditions ── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-[#d5c1cc] shadow-sm overflow-hidden">
              <div className="px-8 pt-8 pb-4 border-b border-[#eddfe5]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#6c1d5f]/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#6c1d5f]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#21191e]">Terms & Conditions</h2>
                    <p className="text-sm text-[#51434c]">Read carefully before proceeding</p>
                  </div>
                </div>
              </div>

              <div
                ref={termsRef}
                onScroll={handleTermsScroll}
                className="px-8 py-6 h-72 overflow-y-auto text-sm text-[#51434c] leading-relaxed whitespace-pre-line font-mono bg-[#fafafa] border-b border-[#eddfe5]"
                style={{ scrollbarWidth: "thin" }}
              >
                {TERMS_CONTENT}
              </div>

              {!scrolledToBottom && (
                <div className="px-8 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-amber-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please scroll to the bottom to read all terms before agreeing.</span>
                </div>
              )}

              <div className="px-8 py-6">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    termsAgreed
                      ? "border-[#6c1d5f] bg-[#6c1d5f]/5"
                      : "border-[#d5c1cc] hover:border-[#83727c]"
                  } ${!scrolledToBottom ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <input
                    id="terms-agree"
                    type="checkbox"
                    checked={termsAgreed}
                    disabled={!scrolledToBottom}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#6c1d5f]"
                  />
                  <span className="text-sm text-[#21191e] font-medium">
                    I have read and agree to the Terms & Conditions, and I consent to AI proctoring
                    and trust score monitoring during this examination.
                  </span>
                </label>

                <div className="flex justify-end mt-6">
                  <Button
                    disabled={!termsAgreed}
                    onClick={() => setStep(2)}
                    className="bg-[#6c1d5f] hover:bg-[#4a1e47] text-white gap-2 px-6"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Proctoring Consent & Trust Score Info ── */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-[#d5c1cc] shadow-sm overflow-hidden">
              <div className="px-8 pt-8 pb-4 border-b border-[#eddfe5]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#ff6200]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#ff6200]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#21191e]">Proctoring Consent</h2>
                    <p className="text-sm text-[#51434c]">Understand what is monitored during your exam</p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 space-y-6">
                {/* Trust Score explanation */}
                <div className="bg-gradient-to-br from-[#6c1d5f]/5 to-[#6c1d5f]/10 rounded-xl p-5 border border-[#6c1d5f]/20">
                  <h3 className="font-bold text-[#21191e] mb-3 flex items-center gap-2">
                    <span className="text-lg">🛡️</span> What is the Trust Score?
                  </h3>
                  <p className="text-sm text-[#51434c] mb-4 leading-relaxed">
                    The <strong>Trust Score</strong> is a real-time confidence metric (0–100) computed by our AI
                    proctoring engine throughout your exam. It reflects the likelihood that you are taking the exam
                    independently and without violations.
                  </p>
                  <div className="flex items-center justify-center my-2">
                    <TrustScorePanel score={92} size="sm" animated={false} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
                    <div className="bg-red-50 rounded-lg p-2 border border-red-100">
                      <div className="font-bold text-red-500 text-base">0–49</div>
                      <div className="text-[#51434c]">Low — Review triggered</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                      <div className="font-bold text-amber-500 text-base">50–79</div>
                      <div className="text-[#51434c]">Medium — Being watched</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 border border-green-100">
                      <div className="font-bold text-green-600 text-base">80–100</div>
                      <div className="text-[#51434c]">High — Excellent</div>
                    </div>
                  </div>
                </div>

                {/* What is monitored */}
                <div>
                  <h3 className="font-semibold text-[#21191e] mb-3">What will be monitored:</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: "📷", text: "Webcam — continuous video capture for face detection and gaze tracking" },
                      { icon: "🎤", text: "Microphone — audio monitoring for voice or noise anomalies" },
                      { icon: "🖥️", text: "Screen — tab switches, window changes, and copy/paste events" },
                      { icon: "👁️", text: "AI Analysis — real-time behavior classification for the Trust Score" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#51434c]">
                        <span className="text-base shrink-0">{item.icon}</span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consent + name */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#21191e] mb-1">
                      Full Name (as it will appear on your certificate)
                    </label>
                    <input
                      id="candidate-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full border border-[#d5c1cc] rounded-lg px-3 py-2 text-sm text-[#21191e] focus:outline-none focus:ring-2 focus:ring-[#6c1d5f]/30 focus:border-[#6c1d5f]"
                    />
                  </div>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      proctoringConsented
                        ? "border-[#6c1d5f] bg-[#6c1d5f]/5"
                        : "border-[#d5c1cc] hover:border-[#83727c]"
                    }`}
                  >
                    <input
                      id="proctoring-consent"
                      type="checkbox"
                      checked={proctoringConsented}
                      onChange={(e) => setProctoringConsented(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-[#6c1d5f]"
                    />
                    <span className="text-sm text-[#21191e] font-medium">
                      I consent to webcam, microphone, and screen monitoring, and to AI proctoring with
                      Trust Score computation for the duration of this exam.
                    </span>
                  </label>
                </div>
              </div>

              <div className="px-8 pb-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-[#6c1d5f] text-[#6c1d5f] hover:bg-[#f9eaf0] gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  disabled={!proctoringConsented || !candidateName.trim()}
                  onClick={() => { setStep(3); setTimeout(runHardwareChecks, 300); }}
                  className="bg-[#6c1d5f] hover:bg-[#4a1e47] text-white gap-2 px-6"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Hardware Check ── */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-[#d5c1cc] shadow-sm overflow-hidden">
              <div className="px-8 pt-8 pb-4 border-b border-[#eddfe5]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#01ac9f]/10 flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-[#01ac9f]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#21191e]">Hardware Check</h2>
                      <p className="text-sm text-[#51434c]">Verify your devices before starting</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runHardwareChecks}
                    className="border-[#01ac9f] text-[#01ac9f] hover:bg-[#01ac9f]/5 gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Re-test
                  </Button>
                </div>
              </div>

              <div className="px-8 py-6 space-y-4">
                {/* Webcam preview */}
                {webcamStream && (
                  <div className="rounded-xl overflow-hidden border border-[#d5c1cc] bg-black aspect-video max-h-40">
                    <video
                      ref={webcamRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Check cards */}
                {checks.map((check) => (
                  <div
                    key={check.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      check.status === "pass"
                        ? "border-green-200 bg-green-50"
                        : check.status === "fail"
                        ? "border-red-200 bg-red-50"
                        : check.status === "checking"
                        ? "border-blue-200 bg-blue-50"
                        : "border-[#d5c1cc] bg-white"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        check.status === "pass"
                          ? "bg-green-100 text-green-600"
                          : check.status === "fail"
                          ? "bg-red-100 text-red-500"
                          : check.status === "checking"
                          ? "bg-blue-100 text-blue-500"
                          : "bg-[#eddfe5] text-[#83727c]"
                      }`}
                    >
                      {check.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#21191e] text-sm">{check.label}</span>
                        {check.required && (
                          <span className="text-xs bg-[#6c1d5f]/10 text-[#6c1d5f] rounded px-1.5 py-0.5 font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#51434c] mt-0.5">{check.description}</p>
                      {check.detail && (
                        <p
                          className={`text-xs mt-0.5 font-medium ${
                            check.status === "pass" ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {check.detail}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {check.status === "checking" && (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      )}
                      {check.status === "pass" && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {check.status === "fail" && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      {check.status === "idle" && (
                        <div className="w-5 h-5 rounded-full border-2 border-[#d5c1cc]" />
                      )}
                    </div>
                  </div>
                ))}

                {!allRequiredPassed &&
                  checks.some((c) => c.status !== "idle" && c.status !== "checking") && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        Some required checks failed. Please resolve the issues and click{" "}
                        <strong>Re-test</strong> to try again. You cannot start the exam until webcam,
                        microphone, and browser compatibility checks pass.
                      </p>
                    </div>
                  )}
              </div>

              <div className="px-8 pb-8 flex justify-between border-t border-[#eddfe5] pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="border-[#6c1d5f] text-[#6c1d5f] hover:bg-[#f9eaf0] gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  disabled={!allRequiredPassed}
                  onClick={handleStartExam}
                  className="bg-[#ff6200] hover:bg-[#e65800] text-white font-semibold gap-2 px-8 shadow-lg shadow-[#ff6200]/30 disabled:opacity-50"
                >
                  🚀 Start Exam
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
