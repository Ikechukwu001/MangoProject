import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  FileText,
  Lock,
  BadgeCheck,
  AlertCircle,
  BookOpen,
  Sparkles,
  ChevronRight,
  Star,
  Zap,
  Shield,
  BarChart3,
  CircleCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";
import getPaperById from "@/lib/getPaperById";
import { createClient } from "@/src/lib/supabase/server";

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

const StatCard = ({ icon: Icon, label, value, accent = false }) => (
  <div
    className={`flex flex-col gap-1.5 rounded-2xl px-5 py-4 ${
      accent
        ? "bg-teal-700 text-white"
        : "bg-slate-50 border border-slate-100"
    }`}
  >
    <div className={`flex items-center gap-2 text-xs font-medium tracking-wide uppercase ${accent ? "text-teal-200" : "text-slate-400"}`}>
      <Icon size={13} />
      {label}
    </div>
    <p className={`text-2xl font-bold tracking-tight ${accent ? "text-white" : "text-slate-800"}`}>
      {value}
    </p>
  </div>
);

const PremiumFeature = ({ children }) => (
  <li className="flex items-start gap-3 text-sm text-slate-600">
    <CircleCheck size={16} className="mt-0.5 shrink-0 text-teal-600" />
    {children}
  </li>
);

export default async function PaperDetailsPage({ params }) {
  const { paperId } = params;
  const paper = getPaperById(paperId);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, premium_status, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const isPremium =
    profile?.plan === "premium" || profile?.premium_status === "active";
  const isPending = profile?.premium_status === "pending";

  if (!paper) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-24">
        <Container>
          <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <FileText size={28} className="text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Paper not found</h1>
            <p className="mt-3 text-slate-500">
              The paper you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/papers"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              <ArrowLeft size={15} />
              Back to Papers
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  const lockedQuestions = paper.totalQuestions - paper.freeQuestions;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 sm:py-20">
      <Container>

        {/* ── BREADCRUMB ── */}
        <Link
          href="/papers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft size={15} />
          Back to Papers
        </Link>

        {/* ── STATUS BANNER ── */}
        <div className="mt-7">
          {isPending && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
              <AlertCircle size={17} className="shrink-0 text-amber-600" />
              <p className="text-sm font-medium text-amber-800">
                Your premium request is under review. You can access the free preview in the meantime.
              </p>
            </div>
          )}
          {!isPending && !isPremium && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
              <Lock size={17} className="shrink-0 text-slate-400" />
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{paper.freeQuestions} questions</span> are available on the free plan.{" "}
                <Link href="/pricing" className="font-semibold text-teal-700 hover:underline">
                  Upgrade to unlock all {paper.totalQuestions}.
                </Link>
              </p>
            </div>
          )}
          {isPremium && (
            <div className="flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3.5">
              <BadgeCheck size={17} className="shrink-0 text-teal-600" />
              <p className="text-sm font-semibold text-teal-800">
                Premium active — you have full access to all {paper.totalQuestions} questions.
              </p>
            </div>
          )}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">

          {/* ────── LEFT COLUMN ────── */}
          <div className="space-y-5">

            {/* HERO CARD */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-8 py-9 shadow-sm">
              {/* subtle background detail */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-teal-50 opacity-60" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-slate-50" />

              <div className="relative">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <BookOpen size={12} />
                  {paper.year ?? "Past Paper"}
                </div>

                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                  {paper.title}
                </h1>

                <p className="mt-4 max-w-prose text-base leading-relaxed text-slate-500">
                  {paper.description}
                </p>

                {/* STATS ROW */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCard icon={Clock} label="Duration" value={formatDuration(paper.duration)} />
                  <StatCard icon={FileText} label="Questions" value={paper.totalQuestions} accent />
                  <StatCard icon={Sparkles} label="Free" value={paper.freeQuestions} />
                  <StatCard icon={BarChart3} label="Year" value={paper.year} />
                </div>
              </div>
            </div>

            {/* WHAT'S INCLUDED TABLE */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">What's included</h2>
              <div className="mt-5 space-y-3">
                {/* Free tier row */}
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200">
                      <Sparkles size={16} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Free Preview</p>
                      <p className="text-xs text-slate-500">{paper.freeQuestions} questions · No account required</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Available
                  </span>
                </div>

                {/* Premium tier row */}
                <div className={`flex items-center justify-between rounded-2xl px-5 py-4 ${isPremium ? "bg-teal-50 border border-teal-100" : "bg-slate-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${isPremium ? "bg-teal-700 border-teal-700" : "bg-white border-slate-200"}`}>
                      <Zap size={16} className={isPremium ? "text-white" : "text-slate-400"} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Full Exam</p>
                      <p className="text-xs text-slate-500">
                        All {paper.totalQuestions} questions · Detailed results · CBT experience
                      </p>
                    </div>
                  </div>
                  {isPremium ? (
                    <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
                      Unlocked
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                      Premium
                    </span>
                  )}
                </div>

                {/* Score analytics */}
                <div className={`flex items-center justify-between rounded-2xl px-5 py-4 ${isPremium ? "bg-teal-50 border border-teal-100" : "bg-slate-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${isPremium ? "bg-teal-700 border-teal-700" : "bg-white border-slate-200"}`}>
                      <BarChart3 size={16} className={isPremium ? "text-white" : "text-slate-400"} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Score Analytics</p>
                      <p className="text-xs text-slate-500">Performance breakdown & topic insights</p>
                    </div>
                  </div>
                  {isPremium ? (
                    <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
                      Unlocked
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ────── RIGHT COLUMN (SIDEBAR) ────── */}
          <aside className="space-y-5">

            {/* START CARD */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm">
              <div className="mb-1 flex items-center gap-2">
                {isPremium ? (
                  <BadgeCheck size={18} className="text-teal-600" />
                ) : (
                  <Star size={18} className="text-slate-400" />
                )}
                <h2 className="text-lg font-bold text-slate-900">
                  {isPremium ? "Ready to start" : "Start for free"}
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {isPremium
                  ? "Full access to all questions is active."
                  : `Try ${paper.freeQuestions} questions at no cost.`}
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href={`/exam/${paper.id}`}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 active:scale-[0.98]"
                >
                  {isPremium ? "Start Full Exam" : `Start Free Preview`}
                  <ChevronRight size={15} className="transition group-hover:translate-x-0.5" />
                </Link>

                {!isPremium && (
                  <Link
                    href="/pricing"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
                  >
                    <Lock size={14} />
                    Unlock Full Access
                  </Link>
                )}
              </div>

              {!isPremium && (
                <p className="mt-4 text-center text-xs text-slate-400">
                  {lockedQuestions} questions locked behind premium
                </p>
              )}
            </div>

            {/* UPGRADE CARD — only for non-premium */}
            {!isPremium && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-7 text-white shadow-md">
                {/* decorative circles */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-teal-500/10" />
                <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />

                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1.5 text-xs font-semibold text-teal-300 uppercase tracking-wide">
                    <Shield size={11} />
                    Premium Plan
                  </div>

                  <h3 className="text-xl font-bold leading-snug">
                    Unlock the full<br />exam experience
                  </h3>

                  <ul className="mt-5 space-y-2.5">
                    <PremiumFeature>All {paper.totalQuestions} questions with explanations</PremiumFeature>
                    <PremiumFeature>In-depth score analytics</PremiumFeature>
                    <PremiumFeature>Realistic CBT simulation</PremiumFeature>
                    <PremiumFeature>Access to every past paper</PremiumFeature>
                  </ul>

                  <Link
                    href="/pricing"
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-teal-400 active:scale-[0.98]"
                  >
                    Upgrade Now
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
            )}

            {/* PREMIUM CONFIRMED CARD */}
            {isPremium && (
              <div className="rounded-3xl border border-teal-100 bg-teal-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600">
                    <BadgeCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-teal-900">Premium Active</p>
                    <p className="text-xs text-teal-700 mt-0.5">
                      You have unlimited access to all papers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* QUICK INFO */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                Paper Details
              </h3>
              <dl className="space-y-3 text-sm">
                {[
                  { label: "Duration", value: formatDuration(paper.duration) },
                  { label: "Total Questions", value: paper.totalQuestions },
                  { label: "Free Questions", value: paper.freeQuestions },
                  { label: "Year", value: paper.year },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="font-semibold text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

          </aside>
        </div>
      </Container>
    </main>
  );
}