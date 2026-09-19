"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BadgeX,
  ChevronDown,
  Clock3,
  Crown,
  Flag,
  ListChecks,
  Lock,
  Printer,
  RotateCcw,
  Share2,
} from "lucide-react";
import Container from "@/components/layout/Container";

const PASS_MARK = 50;
const SERIF = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const SANS = { fontFamily: "'DM Sans', system-ui, sans-serif" };

const FILTERS = [
  { key: "wrong", label: "Wrong" },
  { key: "unanswered", label: "Unanswered" },
  { key: "flagged", label: "Flagged" },
  { key: "all", label: "All" },
];

function formatTimeUsed(seconds) {
  const total = Math.max(Number(seconds) || 0, 0);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getPerformanceLabel(pct) {
  if (pct >= 80) return "Excellent performance";
  if (pct >= 60) return "Very good performance";
  if (pct >= 50) return "Good performance";
  if (pct >= 40) return "Fair performance";
  return "Needs improvement";
}

function getItemStatus(item) {
  const unanswered =
    item.selectedOption === null || item.selectedOption === undefined;
  if (unanswered) return "unanswered";
  return item.isCorrect ? "correct" : "wrong";
}

/* ───────────── Score ring ───────────── */
function ScoreRing({ percentage, passed }) {
  const size = 148;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percentage, 0), 100) / 100);
  const color = passed ? "#0f766e" : "#b91c1c";

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score ${percentage} percent`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e7e2d6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p
          className="leading-none text-stone-900"
          style={{ ...SERIF, fontSize: 52, fontWeight: 700 }}
        >
          {percentage}
          <span className="text-2xl text-stone-500">%</span>
        </p>
      </div>
    </div>
  );
}

/* ───────────── Review item (collapsible) ───────────── */
function ReviewItem({ item, open, onToggle }) {
  const status = getItemStatus(item);

  const statusMeta = {
    correct: {
      label: "Correct",
      icon: CheckCircle2,
      chip: "bg-teal-100 text-teal-700",
    },
    wrong: {
      label: "Incorrect",
      icon: XCircle,
      chip: "bg-red-100 text-red-700",
    },
    unanswered: {
      label: "Not answered",
      icon: MinusCircle,
      chip: "bg-amber-100 text-amber-700",
    },
  }[status];

  const StatusIcon = statusMeta.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-stone-50 sm:p-5"
      >
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-bold text-stone-700"
          style={SANS}
        >
          {item.questionNumber}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={`text-[15px] font-semibold leading-6 text-stone-900 sm:text-base ${
              open ? "" : "line-clamp-2"
            }`}
          >
            {item.question}
          </p>

          {!open && status !== "correct" && (
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {status === "wrong" && (
                <>
                  <span className="text-red-700">You chose:</span>{" "}
                  {item.selectedOption}
                  <br />
                </>
              )}
              <span className="text-teal-700">Correct answer:</span>{" "}
              {item.correctAnswer}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
          {item.wasFlagged && (
            <Flag size={15} className="text-amber-600" aria-label="Flagged" />
          )}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.chip}`}
          >
            <StatusIcon size={13} />
            {statusMeta.label}
          </span>
          <ChevronDown
            size={18}
            className={`hidden text-stone-400 transition-transform sm:block ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="grid gap-2.5 border-t border-stone-100 bg-stone-50/60 p-4 sm:p-5">
          {item.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = item.selectedIndex === index;
            const isCorrectOption = item.correctAnswer === option;

            return (
              <div
                key={index}
                className={`rounded-xl border p-3.5 text-sm leading-6 sm:text-[15px] ${
                  isCorrectOption
                    ? "border-teal-300 bg-teal-50"
                    : isSelected
                    ? "border-red-300 bg-red-50"
                    : "border-stone-200 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-stone-700 ring-1 ring-stone-200">
                    {letter}
                  </span>
                  <span className="font-medium text-stone-800">{option}</span>
                  {isSelected && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
                      Your answer
                    </span>
                  )}
                  {isCorrectOption && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
                      Correct answer
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {status === "unanswered" && (
            <p className="text-sm font-medium text-amber-700">
              You did not answer this question.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────── Page ───────────── */
export default function ResultClient() {
  const params = useParams();
  const paperId = params?.paperId;

  const [result, setResult] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [openItems, setOpenItems] = useState(() => new Set());
  const reviewRef = useRef(null);

  /* Load the saved result (client only) */
  useEffect(() => {
    if (!paperId) return;

    try {
      const saved = localStorage.getItem(`result-${paperId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setResult(parsed);

        const review = Array.isArray(parsed.review) ? parsed.review : [];
        const wrong = review.filter((r) => getItemStatus(r) === "wrong").length;
        const skipped = review.filter(
          (r) => getItemStatus(r) === "unanswered"
        ).length;
        setFilter(wrong > 0 ? "wrong" : skipped > 0 ? "unanswered" : "all");
      }
    } catch (err) {
      console.error("Could not read saved result:", err);
    } finally {
      setLoaded(true);
    }
  }, [paperId]);

  /* Certificate fonts */
  useEffect(() => {
    const id = "cormorant-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const review = useMemo(
    () => (Array.isArray(result?.review) ? result.review : []),
    [result]
  );

  const counts = useMemo(() => {
    const wrong = review.filter((r) => getItemStatus(r) === "wrong").length;
    const unanswered = review.filter(
      (r) => getItemStatus(r) === "unanswered"
    ).length;
    const flagged = review.filter((r) => r.wasFlagged).length;
    return { wrong, unanswered, flagged, all: review.length };
  }, [review]);

  const filteredReview = useMemo(() => {
    if (filter === "wrong")
      return review.filter((r) => getItemStatus(r) === "wrong");
    if (filter === "unanswered")
      return review.filter((r) => getItemStatus(r) === "unanswered");
    if (filter === "flagged") return review.filter((r) => r.wasFlagged);
    return review;
  }, [review, filter]);

  const pct = result?.percentage || 0;
  const passed = pct >= PASS_MARK;
  const isPreviewMode = !!result?.previewMode;
  const fullPaperQuestions =
    result?.fullPaperQuestions || result?.totalQuestions || 0;
  const mistakeCount = counts.wrong + counts.unanswered;
  const performanceLabel = getPerformanceLabel(pct);

  const submittedDate = result?.submittedAt
    ? new Date(result.submittedAt).toLocaleString()
    : "N/A";

  const verdictLine = passed
    ? mistakeCount === 0
      ? "Perfect run. Every question was answered correctly."
      : `You met the ${PASS_MARK}% pass mark. Go through the ${mistakeCount} question${
          mistakeCount !== 1 ? "s" : ""
        } you missed to lock it in.`
    : `You are ${Math.max(PASS_MARK - pct, 0)}% short of the ${PASS_MARK}% pass mark. Start with the ${mistakeCount} question${
        mistakeCount !== 1 ? "s" : ""
      } you missed below.`;

  const toggleItem = (num) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const allOpen =
    filteredReview.length > 0 &&
    filteredReview.every((r) => openItems.has(r.questionNumber));

  const toggleAll = () => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (allOpen) filteredReview.forEach((r) => next.delete(r.questionNumber));
      else filteredReview.forEach((r) => next.add(r.questionNumber));
      return next;
    });
  };

  const goToReview = () => {
    setFilter(counts.wrong > 0 ? "wrong" : counts.unanswered > 0 ? "unanswered" : "all");
    reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShare = async () => {
    const text = `I scored ${pct}% on ${result?.paperTitle} on PharmTechSuccess. Practise your pharmacy technician CBT here:`;
    const url = "https://pharmtechsuccess.study";

    try {
      if (navigator.share) {
        await navigator.share({ title: "PharmTechSuccess", text, url });
        return;
      }
    } catch {
      return; // user closed the share sheet
    }

    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      "_blank"
    );
  };

  /* ───────────── Printable certificate (unchanged look) ───────────── */
  const handlePrintSlip = () => {
    const accentColor = passed ? "#0f766e" : "#b91c1c";
    const accentLight = passed ? "#ccfbf1" : "#fee2e2";
    const accentMid = passed ? "#0d9488" : "#dc2626";
    const statusWord = passed ? "PASS" : "FAIL";
    const wrongAnswers = counts.wrong;

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
    @page { size: A4; margin: 0; }
    html, body {
      width: 210mm; min-height: 297mm; background: #e8e3d8;
      font-family: var(--sans); color: var(--ink);
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .page { width: 210mm; min-height: 297mm; background: var(--paper); position: relative; overflow: hidden; }
    .corner { position: absolute; width: 80px; height: 80px; }
    .corner-tl { top: 18px; left: 18px; border-top: 2.5px solid var(--accent); border-left: 2.5px solid var(--accent); border-radius: 4px 0 0 0; }
    .corner-tr { top: 18px; right: 18px; border-top: 2.5px solid var(--accent); border-right: 2.5px solid var(--accent); border-radius: 0 4px 0 0; }
    .corner-bl { bottom: 18px; left: 18px; border-bottom: 2.5px solid var(--accent); border-left: 2.5px solid var(--accent); border-radius: 0 0 0 4px; }
    .corner-br { bottom: 18px; right: 18px; border-bottom: 2.5px solid var(--accent); border-right: 2.5px solid var(--accent); border-radius: 0 0 4px 0; }
    .page-border { position: absolute; inset: 10px; border: 1px solid var(--rule); pointer-events: none; }
    .watermark {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-family: var(--serif); font-size: 110px; font-weight: 700;
      color: ${passed ? "rgba(13,148,136,0.045)" : "rgba(185,28,28,0.045)"};
      letter-spacing: 0.08em; white-space: nowrap; pointer-events: none; user-select: none;
    }
    .header-band { background: var(--ink); padding: 0 40px; height: 7px; }
    .header-accent-line { height: 3px; background: linear-gradient(90deg, var(--accent) 0%, transparent 100%); }
    .content { padding: 32px 44px 28px; position: relative; }
    .masthead { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }
    .brand-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
    .brand-name { font-family: var(--serif); font-size: 26px; font-weight: 700; color: var(--ink); line-height: 1.1; }
    .brand-sub { font-size: 10.5px; color: var(--ink-3); margin-top: 4px; }
    .status-medallion {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      width: 84px; height: 84px; border-radius: 50%;
      border: 3px solid ${accentColor}; background: ${accentLight}; flex-shrink: 0;
    }
    .medallion-word { font-family: var(--serif); font-size: 22px; font-weight: 700; color: ${accentColor}; line-height: 1; }
    .medallion-sub { font-size: 7.5px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${accentColor}; margin-top: 3px; opacity: 0.8; }
    .doc-title-zone { text-align: center; padding: 20px 0 16px; border-bottom: 1px solid var(--border); }
    .doc-title-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 8px; }
    .doc-title { font-family: var(--serif); font-size: 32px; font-weight: 600; color: var(--ink); letter-spacing: 0.02em; line-height: 1.15; }
    .doc-ornament { margin: 10px auto 0; display: flex; align-items: center; justify-content: center; gap: 10px; }
    .doc-ornament-line { flex: 1; max-width: 60px; height: 1px; background: var(--rule); }
    .doc-ornament-diamond { width: 6px; height: 6px; background: var(--accent); transform: rotate(45deg); flex-shrink: 0; }
    .score-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 18px 0; }
    .score-main-block { background: var(--paper-2); border: 1px solid var(--border); border-radius: 12px; padding: 20px 22px; position: relative; overflow: hidden; }
    .score-main-block::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--accent); border-radius: 4px 0 0 4px; }
    .score-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.26em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
    .score-number { font-family: var(--serif); font-size: 64px; font-weight: 700; line-height: 1; color: var(--ink); letter-spacing: -0.02em; }
    .score-number span { font-size: 36px; color: var(--ink-3); }
    .score-fraction { font-size: 13px; color: var(--ink-3); margin-top: 4px; }
    .progress-outer { margin-top: 14px; height: 6px; background: var(--border); border-radius: 99px; overflow: hidden; }
    .progress-inner { height: 100%; width: ${pct}%; background: linear-gradient(90deg, var(--accent-mid), var(--accent)); border-radius: 99px; }
    .score-right-block { display: flex; flex-direction: column; gap: 10px; }
    .stat-pill { flex: 1; background: var(--paper-2); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; }
    .stat-pill-label { font-size: 9.5px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); }
    .stat-pill-value { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--ink); line-height: 1; }
    .hr-diamond { display: flex; align-items: center; gap: 10px; margin: 4px 0 16px; }
    .hr-diamond-line { flex: 1; height: 1px; background: var(--border); }
    .hr-diamond-shape { width: 7px; height: 7px; border: 1.5px solid var(--accent); transform: rotate(45deg); flex-shrink: 0; }
    .perf-label-row { display: flex; align-items: center; justify-content: space-between; background: var(--accent-light); border: 1px solid var(--accent); border-radius: 8px; padding: 12px 18px; margin-bottom: 16px; }
    .perf-label-left { font-size: 9px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: var(--accent); }
    .perf-label-right { font-family: var(--serif); font-size: 17px; font-weight: 700; color: ${accentColor}; }
    .details-section-title { font-size: 9px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 10px; }
    .details-table { width: 100%; border-collapse: collapse; }
    .details-table tr { border-bottom: 1px solid var(--border); }
    .details-table tr:last-child { border-bottom: none; }
    .details-table td { padding: 9px 0; font-size: 12px; line-height: 1.5; }
    .details-table td:first-child { font-weight: 600; color: var(--ink-3); width: 42%; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
    .details-table td:last-child { font-weight: 500; color: var(--ink); }
    .official-note { margin-top: 16px; padding: 13px 16px; background: var(--paper-2); border-left: 3px solid var(--accent); border-radius: 0 8px 8px 0; }
    .official-note-title { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 5px; }
    .official-note p { font-size: 11px; line-height: 1.7; color: var(--ink-3); }
    .doc-footer { margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .footer-left { font-size: 9.5px; color: var(--ink-3); }
    .footer-left strong { font-weight: 600; color: var(--ink-2); }
    .footer-ref { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-3); background: var(--paper-2); border: 1px solid var(--border); border-radius: 4px; padding: 5px 10px; }
    .footer-brand { font-family: var(--serif); font-size: 13px; font-weight: 600; color: var(--accent); }
    .bottom-band { height: 7px; background: var(--ink); }
    .bottom-accent-line { height: 3px; background: linear-gradient(90deg, transparent 0%, var(--accent) 100%); }
    @media print { html, body { background: white; width: 100%; } .page { box-shadow: none; } }
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
      <div class="masthead">
        <div>
          <div class="brand-eyebrow">Official Performance Certificate</div>
          <div class="brand-name">PharmTech<em style="font-style:italic;color:var(--accent)">Success</em></div>
          <div class="brand-sub">Pharmacy Technician Computer-Based Test Platform</div>
        </div>
        <div class="status-medallion">
          <div class="medallion-word">${statusWord}</div>
          <div class="medallion-sub">${passed ? "Passed" : "Failed"}</div>
        </div>
      </div>

      <div class="doc-title-zone">
        <div class="doc-title-eyebrow">CBT Performance Result Sheet</div>
        <div class="doc-title">${result?.paperTitle || "Pharmacy Technician CBT"}</div>
        <div class="doc-ornament">
          <div class="doc-ornament-line"></div>
          <div class="doc-ornament-diamond"></div>
          <div class="doc-ornament-line"></div>
        </div>
      </div>

      <div class="score-hero">
        <div class="score-main-block">
          <div class="score-eyebrow">Overall Score</div>
          <div class="score-number">${pct}<span>%</span></div>
          <div class="score-fraction">${result?.score} correct out of ${result?.totalQuestions} questions</div>
          <div class="progress-outer"><div class="progress-inner"></div></div>
        </div>
        <div class="score-right-block">
          <div class="stat-pill"><div class="stat-pill-label">Correct</div><div class="stat-pill-value">${result?.score}</div></div>
          <div class="stat-pill"><div class="stat-pill-label">Wrong</div><div class="stat-pill-value">${wrongAnswers}</div></div>
          <div class="stat-pill"><div class="stat-pill-label">Unanswered</div><div class="stat-pill-value">${result?.unansweredCount ?? 0}</div></div>
          <div class="stat-pill"><div class="stat-pill-label">Time Used</div><div class="stat-pill-value" style="font-size:16px;">${formatTimeUsed(result?.timeUsed)}</div></div>
        </div>
      </div>

      <div class="hr-diamond">
        <div class="hr-diamond-line"></div>
        <div class="hr-diamond-shape"></div>
        <div class="hr-diamond-line"></div>
      </div>

      <div class="perf-label-row">
        <div class="perf-label-left">Performance Assessment</div>
        <div class="perf-label-right">${performanceLabel}</div>
      </div>

      <div class="details-section-title">Examination Details</div>
      <table class="details-table">
        <tr><td>Exam Paper</td><td>${result?.paperTitle || "—"}</td></tr>
        <tr><td>Submission Type</td><td>${result?.autoSubmitted ? "Auto Submitted (Time Expired)" : "Manual Submission"}</td></tr>
        <tr><td>Submitted At</td><td>${submittedDate}</td></tr>
        <tr><td>Pass Benchmark</td><td>${PASS_MARK}%</td></tr>
        <tr><td>Question Scope</td><td>${isPreviewMode ? `${result?.totalQuestions} preview questions of ${fullPaperQuestions} total` : `${result?.totalQuestions} questions (Full Paper)`}</td></tr>
        <tr><td>Final Verdict</td><td style="font-weight:700; color:${accentColor};">${statusWord} — ${passed ? "Meets benchmark" : "Below benchmark"}</td></tr>
      </table>

      <div class="official-note">
        <div class="official-note-title">Official Statement</div>
        <p>
          This certificate was generated by the PharmTechSuccess CBT Platform and accurately reflects the
          candidate's performance for the examination paper listed above.
          ${isPreviewMode ? " Note: This result covers the preview portion of the paper only." : " This result reflects a full completed paper attempt."}
          Reference: PTS-RESULT-${paperId}
        </p>
      </div>

      <div class="doc-footer">
        <div class="footer-left">Generated by <strong>PharmTechSuccess</strong> · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
        <div class="footer-brand">PharmTechSuccess</div>
        <div class="footer-ref">PTS-${paperId}</div>
      </div>
    </div>

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

  /* ───────────── States ───────────── */
  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-100 py-10">
        <Container>
          <div className="animate-pulse space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="h-8 w-72 rounded bg-slate-200" />
            <div className="h-40 rounded bg-slate-200" />
          </div>
        </Container>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-100 py-10">
        <Container>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              No result found for this paper
            </h1>
            <p className="mt-2 text-slate-600">
              Results are saved on the device you took the exam on. Take the
              paper again to see a new result.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/exam/${paperId}`}
                className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white"
              >
                Start this paper
              </Link>
              <Link
                href="/papers"
                className="inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700"
              >
                Browse papers
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  const accentText = passed ? "text-teal-700" : "text-red-700";
  const accentBar = passed ? "bg-teal-700" : "bg-red-700";
  const accentBarSoft = passed ? "bg-teal-500/40" : "bg-red-400/40";

  return (
    <main className="min-h-screen bg-slate-100 py-5 sm:py-6 lg:py-10">
      <Container>
        <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
          {/* ───────── Certificate hero ───────── */}
          <section
            className="overflow-hidden rounded-[18px] border border-stone-200 bg-[#fffef9] shadow-lg"
            style={SANS}
          >
            <div className={`h-2 ${accentBar}`} />
            <div className={`h-1 ${accentBarSoft}`} />

            <div className="p-5 sm:p-8 lg:p-10">
              {/* Masthead */}
              <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-5">
                <div className="min-w-0">
                  <p
                    className="text-2xl font-semibold text-stone-900 sm:text-3xl"
                    style={SERIF}
                  >
                    PharmTech
                    <em className={`italic ${accentText}`}>Success</em>
                  </p>
                  <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                    Result centre · {submittedDate}
                  </p>
                </div>

                <div
                  className={`flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center rounded-full border-[3px] sm:h-20 sm:w-20 ${
                    passed
                      ? "border-teal-600 bg-teal-50 text-teal-700"
                      : "border-red-600 bg-red-50 text-red-700"
                  }`}
                >
                  {passed ? <BadgeCheck size={18} /> : <BadgeX size={18} />}
                  <span
                    className="mt-0.5 text-lg font-bold leading-none"
                    style={SERIF}
                  >
                    {passed ? "PASS" : "FAIL"}
                  </span>
                </div>
              </div>

              {/* Title + ring */}
              <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 text-center sm:text-left">
                  <h1
                    className="text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl"
                    style={SERIF}
                  >
                    {result.paperTitle}
                  </h1>

                  <p className={`mt-2 text-base font-semibold ${accentText}`}>
                    {performanceLabel}
                  </p>

                  <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                    {verdictLine}
                  </p>

                  {isPreviewMode && (
                    <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                      <Lock size={12} />
                      Free preview: {result.totalQuestions} of{" "}
                      {fullPaperQuestions} questions
                    </p>
                  )}
                </div>

                <ScoreRing percentage={pct} passed={passed} />
              </div>

              {/* Stat strip */}
              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Correct", value: result.score, tone: "text-teal-700" },
                  { label: "Wrong", value: counts.wrong, tone: "text-red-700" },
                  {
                    label: "Unanswered",
                    value: counts.unanswered,
                    tone: "text-amber-700",
                  },
                  {
                    label: "Time used",
                    value: formatTimeUsed(result.timeUsed),
                    tone: "text-stone-800",
                    icon: Clock3,
                  },
                ].map(({ label, value, tone, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
                  >
                    <p className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
                      {Icon && <Icon size={13} />}
                      {label}
                    </p>
                    <p
                      className={`mt-1 text-3xl font-bold leading-none ${tone}`}
                      style={SERIF}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={goToReview}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <ListChecks size={17} />
                  {mistakeCount > 0
                    ? `Review ${mistakeCount} mistake${mistakeCount !== 1 ? "s" : ""}`
                    : "Review answers"}
                </button>

                <Link
                  href={`/exam/${paperId}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <RotateCcw size={17} />
                  {isPreviewMode ? "Retake preview" : "Retake exam"}
                </Link>

                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Printer size={17} />
                  Save result slip
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Share2 size={17} />
                  Share score
                </button>
              </div>
            </div>

            <div className={`h-1 ${accentBarSoft}`} />
            <div className={`h-2 ${accentBar}`} />
          </section>

          {/* ───────── Review ───────── */}
          <section
            ref={reviewRef}
            className="scroll-mt-24 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Review your answers
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Start with what you got wrong. Tap a question to see every
                  option.
                </p>
              </div>

              {filteredReview.length > 0 && (
                <button
                  type="button"
                  onClick={toggleAll}
                  className="self-start text-sm font-semibold text-teal-700 hover:text-teal-800 sm:self-auto"
                >
                  {allOpen ? "Collapse all" : "Expand all"}
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div
              className="mt-5 flex gap-2 overflow-x-auto pb-1"
              role="tablist"
              aria-label="Filter questions"
            >
              {FILTERS.map(({ key, label }) => {
                const active = filter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(key)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {counts[key]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-3">
              {filteredReview.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="font-semibold text-slate-800">
                    {filter === "wrong"
                      ? "No wrong answers here. Nicely done."
                      : filter === "unanswered"
                      ? "You answered every question."
                      : "You did not flag any questions."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="mt-3 text-sm font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Show all questions
                  </button>
                </div>
              ) : (
                filteredReview.map((item) => (
                  <ReviewItem
                    key={item.questionNumber}
                    item={item}
                    open={openItems.has(item.questionNumber)}
                    onToggle={() => toggleItem(item.questionNumber)}
                  />
                ))
              )}
            </div>
          </section>

          {/* ───────── Premium prompt (preview only, shown once) ───────── */}
          {isPreviewMode && (
            <section className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Crown size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">
                      You covered {result.totalQuestions} of {fullPaperQuestions}{" "}
                      questions
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      Unlock the full paper to see how you do on the whole
                      exam and get a complete score.
                    </p>
                  </div>
                </div>

                <Link
                  href="/pricing"
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Unlock full paper
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          )}

          {/* ───────── Bottom nav ───────── */}
          <div>
            <Link
              href="/papers"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
            >
              <ArrowLeft size={16} />
              Back to papers
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}