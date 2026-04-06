"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  Trophy,
  AlertTriangle,
  ArrowLeft,
  Printer,
  BadgeCheck,
  BadgeX,
  Download,
  Crown,
  Lock,
  Sparkles,
  ShieldCheck,
  FileText,
  Target,
  BarChart3,
  CalendarDays,
  Medal,
} from "lucide-react";
import Container from "@/components/layout/Container";

function StatCard({ icon: Icon, label, value, subtext, tone = "default" }) {
  const toneClasses =
    tone === "success"
      ? "bg-teal-50 text-teal-700 border-teal-100"
      : tone === "danger"
      ? "bg-red-50 text-red-700 border-red-100"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
      </div>

      <div className={`mt-4 rounded-2xl border px-4 py-4 ${toneClasses}`}>
        <p className="text-2xl font-bold sm:text-3xl">{value}</p>
        {subtext ? <p className="mt-1 text-xs font-medium opacity-80">{subtext}</p> : null}
      </div>
    </div>
  );
}

function ResultSlipCard({ label, value, wide = false }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-900 sm:text-base">
        {value}
      </p>
    </div>
  );
}

export default function ResultPage() {
  const params = useParams();
  const paperId = params?.paperId;

  const [result, setResult] = useState(null);
  const slipRef = useRef(null);

  useEffect(() => {
    if (!paperId) return;

    const savedResult = localStorage.getItem(`result-${paperId}`);
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, [paperId]);

  const formatTimeUsed = (seconds) => {
    const mins = Math.floor((seconds || 0) / 60);
    const secs = (seconds || 0) % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const performanceLabel = useMemo(() => {
    if (!result) return "";
    if (result.percentage >= 80) return "Excellent Performance";
    if (result.percentage >= 60) return "Very Good Performance";
    if (result.percentage >= 50) return "Good Performance";
    if (result.percentage >= 40) return "Fair Performance";
    return "Needs Improvement";
  }, [result]);

  const passMark = 50;
  const passed = result ? result.percentage >= passMark : false;
  const isPreviewMode = !!result?.previewMode;
  const fullPaperQuestions = result?.fullPaperQuestions || result?.totalQuestions;
  const previewCount = result?.freePreviewCount || result?.totalQuestions;
  const wrongAnswers = result ? Math.max(result.answeredCount - result.score, 0) : 0;

  const submittedDate = result?.submittedAt
    ? new Date(result.submittedAt).toLocaleString()
    : "N/A";

  const handlePrintSlip = () => {
    const printContents = slipRef.current?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>PharmTechSuccess Premium Result Slip</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 24px;
              background: #f1f5f9;
              color: #0f172a;
              font-family: Inter, Arial, Helvetica, sans-serif;
            }

            .print-shell {
              max-width: 980px;
              margin: 0 auto;
            }

            .slip {
              background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
              border: 1px solid #dbeafe;
              border-radius: 28px;
              overflow: hidden;
              box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
            }

            .hero {
              padding: 30px 30px 24px;
              background:
                radial-gradient(circle at top right, rgba(20,184,166,0.12), transparent 28%),
                radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 30%),
                linear-gradient(135deg, #0f172a 0%, #111827 45%, #0f766e 100%);
              color: #ffffff;
            }

            .brandline {
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: #99f6e4;
              margin-bottom: 10px;
            }

            .title {
              margin: 0;
              font-size: 30px;
              font-weight: 800;
              line-height: 1.15;
            }

            .subtitle {
              margin-top: 10px;
              font-size: 14px;
              line-height: 1.7;
              color: rgba(255,255,255,0.82);
            }

            .hero-row {
              margin-top: 20px;
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }

            .hero-badge {
              display: inline-flex;
              align-items: center;
              padding: 10px 16px;
              border-radius: 999px;
              font-size: 12px;
              font-weight: 700;
              border: 1px solid rgba(255,255,255,0.14);
              background: rgba(255,255,255,0.08);
              color: #ffffff;
            }

            .body {
              padding: 28px;
            }

            .score-panel {
              display: grid;
              grid-template-columns: 1.15fr 0.85fr;
              gap: 16px;
              margin-bottom: 18px;
            }

            .score-main,
            .score-side {
              border: 1px solid #e2e8f0;
              border-radius: 22px;
              background: #ffffff;
              padding: 22px;
            }

            .mini-label {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: #64748b;
            }

            .big-score {
              margin-top: 12px;
              font-size: 52px;
              line-height: 1;
              font-weight: 800;
              color: #0f172a;
            }

            .score-sub {
              margin-top: 8px;
              font-size: 15px;
              color: #475569;
            }

            .progress-wrap {
              margin-top: 18px;
            }

            .progress-track {
              width: 100%;
              height: 14px;
              border-radius: 999px;
              background: #e2e8f0;
              overflow: hidden;
            }

            .progress-fill {
              height: 100%;
              border-radius: 999px;
              background: ${passed ? "#0f766e" : "#dc2626"};
              width: ${result?.percentage || 0}%;
            }

            .status-badge {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              padding: 18px 16px;
              border-radius: 20px;
              font-size: 22px;
              font-weight: 800;
              background: ${passed ? "#dcfce7" : "#fee2e2"};
              color: ${passed ? "#166534" : "#991b1b"};
              margin-top: 18px;
            }

            .status-note {
              margin-top: 14px;
              font-size: 14px;
              line-height: 1.7;
              color: #475569;
            }

            .metrics {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 14px;
              margin-top: 18px;
              margin-bottom: 18px;
            }

            .metric {
              border: 1px solid #e2e8f0;
              background: #f8fafc;
              border-radius: 18px;
              padding: 16px;
            }

            .metric-label {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: #64748b;
            }

            .metric-value {
              margin-top: 10px;
              font-size: 24px;
              font-weight: 800;
              color: #0f172a;
            }

            .details-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 14px;
              margin-top: 6px;
            }

            .detail-card {
              border: 1px solid #e2e8f0;
              border-radius: 18px;
              padding: 16px;
              background: #ffffff;
            }

            .detail-card.wide {
              grid-column: span 2;
            }

            .detail-label {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: #64748b;
            }

            .detail-value {
              margin-top: 10px;
              font-size: 15px;
              font-weight: 700;
              line-height: 1.7;
              color: #0f172a;
            }

            .note-box {
              margin-top: 18px;
              padding: 16px 18px;
              border-radius: 18px;
              border: 1px dashed #cbd5e1;
              background: #f8fafc;
              font-size: 13px;
              line-height: 1.8;
              color: #475569;
            }

            .footer {
              margin-top: 20px;
              padding-top: 18px;
              border-top: 1px dashed #cbd5e1;
              display: flex;
              justify-content: space-between;
              gap: 16px;
              flex-wrap: wrap;
              font-size: 12px;
              color: #64748b;
            }

            @media print {
              body {
                padding: 0;
                background: #ffffff;
              }

              .print-shell {
                max-width: 100%;
              }

              .slip {
                box-shadow: none;
                border-radius: 0;
                border: none;
              }
            }

            @media (max-width: 700px) {
              .score-panel,
              .details-grid,
              .metrics {
                grid-template-columns: 1fr;
              }

              .detail-card.wide {
                grid-column: span 1;
              }

              .hero,
              .body {
                padding: 20px;
              }

              .big-score {
                font-size: 40px;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-shell">
            ${printContents}
          </div>
          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-100 py-10">
        <Container>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Result not found</h1>
            <p className="mt-2 text-slate-600">
              No saved result was found for this paper.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white"
            >
              Go Home
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 py-5 sm:py-6 lg:py-10">
      <Container>
        <div className="space-y-5 sm:space-y-6">
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.10),transparent_24%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_28%)]" />
            <div className="relative p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700 sm:text-xs">
                      PharmTechSuccess Result Centre
                    </p>

                    {isPreviewMode ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                        <Lock size={12} />
                        Free Preview Result
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-700">
                        <Crown size={12} />
                        Full Paper Result
                      </span>
                    )}
                  </div>

                  <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                    {result.paperTitle}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    {isPreviewMode
                      ? `This result reflects your performance on the first ${previewCount} accessible questions from this paper.`
                      : "Official Pharmacy Technician CBT performance summary, review breakdown, and printable premium result sheet."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                      <CalendarDays size={14} />
                      {submittedDate}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                      <ShieldCheck size={14} />
                      Pass mark: {passMark}%
                    </span>
                  </div>
                </div>

                <div
                  className={`inline-flex w-fit items-center gap-3 rounded-[22px] px-5 py-4 text-sm font-bold shadow-sm ${
                    passed
                      ? "bg-teal-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {passed ? <BadgeCheck size={20} /> : <BadgeX size={20} />}
                  {passed ? "PASS" : "FAIL"}
                </div>
              </div>
            </div>
          </div>

          {isPreviewMode && (
            <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800">
                      You completed the preview version only
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-700">
                      This result covers {result.totalQuestions} question
                      {result.totalQuestions !== 1 ? "s" : ""} out of the full{" "}
                      {fullPaperQuestions}-question paper. Upgrade to premium to
                      unlock the full paper and get a more complete performance review.
                    </p>
                  </div>
                </div>

                <Link
                  href="/pricing"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View Premium Access
                  <Crown size={16} />
                </Link>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Trophy}
              label="Score"
              value={`${result.score}/${result.totalQuestions}`}
              subtext={`${result.percentage}% overall`}
              tone={passed ? "success" : "danger"}
            />
            <StatCard
              icon={CheckCircle2}
              label="Answered"
              value={result.answeredCount}
              subtext="Questions attempted"
              tone="success"
            />
            <StatCard
              icon={AlertTriangle}
              label="Unanswered"
              value={result.unansweredCount}
              subtext="Questions skipped"
              tone="warning"
            />
            <StatCard
              icon={Clock3}
              label="Time Used"
              value={formatTimeUsed(result.timeUsed)}
              subtext="Completion duration"
              tone="default"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.18fr_0.82fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Performance Overview
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {isPreviewMode
                      ? "Preview performance based only on the free accessible questions."
                      : "Overall score quality, accuracy, and final benchmark assessment."}
                  </p>
                </div>

                <div
                  className={`inline-flex rounded-2xl px-4 py-2 text-sm font-semibold ${
                    passed
                      ? "bg-teal-50 text-teal-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {performanceLabel}
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Overall Percentage
                    </p>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                      {result.percentage}%
                    </p>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                      passed
                        ? "bg-teal-100 text-teal-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <Target size={16} />
                    {passed ? "Above pass benchmark" : "Below pass benchmark"}
                  </div>
                </div>

                <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      passed ? "bg-teal-600" : "bg-red-600"
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Correct
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {result.score}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Wrong
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {wrongAnswers}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Flagged
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {result.flaggedCount}
                    </p>
                  </div>
                </div>
              </div>

              {isPreviewMode && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">
                    Preview scope
                  </p>
                  <p className="mt-1 text-sm leading-6 text-amber-700">
                    You attempted {result.totalQuestions} question
                    {result.totalQuestions !== 1 ? "s" : ""} from a full paper of{" "}
                    {fullPaperQuestions} questions.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Final Status
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Decision based on the official {passMark}% pass mark.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Medal size={18} />
                </div>
              </div>

              <div
                className={`mt-6 rounded-[24px] p-5 ${
                  passed ? "bg-teal-50" : "bg-red-50"
                }`}
              >
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                    passed
                      ? "bg-teal-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {passed ? <BadgeCheck size={18} /> : <BadgeX size={18} />}
                  {passed ? "PASS" : "FAIL"}
                </div>

                <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                  {performanceLabel}
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {isPreviewMode
                    ? passed
                      ? "Strong preview performance. Unlock the full paper to test yourself across the complete exam."
                      : "This preview result highlights weak areas early. Unlock the full paper to practice deeper."
                    : passed
                    ? "Congratulations. Your performance meets the benchmark for this Pharm Tech CBT."
                    : "Your score is below the required benchmark. Review corrections carefully and retake the paper."}
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  onClick={handlePrintSlip}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  <Printer size={18} />
                  Print Premium Result Slip
                </button>

                <button
                  onClick={handlePrintSlip}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Download size={18} />
                  Download / Save Result Slip
                </button>

                {isPreviewMode && (
                  <Link
                    href="/pricing"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
                  >
                    <Crown size={18} />
                    Unlock Full Paper
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div
            ref={slipRef}
            className="print-slip-shell overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm"
          >
            <div className="bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_24%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_28%),linear-gradient(135deg,#0f172a_0%,#111827_45%,#0f766e_100%)] px-5 py-6 text-white sm:px-6 sm:py-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-200">
                PharmTechSuccess Official Result Sheet
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {isPreviewMode ? "CBT Preview Result Slip" : "Premium CBT Result Slip"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-200">
                Pharmacy Technician Computer-Based Test official performance sheet.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {isPreviewMode ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white">
                    <Lock size={14} />
                    Free Preview Result
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white">
                    <Crown size={14} />
                    Full Premium Result
                  </span>
                )}

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white">
                  <ShieldCheck size={14} />
                  Verified CBT Sheet
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 lg:p-8">
              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Overall Score
                  </p>
                  <p className="mt-3 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                    {result.percentage}%
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {result.score} correct answer{result.score !== 1 ? "s" : ""} out of{" "}
                    {result.totalQuestions} question{result.totalQuestions !== 1 ? "s" : ""}.
                  </p>

                  <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${
                        passed ? "bg-teal-600" : "bg-red-600"
                      }`}
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Performance
                      </p>
                      <p className="mt-2 text-base font-bold text-slate-900">
                        {performanceLabel}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Final Status
                      </p>
                      <p
                        className={`mt-2 text-base font-bold ${
                          passed ? "text-teal-700" : "text-red-700"
                        }`}
                      >
                        {passed ? "PASS" : "FAIL"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Candidate Summary
                  </p>

                  <div
                    className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[20px] px-4 py-4 text-lg font-bold ${
                      passed
                        ? "bg-teal-100 text-teal-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {passed ? <BadgeCheck size={20} /> : <BadgeX size={20} />}
                    {passed ? "PASS" : "FAIL"}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Answered
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {result.answeredCount}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Unanswered
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {result.unansweredCount}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Wrong
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {wrongAnswers}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Time Used
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {formatTimeUsed(result.timeUsed)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ResultSlipCard label="Exam Paper" value={result.paperTitle} wide />
                <ResultSlipCard
                  label="Submission Type"
                  value={result.autoSubmitted ? "Auto Submitted" : "Manual Submission"}
                />
                <ResultSlipCard
                  label="Submitted At"
                  value={submittedDate}
                />
                <ResultSlipCard
                  label="Pass Benchmark"
                  value={`${passMark}%`}
                />
                <ResultSlipCard
                  label="Question Scope"
                  value={
                    isPreviewMode
                      ? `${result.totalQuestions} preview questions out of ${fullPaperQuestions} total questions`
                      : `${result.totalQuestions} full paper questions`
                  }
                />
              </div>

              <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <FileText size={18} className="mt-0.5 shrink-0 text-slate-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Official Note
                    </p>
                    <p className="mt-1 text-sm leading-7 text-slate-600">
                      This sheet was generated by the PharmTechSuccess CBT Platform and
                      summarizes the candidate’s performance for this paper.
                      {isPreviewMode
                        ? " Since this is a preview attempt, it reflects only the accessible portion of the paper."
                        : " This result reflects the full completed paper attempt."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-dashed border-slate-300 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>Generated by PharmTechSuccess CBT Platform</p>
                <p>Result sheet reference: PTS-RESULT-{paperId}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  Question Review
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Review every question, your selected answer, and the correct answer.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {isPreviewMode && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                    <Lock size={14} />
                    Preview Review
                  </span>
                )}

                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                  <BarChart3 size={14} />
                  {result.review.length} reviewed question{result.review.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {result.review.map((item) => (
                <div
                  key={item.questionNumber}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/60 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Question {item.questionNumber}
                      </p>
                      <h3 className="mt-2 text-base font-semibold leading-7 text-slate-900 sm:text-lg">
                        {item.question}
                      </h3>
                    </div>

                    <div
                      className={`inline-flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                        item.isCorrect
                          ? "bg-teal-100 text-teal-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isCorrect ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      {item.isCorrect ? "Correct" : "Incorrect"}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {item.options.map((option, index) => {
                      const optionLetter = String.fromCharCode(65 + index);
                      const isSelected = item.selectedIndex === index;
                      const isCorrectOption = item.correctAnswer === option;

                      return (
                        <div
                          key={index}
                          className={`rounded-2xl border p-4 text-sm leading-6 sm:text-[15px] ${
                            isCorrectOption
                              ? "border-teal-300 bg-teal-50"
                              : isSelected
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                              {optionLetter}
                            </span>
                            <span className="font-medium text-slate-800">{option}</span>

                            {isSelected && (
                              <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-slate-600">
                                Your answer
                              </span>
                            )}

                            {isCorrectOption && (
                              <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-teal-700">
                                Correct answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {item.selectedOption === null && (
                    <p className="mt-3 text-sm font-medium text-amber-700">
                      You did not answer this question.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/papers"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
            >
              <ArrowLeft size={16} />
              Back to Papers
            </Link>

            <Link
              href={`/exam/${paperId}`}
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              {isPreviewMode ? "Retake Preview" : "Retake Exam"}
            </Link>

            {isPreviewMode && (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                <Crown size={16} />
                Unlock Full Paper
              </Link>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}