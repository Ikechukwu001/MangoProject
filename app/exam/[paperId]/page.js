"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flag,
  ClipboardList,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Crown,
  Lock,
  Sparkles,
  X,
  BadgeCheck,
} from "lucide-react";
import Container from "@/components/layout/Container";
import getPaperById from "@/lib/getPaperById";
import questions from "@/src/data/questions";
import { createClient } from "@/src/lib/supabase/client";

function StatCard({ icon: Icon, label, value, tone = "default" }) {
  const toneClasses =
    tone === "success"
      ? "bg-teal-50 text-teal-700"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700"
      : tone === "danger"
      ? "bg-red-50 text-red-700"
      : "bg-slate-50 text-slate-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={16} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className={`mt-3 inline-flex rounded-xl px-3 py-2 ${toneClasses}`}>
        <span className="text-xl font-bold sm:text-2xl">{value}</span>
      </div>
    </div>
  );
}

function ModalShell({ open, onClose, children, maxWidth = "max-w-lg" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/65 p-3 backdrop-blur-[2px] sm:p-4">
      <div className="flex min-h-dvh items-center justify-center">
        <div
          className={`relative w-full ${maxWidth} rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:rounded-[28px]`}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 sm:right-4 sm:top-4"
          >
            <X size={17} />
          </button>

          {children}
        </div>
      </div>
    </div>
  );
}

function SubmitModal({
  open,
  onClose,
  onSubmit,
  answeredCount,
  unansweredCount,
  flaggedCount,
  timeLeft,
  formatTime,
  isPremium,
  accessibleCount,
  paperQuestionsLength,
  previewMode,
}) {
  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="border-b border-slate-200 px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
        <div className="pr-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 sm:h-12 sm:w-12">
              <BadgeCheck size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700 sm:text-[11px]">
                PharmTechSuccess
              </p>
              <h3 className="mt-1 text-base font-bold text-slate-900 sm:text-xl">
                Ready to submit your exam?
              </h3>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-[15px]">
            Review your exam summary before final submission.
            {previewMode && (
              <span className="mt-2 block rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-700 sm:text-sm">
                You are submitting a free preview result ({accessibleCount}/
                {paperQuestionsLength} questions).
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
              Answered
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              {answeredCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
              Unanswered
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              {unansweredCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
              Flagged
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              {flaggedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
              Time Left
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 sm:mt-5 sm:p-4">
            <p className="text-sm font-semibold text-amber-800">
              You still have {unansweredCount} unanswered question
              {unansweredCount !== 1 ? "s" : ""}.
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-700 sm:text-sm sm:leading-6">
              You can still submit now, or go back and complete them first.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:min-h-12"
          >
            Continue Exam
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:min-h-12"
          >
            {isPremium ? "Submit Exam Now" : "Submit Preview Now"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function PremiumModal({
  open,
  onClose,
  lockReason,
  freePreviewCount,
  paperQuestionsLength,
}) {
  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="border-b border-slate-200 px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
        <div className="pr-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 sm:h-12 sm:w-12">
              <Crown size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700 sm:text-[11px]">
                Premium Access
              </p>
              <h3 className="mt-1 text-base font-bold text-slate-900 sm:text-xl">
                Unlock the full paper
              </h3>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-[15px]">
            {lockReason === "preview-limit"
              ? `You’ve reached the free preview limit of ${freePreviewCount} questions. Upgrade to premium to unlock all ${paperQuestionsLength} questions and continue your CBT practice without interruption.`
              : "This part of the paper is available only for premium users."}
          </p>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
              Free Access
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              {freePreviewCount}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Questions available in preview mode
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
              Full Paper
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              {paperQuestionsLength}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Total questions you unlock with premium
            </p>
          </div>

          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-3 sm:p-4">
            <div className="flex items-center gap-2 text-teal-700">
              <Sparkles size={16} />
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs">
                Premium Benefit
              </p>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900 sm:text-base">
              Full exam flow
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
              Better practice experience and complete paper access
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-teal-700" />
            <div className="space-y-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
              <p>Unlock all {paperQuestionsLength} questions in this paper.</p>
              <p>Continue the CBT without being stopped at the preview limit.</p>
              <p>Use the premium upgrade options available on the pricing page.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/pricing"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:min-h-12"
          >
            View Premium Access
            <ArrowRight size={16} />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:min-h-12"
          >
            Continue Preview
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const paperId = params?.paperId;

  const paper = getPaperById(paperId);
  const matchedPaper = questions.find((item) => item.paperId === paperId);
  const paperQuestions = matchedPaper?.questions || [];

  const freePreviewCount = paper?.freeQuestions || 10;

  const STORAGE_KEYS = {
    answers: `answers-${paperId}`,
    index: `index-${paperId}`,
    time: `time-${paperId}`,
    flagged: `flagged-${paperId}`,
    submitted: `submitted-${paperId}`,
    result: `result-${paperId}`,
  };

  const DEFAULT_EXAM_TIME = 60 * 60;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_EXAM_TIME);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [lockReason, setLockReason] = useState("preview-limit");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [justActivated, setJustActivated] = useState(false);

  const isPremium =
    profile?.plan === "premium" || profile?.premium_status === "active";

  const accessibleQuestions = useMemo(() => {
    if (isPremium) return paperQuestions;
    return paperQuestions.slice(0, freePreviewCount);
  }, [isPremium, paperQuestions, freePreviewCount]);

  const accessibleCount = accessibleQuestions.length;
  const currentQuestion = accessibleQuestions[currentIndex];

  useEffect(() => {
    if (isPremium) {
      setShowPremiumModal(false);
    }
  }, [isPremium]);

  useEffect(() => {
    let mounted = true;
    let profileChannel = null;

    async function loadAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        router.push("/");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, email, full_name, plan, premium_status")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      setProfile(profileData || null);
      setAuthLoading(false);

      profileChannel = supabase
        .channel(`profile-live-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            const updatedProfile = payload.new;

            const becamePremium =
              updatedProfile?.plan === "premium" ||
              updatedProfile?.premium_status === "active";

            setProfile((prev) => ({
              ...prev,
              ...updatedProfile,
            }));

            if (becamePremium) {
              setJustActivated(true);
              setTimeout(() => {
                setJustActivated(false);
              }, 4000);
            }
          }
        )
        .subscribe();
    }

    loadAuth();

    return () => {
      mounted = false;
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
      }
    };
  }, [supabase, router]);

  useEffect(() => {
    if (!paperId) return;

    const savedAnswers = localStorage.getItem(STORAGE_KEYS.answers);
    const savedIndex = localStorage.getItem(STORAGE_KEYS.index);
    const savedTime = localStorage.getItem(STORAGE_KEYS.time);
    const savedFlagged = localStorage.getItem(STORAGE_KEYS.flagged);

    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedIndex) setCurrentIndex(Number(savedIndex));
    if (savedTime) setTimeLeft(Number(savedTime));
    if (savedFlagged) setFlaggedQuestions(JSON.parse(savedFlagged));
  }, [paperId]);

  useEffect(() => {
    if (!paperId) return;
    localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(answers));
  }, [answers, paperId]);

  useEffect(() => {
    if (!paperId) return;
    localStorage.setItem(STORAGE_KEYS.index, String(currentIndex));
  }, [currentIndex, paperId]);

  useEffect(() => {
    if (!paperId) return;
    localStorage.setItem(STORAGE_KEYS.time, String(timeLeft));
  }, [timeLeft, paperId]);

  useEffect(() => {
    if (!paperId) return;
    localStorage.setItem(STORAGE_KEYS.flagged, JSON.stringify(flaggedQuestions));
  }, [flaggedQuestions, paperId]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Your Pharm Tech CBT is still in progress. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (accessibleQuestions.length === 0) return;

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, accessibleQuestions.length]);

  useEffect(() => {
    if (currentIndex > accessibleCount - 1) {
      setCurrentIndex(Math.max(accessibleCount - 1, 0));
    }
  }, [accessibleCount, currentIndex]);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter(
      (key) => Number(key) < accessibleCount && answers[key] !== undefined
    ).length;
  }, [answers, accessibleCount]);

  const unansweredCount = accessibleCount - answeredCount;

  const isLowTime = timeLeft <= 5 * 60;
  const isVeryLowTime = timeLeft <= 60;

  const toggleFlag = (index) => {
    if (!isPremium && index >= freePreviewCount) {
      setLockReason("preview-limit");
      setShowPremiumModal(true);
      return;
    }

    setFlaggedQuestions((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const clearExamStorage = () => {
    localStorage.removeItem(STORAGE_KEYS.answers);
    localStorage.removeItem(STORAGE_KEYS.index);
    localStorage.removeItem(STORAGE_KEYS.time);
    localStorage.removeItem(STORAGE_KEYS.flagged);
    localStorage.removeItem(STORAGE_KEYS.submitted);
  };

  const buildResultData = () => {
    let score = 0;

    const questionReview = accessibleQuestions.map((q, index) => {
      const selectedIndex = answers[index];
      const selectedOption =
        selectedIndex !== undefined ? q.options[selectedIndex] : null;
      const isCorrect = selectedOption === q.answer;

      if (isCorrect) score++;

      return {
        questionNumber: index + 1,
        question: q.question,
        options: q.options,
        selectedIndex,
        selectedOption,
        correctAnswer: q.answer,
        isCorrect,
        wasFlagged: flaggedQuestions.includes(index),
      };
    });

    const percentage =
      accessibleQuestions.length > 0
        ? Math.round((score / accessibleQuestions.length) * 100)
        : 0;

    return {
      paperId,
      paperTitle: paper?.title || "Exam Result",
      totalQuestions: accessibleQuestions.length,
      fullPaperQuestions: paperQuestions.length,
      freePreviewCount,
      answeredCount,
      unansweredCount,
      flaggedCount: flaggedQuestions.filter((item) => item < accessibleCount)
        .length,
      score,
      percentage,
      timeUsed: DEFAULT_EXAM_TIME - timeLeft,
      timeLeft,
      submittedAt: new Date().toISOString(),
      autoSubmitted: timeLeft <= 0,
      previewMode: !isPremium,
      isPremiumUser: isPremium,
      review: questionReview,
    };
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    setShowSubmitModal(false);
    setIsSubmitting(true);

    const resultData = buildResultData();

    localStorage.setItem(STORAGE_KEYS.result, JSON.stringify(resultData));
    localStorage.setItem(STORAGE_KEYS.submitted, "true");

    clearExamStorage();

    router.push(`/result/${paperId}`);
  };

  const handleNext = () => {
    if (!isPremium && currentIndex >= freePreviewCount - 1) {
      setLockReason("preview-limit");
      setShowPremiumModal(true);
      return;
    }

    setCurrentIndex((prev) => Math.min(prev + 1, accessibleCount - 1));
  };

  const handlePaletteClick = (index) => {
    if (!isPremium && index >= freePreviewCount) {
      setLockReason("preview-limit");
      setShowPremiumModal(true);
      return;
    }

    setCurrentIndex(index);
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-100 py-8 sm:py-10">
        <Container>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-8 w-72 rounded bg-slate-200 sm:w-80" />
              <div className="h-4 w-48 rounded bg-slate-200" />
              <div className="h-48 rounded bg-slate-200" />
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (!paperId) return <div className="p-10">Paper ID not found.</div>;
  if (!paper) return <div className="p-10">Paper not found.</div>;
  if (paperQuestions.length === 0) {
    return <div className="p-10">No questions found.</div>;
  }
  if (accessibleQuestions.length === 0) {
    return <div className="p-10">No accessible questions found.</div>;
  }

  return (
    <>
      <main className="min-h-screen bg-slate-100 py-4 sm:py-6 lg:py-10">
        <Container>
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700 sm:text-xs">
                      PharmTechSuccess CBT
                    </p>

                    {!isPremium && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                        <Lock size={12} />
                        Free Preview Mode
                      </span>
                    )}

                    {isPremium && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-700">
                        <Crown size={12} />
                        Premium Access
                      </span>
                    )}
                  </div>

                  <h1 className="mt-2 text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                    {paper.title}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Pharmacy Technician Computer-Based Test Interface
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Access
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {accessibleCount} / {paperQuestions.length} Questions
                    </p>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
                      isVeryLowTime
                        ? "bg-red-100 text-red-700"
                        : isLowTime
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Clock size={16} />
                    Time Left: {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>

            {justActivated && (
              <div className="rounded-3xl border border-teal-200 bg-teal-50 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                    <Crown size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-teal-800">
                      Premium activated successfully
                    </p>
                    <p className="mt-1 text-sm text-teal-700">
                      Your account now has full access to this paper. Continue
                      your exam without limits.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isPremium && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      You are currently using the free preview
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-700">
                      You can answer the first {freePreviewCount} questions in
                      this paper. Upgrade to premium to unlock all{" "}
                      {paperQuestions.length} questions.
                    </p>
                  </div>

                  <Link
                    href="/pricing"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View Premium Access
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
              <div className="space-y-5 sm:space-y-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatCard
                    icon={ClipboardList}
                    label="Answered"
                    value={answeredCount}
                    tone="success"
                  />
                  <StatCard
                    icon={AlertCircle}
                    label="Unanswered"
                    value={unansweredCount}
                    tone="warning"
                  />
                  <StatCard
                    icon={Flag}
                    label="Flagged"
                    value={
                      flaggedQuestions.filter((item) => item < accessibleCount)
                        .length
                    }
                    tone="default"
                  />
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm text-slate-500">
                        Question {currentIndex + 1} of {accessibleCount}
                        {!isPremium && (
                          <span className="ml-2 text-amber-700">
                            · Free preview
                          </span>
                        )}
                      </p>

                      <h2 className="mt-2 text-base font-semibold leading-7 text-slate-900 sm:text-lg sm:leading-relaxed lg:text-xl">
                        {currentQuestion.question}
                      </h2>
                    </div>

                    <button
                      onClick={() => toggleFlag(currentIndex)}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                        flaggedQuestions.includes(currentIndex)
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Flag size={16} />
                      {flaggedQuestions.includes(currentIndex)
                        ? "Flagged"
                        : "Flag for review"}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = answers[currentIndex] === index;
                      const optionLetter = String.fromCharCode(65 + index);

                      return (
                        <button
                          key={index}
                          onClick={() => {
                            if (!isPremium && currentIndex >= freePreviewCount) {
                              setLockReason("preview-limit");
                              setShowPremiumModal(true);
                              return;
                            }

                            setAnswers((prev) => ({
                              ...prev,
                              [currentIndex]: index,
                            }));
                          }}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            isSelected
                              ? "border-teal-600 bg-teal-50"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                isSelected
                                  ? "bg-teal-600 text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {optionLetter}
                            </div>
                            <span className="pt-1 text-sm font-medium leading-6 text-slate-800 sm:text-base">
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentIndex === 0}
                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition ${
                      currentIndex === 0
                        ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </button>

                  <button
                    onClick={handleNext}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800"
                  >
                    {!isPremium && currentIndex >= freePreviewCount - 1
                      ? "Unlock Full Paper"
                      : "Next Question"}
                    <ArrowRight size={16} />
                  </button>
                </div>

                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
                >
                  {isPremium ? "Submit Exam" : "Submit Free Preview"}
                </button>
              </div>

              <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">
                    Candidate Instructions
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 text-teal-600"
                      />
                      <p>
                        Read each question carefully before selecting an option.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 text-teal-600"
                      />
                      <p>
                        You may move between questions at any time before
                        submission.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 text-teal-600"
                      />
                      <p>
                        Use the flag button to mark difficult questions for
                        review.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldAlert
                        size={16}
                        className="mt-0.5 text-amber-600"
                      />
                      <p>
                        When time runs out, your exam will be submitted
                        automatically.
                      </p>
                    </div>
                    {!isPremium && (
                      <div className="flex items-start gap-2">
                        <Lock size={16} className="mt-0.5 text-amber-600" />
                        <p>
                          Free users can access only the first{" "}
                          {freePreviewCount} questions in this paper.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-semibold text-slate-900">
                    Question Palette
                  </h3>

                  <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
                    {paperQuestions.map((_, index) => {
                      const isCurrent = currentIndex === index;
                      const isAnswered = answers[index] !== undefined;
                      const isFlagged = flaggedQuestions.includes(index);
                      const isLocked = !isPremium && index >= freePreviewCount;

                      return (
                        <button
                          key={index}
                          onClick={() => handlePaletteClick(index)}
                          className={`relative h-11 rounded-xl text-sm font-semibold transition ${
                            isLocked
                              ? "bg-slate-100 text-slate-400"
                              : isCurrent
                              ? "bg-teal-700 text-white"
                              : isFlagged
                              ? "bg-amber-100 text-amber-700"
                              : isAnswered
                              ? "bg-teal-100 text-teal-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {isLocked ? (
                            <Lock size={14} className="mx-auto" />
                          ) : (
                            index + 1
                          )}
                          {isFlagged && !isLocked && (
                            <span className="absolute right-1 top-1 text-[10px]">
                              ⚑
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-teal-700" />
                      Current question
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-teal-100" />
                      Answered
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-100" />
                      Unanswered
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-amber-100" />
                      Flagged for review
                    </div>
                    {!isPremium && (
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-slate-200" />
                        Locked for premium
                      </div>
                    )}
                  </div>
                </div>

                {!isPremium && (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <Crown size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-amber-800">
                          Unlock full paper access
                        </p>
                        <p className="mt-1 text-sm leading-6 text-amber-700">
                          Upgrade to premium to access all{" "}
                          {paperQuestions.length} questions and the full
                          practice flow.
                        </p>

                        <Link
                          href="/pricing"
                          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          View Premium Access
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {isLowTime && (
                  <div
                    className={`rounded-3xl border p-4 shadow-sm ${
                      isVeryLowTime
                        ? "border-red-200 bg-red-50"
                        : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        size={18}
                        className={
                          isVeryLowTime ? "text-red-600" : "text-amber-600"
                        }
                      />
                      <div>
                        <p
                          className={`font-semibold ${
                            isVeryLowTime ? "text-red-700" : "text-amber-700"
                          }`}
                        >
                          {isVeryLowTime
                            ? "Final minute warning"
                            : "Time is running low"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Review flagged and unanswered questions before
                          submitting.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SubmitModal
        open={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmit}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        flaggedCount={
          flaggedQuestions.filter((item) => item < accessibleCount).length
        }
        timeLeft={timeLeft}
        formatTime={formatTime}
        isPremium={isPremium}
        accessibleCount={accessibleCount}
        paperQuestionsLength={paperQuestions.length}
        previewMode={!isPremium}
      />

      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        lockReason={lockReason}
        freePreviewCount={freePreviewCount}
        paperQuestionsLength={paperQuestions.length}
      />
    </>
  );
}