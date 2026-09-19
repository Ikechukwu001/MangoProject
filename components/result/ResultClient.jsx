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

  // Load Cormorant Garamond for the result slip
  useEffect(() => {
    const id = "cormorant-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

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
    const accentColor = passed ? "#0f766e" : "#b91c1c";
    const accentLight = passed ? "#ccfbf1" : "#fee2e2";
    const accentMid = passed ? "#0d9488" : "#dc2626";
    const statusWord = passed ? "PASS" : "FAIL";
    const pct = result?.percentage || 0;
    const barWidth = pct;

    const printWindow = window.open("", "_blank", "width=1100,height=900");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PharmTechSuccess — Official CBT Result Certificate</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --accent-light: ${accentLight};
      --accent-mid: ${accentMid};
      --ink: #1a1a2e;
      --ink-2: #374151;
      --ink-3: #6b7280;
      --rule: #d4c5a9;
      --paper: #fffef9;
      --paper-2: #faf8f2;
      --border: #e8e0d0;
      --serif: 'Cormorant Garamond', Georgia, serif;
      --sans: 'DM Sans', system-ui, sans-serif;
    }

    @page {
      size: A4;
      margin: 0;
    }

    html, body {
      width: 210mm;
      min-height: 297mm;
      background: #e8e3d8;
      font-family: var(--sans);
      color: var(--ink);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      background: var(--paper);
      position: relative;
      overflow: hidden;
    }

    /* ── Decorative corner ornaments ── */
    .corner {
      position: absolute;
      width: 80px;
      height: 80px;
    }
    .corner-tl { top: 18px; left: 18px; border-top: 2.5px solid var(--accent); border-left: 2.5px solid var(--accent); border-radius: 4px 0 0 0; }
    .corner-tr { top: 18px; right: 18px; border-top: 2.5px solid var(--accent); border-right: 2.5px solid var(--accent); border-radius: 0 4px 0 0; }
    .corner-bl { bottom: 18px; left: 18px; border-bottom: 2.5px solid var(--accent); border-left: 2.5px solid var(--accent); border-radius: 0 0 0 4px; }
    .corner-br { bottom: 18px; right: 18px; border-bottom: 2.5px solid var(--accent); border-right: 2.5px solid var(--accent); border-radius: 0 0 4px 0; }

    /* ── Outer border rule ── */
    .page-border {
      position: absolute;
      inset: 10px;
      border: 1px solid var(--rule);
      pointer-events: none;
    }

    /* ── Background watermark ── */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-family: var(--serif);
      font-size: 110px;
      font-weight: 700;
      color: ${passed ? "rgba(13,148,136,0.045)" : "rgba(185,28,28,0.045)"};
      letter-spacing: 0.08em;
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
    }

    /* ── Header band ── */
    .header-band {
      background: var(--ink);
      padding: 0 40px;
      height: 7px;
    }
    .header-accent-line {
      height: 3px;
      background: linear-gradient(90deg, var(--accent) 0%, transparent 100%);
    }

    /* ── Main content ── */
    .content {
      padding: 32px 44px 28px;
      position: relative;
    }

    /* ── Masthead ── */
    .masthead {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
      padding-bottom: 22px;
      border-bottom: 1px solid var(--border);
    }

    .brand-block {}
    .brand-eyebrow {
      font-family: var(--sans);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 6px;
    }
    .brand-name {
      font-family: var(--serif);
      font-size: 26px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1.1;
    }
    .brand-sub {
      font-family: var(--sans);
      font-size: 10.5px;
      color: var(--ink-3);
      margin-top: 4px;
      font-weight: 400;
      letter-spacing: 0.01em;
    }

    .status-medallion {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 84px;
      height: 84px;
      border-radius: 50%;
      border: 3px solid ${accentColor};
      background: ${accentLight};
      flex-shrink: 0;
    }
    .medallion-word {
      font-family: var(--serif);
      font-size: 22px;
      font-weight: 700;
      color: ${accentColor};
      line-height: 1;
    }
    .medallion-sub {
      font-family: var(--sans);
      font-size: 7.5px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: ${accentColor};
      margin-top: 3px;
      opacity: 0.8;
    }

    /* ── Document title zone ── */
    .doc-title-zone {
      text-align: center;
      padding: 20px 0 16px;
      border-bottom: 1px solid var(--border);
      position: relative;
    }
    .doc-title-eyebrow {
      font-family: var(--sans);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--ink-3);
      margin-bottom: 8px;
    }
    .doc-title {
      font-family: var(--serif);
      font-size: 32px;
      font-weight: 600;
      color: var(--ink);
      letter-spacing: 0.02em;
      line-height: 1.15;
    }
    .doc-title em {
      font-style: italic;
      color: var(--accent);
    }
    .doc-ornament {
      margin: 10px auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: var(--rule);
    }
    .doc-ornament-line { flex: 1; max-width: 60px; height: 1px; background: var(--rule); }
    .doc-ornament-diamond {
      width: 6px; height: 6px;
      background: var(--accent);
      transform: rotate(45deg);
      flex-shrink: 0;
    }

    /* ── Score hero ── */
    .score-hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 18px 0;
    }

    .score-main-block {
      background: var(--paper-2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px 22px;
      position: relative;
      overflow: hidden;
    }
    .score-main-block::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 4px; height: 100%;
      background: var(--accent);
      border-radius: 4px 0 0 4px;
    }
    .score-eyebrow {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: var(--ink-3);
      margin-bottom: 6px;
    }
    .score-number {
      font-family: var(--serif);
      font-size: 64px;
      font-weight: 700;
      line-height: 1;
      color: var(--ink);
      letter-spacing: -0.02em;
    }
    .score-number span {
      font-size: 36px;
      color: var(--ink-3);
    }
    .score-fraction {
      font-size: 13px;
      color: var(--ink-3);
      margin-top: 4px;
      font-weight: 400;
    }

    .progress-outer {
      margin-top: 14px;
      height: 6px;
      background: var(--border);
      border-radius: 99px;
      overflow: hidden;
    }
    .progress-inner {
      height: 100%;
      width: ${barWidth}%;
      background: linear-gradient(90deg, var(--accent-mid), var(--accent));
      border-radius: 99px;
    }

    .score-right-block {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .stat-pill {
      flex: 1;
      background: var(--paper-2);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stat-pill-label {
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--ink-3);
    }
    .stat-pill-value {
      font-family: var(--serif);
      font-size: 22px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1;
    }

    /* ── Horizontal rule with diamond ── */
    .hr-diamond {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 4px 0 16px;
    }
    .hr-diamond-line { flex: 1; height: 1px; background: var(--border); }
    .hr-diamond-shape {
      width: 7px; height: 7px;
      border: 1.5px solid var(--accent);
      transform: rotate(45deg);
      flex-shrink: 0;
    }

    /* ── Performance label ── */
    .perf-label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--accent-light);
      border: 1px solid var(--accent);
      border-radius: 8px;
      padding: 12px 18px;
      margin-bottom: 16px;
    }
    .perf-label-left {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .perf-label-right {
      font-family: var(--serif);
      font-size: 17px;
      font-weight: 700;
      color: ${accentColor};
      letter-spacing: 0.01em;
    }

    /* ── Details table ── */
    .details-section-title {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--ink-3);
      margin-bottom: 10px;
    }

    .details-table {
      width: 100%;
      border-collapse: collapse;
    }
    .details-table tr {
      border-bottom: 1px solid var(--border);
    }
    .details-table tr:last-child {
      border-bottom: none;
    }
    .details-table td {
      padding: 9px 0;
      font-size: 12px;
      line-height: 1.5;
    }
    .details-table td:first-child {
      font-weight: 600;
      color: var(--ink-3);
      width: 42%;
      font-size: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .details-table td:last-child {
      font-weight: 500;
      color: var(--ink);
    }

    /* ── Official note ── */
    .official-note {
      margin-top: 16px;
      padding: 13px 16px;
      background: var(--paper-2);
      border-left: 3px solid var(--accent);
      border-radius: 0 8px 8px 0;
    }
    .official-note-title {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 5px;
    }
    .official-note p {
      font-size: 11px;
      line-height: 1.7;
      color: var(--ink-3);
    }

    /* ── Footer ── */
    .doc-footer {
      margin-top: 20px;
      padding-top: 14px;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .footer-left {
      font-size: 9.5px;
      color: var(--ink-3);
      font-weight: 400;
    }
    .footer-left strong { font-weight: 600; color: var(--ink-2); }
    .footer-ref {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--ink-3);
      background: var(--paper-2);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 5px 10px;
    }
    .footer-brand {
      font-family: var(--serif);
      font-size: 13px;
      font-weight: 600;
      color: var(--accent);
      letter-spacing: 0.01em;
    }

    /* ── Bottom band ── */
    .bottom-band {
      height: 7px;
      background: var(--ink);
    }
    .bottom-accent-line {
      height: 3px;
      background: linear-gradient(90deg, transparent 0%, var(--accent) 100%);
    }

    @media print {
      html, body { background: white; width: 100%; }
      .page { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="page-border"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="watermark">${statusWord}</div>

    <div class="header-band"></div>
    <div class="header-accent-line"></div>

    <div class="content">

      <!-- Masthead -->
      <div class="masthead">
        <div class="brand-block">
          <div class="brand-eyebrow">Official Performance Certificate</div>
          <div class="brand-name">PharmTech<em style="font-style:italic;color:var(--accent)">Success</em></div>
          <div class="brand-sub">Pharmacy Technician Computer-Based Test Platform</div>
        </div>
        <div class="status-medallion">
          <div class="medallion-word">${statusWord}</div>
          <div class="medallion-sub">${passed ? "Passed" : "Failed"}</div>
        </div>
      </div>

      <!-- Document title -->
      <div class="doc-title-zone">
        <div class="doc-title-eyebrow">CBT Performance Result Sheet</div>
        <div class="doc-title">${result?.paperTitle || "Pharmacy Technician CBT"}</div>
        <div class="doc-ornament">
          <div class="doc-ornament-line"></div>
          <div class="doc-ornament-diamond"></div>
          <div class="doc-ornament-line"></div>
        </div>
      </div>

      <!-- Score hero -->
      <div class="score-hero">
        <div class="score-main-block">
          <div class="score-eyebrow">Overall Score</div>
          <div class="score-number">${pct}<span>%</span></div>
          <div class="score-fraction">${result?.score} correct out of ${result?.totalQuestions} questions</div>
          <div class="progress-outer">
            <div class="progress-inner"></div>
          </div>
        </div>

        <div class="score-right-block">
          <div class="stat-pill">
            <div class="stat-pill-label">Correct</div>
            <div class="stat-pill-value">${result?.score}</div>
          </div>
          <div class="stat-pill">
            <div class="stat-pill-label">Wrong</div>
            <div class="stat-pill-value">${result ? Math.max(result.answeredCount - result.score, 0) : 0}</div>
          </div>
          <div class="stat-pill">
            <div class="stat-pill-label">Unanswered</div>
            <div class="stat-pill-value">${result?.unansweredCount ?? 0}</div>
          </div>
          <div class="stat-pill">
            <div class="stat-pill-label">Time Used</div>
            <div class="stat-pill-value" style="font-size:16px;">${formatTimeUsed(result?.timeUsed)}</div>
          </div>
        </div>
      </div>

      <!-- Performance label -->
      <div class="hr-diamond">
        <div class="hr-diamond-line"></div>
        <div class="hr-diamond-shape"></div>
        <div class="hr-diamond-line"></div>
      </div>

      <div class="perf-label-row">
        <div class="perf-label-left">Performance Assessment</div>
        <div class="perf-label-right">${passed ? (pct >= 80 ? "Excellent Performance" : pct >= 60 ? "Very Good Performance" : "Good Performance") : (pct >= 40 ? "Fair Performance" : "Needs Improvement")}</div>
      </div>

      <!-- Details table -->
      <div class="details-section-title">Examination Details</div>
      <table class="details-table">
        <tr>
          <td>Exam Paper</td>
          <td>${result?.paperTitle || "—"}</td>
        </tr>
        <tr>
          <td>Submission Type</td>
          <td>${result?.autoSubmitted ? "Auto Submitted (Time Expired)" : "Manual Submission"}</td>
        </tr>
        <tr>
          <td>Submitted At</td>
          <td>${result?.submittedAt ? new Date(result.submittedAt).toLocaleString() : "N/A"}</td>
        </tr>
        <tr>
          <td>Pass Benchmark</td>
          <td>50% (${50} marks required)</td>
        </tr>
        <tr>
          <td>Question Scope</td>
          <td>${result?.previewMode ? `${result?.totalQuestions} preview questions of ${result?.fullPaperQuestions || result?.totalQuestions} total` : `${result?.totalQuestions} questions (Full Paper)`}</td>
        </tr>
        <tr>
          <td>Final Verdict</td>
          <td style="font-weight:700; color:${accentColor};">${statusWord} — ${passed ? "Meets benchmark" : "Below benchmark"}</td>
        </tr>
      </table>

      <!-- Official note -->
      <div class="official-note">
        <div class="official-note-title">Official Statement</div>
        <p>
          This certificate was generated by the PharmTechSuccess CBT Platform and accurately reflects the
          candidate's performance for the examination paper listed above.
          ${result?.previewMode ? " Note: This result covers the preview portion of the paper only." : " This result reflects a full completed paper attempt."}
          Reference: PTS-RESULT-${paperId}
        </p>
      </div>

      <!-- Footer -->
      <div class="doc-footer">
        <div class="footer-left">
          Generated by <strong>PharmTechSuccess</strong> · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </div>
        <div class="footer-brand">PharmTechSuccess</div>
        <div class="footer-ref">PTS-${paperId}</div>
      </div>

    </div><!-- /content -->

    <div class="bottom-accent-line"></div>
    <div class="bottom-band"></div>
  </div>

  <script>
    window.onload = function () {
      window.print();
      window.onafterprint = function () { window.close(); };
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

          {/* ── Header banner ── */}
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

          {/* ── Preview mode warning ── */}
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

          {/* ── Stat cards ── */}
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

          {/* ── Question Review ── */}
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

          {/* ── Performance Overview ── */}
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

          {/* ── Premium Result Slip (in-page preview) ── */}
          <div
            ref={slipRef}
            className="print-slip-shell overflow-hidden rounded-[16px] border border-stone-200 bg-[#fffef9] shadow-lg"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            {/* Top bands */}
            <div className={`h-2 ${passed ? "bg-teal-700" : "bg-red-700"}`} />
            <div className={`h-1 ${passed ? "bg-teal-500/40" : "bg-red-400/40"}`} />

            <div className="p-6 sm:p-8 lg:p-10">
              {/* Masthead */}
              <div className="flex items-start justify-between gap-6 border-b border-stone-200 pb-6">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.28em] ${passed ? "text-teal-700" : "text-red-700"} mb-1.5`}>
                    Official Performance Certificate
                  </p>
                  <p className="font-serif text-2xl font-semibold text-stone-900 sm:text-3xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    PharmTech<em className={`italic ${passed ? "text-teal-700" : "text-red-700"}`}>Success</em>
                  </p>
                  <p className="mt-1 text-[11px] text-stone-500">
                    Pharmacy Technician Computer-Based Test Platform
                  </p>
                </div>

                <div className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-[3px] ${passed ? "border-teal-600 bg-teal-50 text-teal-700" : "border-red-600 bg-red-50 text-red-700"}`}>
                  <span className="font-serif text-xl font-bold leading-none" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {passed ? "PASS" : "FAIL"}
                  </span>
                  <span className="mt-1 text-[8px] font-semibold uppercase tracking-wider opacity-70">
                    {passed ? "Passed" : "Failed"}
                  </span>
                </div>
              </div>

              {/* Document title */}
              <div className="border-b border-stone-200 py-5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">
                  CBT Performance Result Sheet
                </p>
                <h2 className="font-serif text-2xl font-semibold leading-snug text-stone-900 sm:text-3xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {result.paperTitle}
                </h2>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <div className="h-px w-14 bg-stone-300" />
                  <div className={`h-1.5 w-1.5 rotate-45 ${passed ? "bg-teal-600" : "bg-red-600"}`} />
                  <div className="h-px w-14 bg-stone-300" />
                </div>
              </div>

              {/* Score hero */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Score main */}
                <div className={`relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-5`}>
                  <div className={`absolute inset-y-0 left-0 w-1 rounded-l-xl ${passed ? "bg-teal-600" : "bg-red-600"}`} />
                  <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-stone-400 mb-1">
                    Overall Score
                  </p>
                  <p className="font-serif leading-none text-stone-900" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "64px", fontWeight: 700 }}>
                    {result.percentage}<span className="text-4xl text-stone-500">%</span>
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {result.score} correct out of {result.totalQuestions} questions
                  </p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-stone-200">
                    <div
                      className={`h-full rounded-full ${passed ? "bg-teal-600" : "bg-red-600"}`}
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Stats pills */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Correct", value: result.score },
                    { label: "Wrong", value: wrongAnswers },
                    { label: "Unanswered", value: result.unansweredCount },
                    { label: "Time Used", value: formatTimeUsed(result.timeUsed) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-400">{label}</span>
                      <span className="font-serif text-xl font-bold text-stone-900 leading-none" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance label */}
              <div className="mt-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-stone-200" />
                  <div className={`h-1.5 w-1.5 rotate-45 border ${passed ? "border-teal-600" : "border-red-600"}`} />
                  <div className="h-px flex-1 bg-stone-200" />
                </div>
                <div className={`flex items-center justify-between rounded-lg border px-5 py-3 ${passed ? "border-teal-300 bg-teal-50" : "border-red-300 bg-red-50"}`}>
                  <span className={`text-[9px] font-bold uppercase tracking-[0.24em] ${passed ? "text-teal-600" : "text-red-600"}`}>
                    Performance Assessment
                  </span>
                  <span className={`font-serif text-lg font-bold ${passed ? "text-teal-700" : "text-red-700"}`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {performanceLabel}
                  </span>
                </div>
              </div>

              {/* Details table */}
              <div className="mt-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-stone-400 mb-3">
                  Examination Details
                </p>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["Exam Paper", result.paperTitle],
                      ["Submission Type", result.autoSubmitted ? "Auto Submitted (Time Expired)" : "Manual Submission"],
                      ["Submitted At", submittedDate],
                      ["Pass Benchmark", "50%"],
                      ["Question Scope", isPreviewMode ? `${result.totalQuestions} preview of ${fullPaperQuestions} total` : `${result.totalQuestions} questions (Full Paper)`],
                      ["Final Verdict", passed ? "PASS — Meets benchmark" : "FAIL — Below benchmark"],
                    ].map(([label, value], i, arr) => (
                      <tr key={label} className={i < arr.length - 1 ? "border-b border-stone-100" : ""}>
                        <td className="py-2.5 pr-4 text-[10px] font-semibold uppercase tracking-[0.06em] text-stone-400 w-[40%]">
                          {label}
                        </td>
                        <td className={`py-2.5 text-[12.5px] font-medium ${label === "Final Verdict" ? (passed ? "font-bold text-teal-700" : "font-bold text-red-700") : "text-stone-700"}`}>
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Official note */}
              <div className={`mt-5 rounded-r-xl border-l-[3px] bg-stone-50 px-4 py-3 ${passed ? "border-teal-600" : "border-red-600"}`}>
                <p className={`text-[9px] font-bold uppercase tracking-[0.22em] mb-1 ${passed ? "text-teal-700" : "text-red-700"}`}>
                  Official Statement
                </p>
                <p className="text-[11px] leading-relaxed text-stone-500">
                  This certificate was generated by the PharmTechSuccess CBT Platform and accurately reflects
                  the candidate's performance for the examination paper listed above.
                  {isPreviewMode
                    ? " This result covers the preview portion of the paper only."
                    : " This result reflects a full completed paper attempt."}
                  {" "}Reference: PTS-RESULT-{paperId}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 flex flex-col gap-2 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10px] text-stone-400">
                  Generated by <span className="font-semibold text-stone-600">PharmTechSuccess</span>
                </p>
                <p className="font-serif text-sm font-semibold text-stone-600" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  PharmTechSuccess
                </p>
                <p className="rounded border border-stone-200 bg-stone-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  PTS-{paperId}
                </p>
              </div>
            </div>

            {/* Bottom bands */}
            <div className={`h-1 ${passed ? "bg-teal-500/40" : "bg-red-400/40"}`} />
            <div className={`h-2 ${passed ? "bg-teal-700" : "bg-red-700"}`} />
          </div>

          {/* ── Print / Download actions ── */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Save Your Result Slip
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Print or download your official CBT result sheet for your records.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
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

          {/* ── Bottom nav ── */}
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