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
} from "lucide-react";
import Container from "@/components/layout/Container";

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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const performanceLabel = useMemo(() => {
    if (!result) return "";
    if (result.percentage >= 80) return "Excellent";
    if (result.percentage >= 60) return "Very Good";
    if (result.percentage >= 50) return "Good";
    if (result.percentage >= 40) return "Fair";
    return "Needs Improvement";
  }, [result]);

  const passMark = 50;
  const passed = result ? result.percentage >= passMark : false;

  const handlePrintSlip = () => {
    const printContents = slipRef.current?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>PharmTechSuccess Result Slip</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 24px;
              background: #f8fafc;
              color: #0f172a;
            }
            .slip {
              max-width: 900px;
              margin: 0 auto;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 20px;
              padding: 28px;
            }
            .brand {
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: #0f766e;
              margin-bottom: 8px;
            }
            .title {
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 6px;
            }
            .subtitle {
              font-size: 14px;
              color: #475569;
              margin-bottom: 24px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 14px;
              margin-bottom: 24px;
            }
            .card {
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 16px;
              background: #f8fafc;
            }
            .label {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 6px;
            }
            .value {
              font-size: 24px;
              font-weight: 700;
              color: #0f172a;
            }
            .badge {
              display: inline-block;
              padding: 10px 16px;
              border-radius: 999px;
              font-size: 14px;
              font-weight: 700;
              margin-top: 8px;
            }
            .badge-pass {
              background: #dcfce7;
              color: #166534;
            }
            .badge-fail {
              background: #fee2e2;
              color: #991b1b;
            }
            .meta {
              margin-top: 24px;
              font-size: 13px;
              color: #475569;
            }
            .footer-note {
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px dashed #cbd5e1;
              font-size: 12px;
              color: #64748b;
            }
            @media print {
              body {
                background: #ffffff;
                padding: 0;
              }
              .slip {
                border: none;
                border-radius: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="slip">
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
    <main className="min-h-screen bg-slate-100 py-6 lg:py-10">
      <Container>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              PharmTechSuccess Result
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 lg:text-3xl">
              {result.paperTitle}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Pharmacy Technician CBT Result Summary
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Trophy size={18} />
                <span className="text-sm font-medium">Score</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {result.score}/{result.totalQuestions}
              </p>
              <p className="mt-1 text-sm text-slate-500">{result.percentage}%</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">Answered</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {result.answeredCount}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <AlertTriangle size={18} />
                <span className="text-sm font-medium">Unanswered</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {result.unansweredCount}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock3 size={18} />
                <span className="text-sm font-medium">Time Used</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {formatTimeUsed(result.timeUsed)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Performance Overview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Overall exam performance and review summary
                  </p>
                </div>

                <div
                  className={`inline-flex rounded-2xl px-4 py-2 text-sm font-semibold ${
                    passed
                      ? "bg-teal-100 text-teal-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {performanceLabel}
                </div>
              </div>

              <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${
                    passed ? "bg-teal-600" : "bg-red-600"
                  }`}
                  style={{ width: `${result.percentage}%` }}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Correct Answers</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {result.score}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Wrong Answers</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {result.answeredCount - result.score}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Flagged Questions</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {result.flaggedCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Final Status
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Based on a pass mark of {passMark}%
                  </p>
                </div>
              </div>

              <div
                className={`mt-5 inline-flex items-center gap-3 rounded-2xl px-5 py-4 text-base font-bold ${
                  passed
                    ? "bg-teal-100 text-teal-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {passed ? <BadgeCheck size={20} /> : <BadgeX size={20} />}
                {passed ? "PASS" : "FAIL"}
              </div>

              <p className="mt-4 text-sm text-slate-600">
                {passed
                  ? "Congratulations. Your performance meets the required benchmark for this Pharm Tech CBT."
                  : "Your score is below the required benchmark for this Pharm Tech CBT. Review the corrections and try again."}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handlePrintSlip}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  <Printer size={18} />
                  Print Result Slip
                </button>

                <button
                  onClick={handlePrintSlip}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-300"
                >
                  <Download size={18} />
                  Download Result Slip
                </button>
              </div>
            </div>
          </div>

          <div
            ref={slipRef}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              PharmTechSuccess Official Slip
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              CBT Result Slip
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Pharmacy Technician Computer-Based Test
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Exam Paper</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {result.paperTitle}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Submission Type</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {result.autoSubmitted ? "Auto Submitted" : "Manual Submission"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Score</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {result.score}/{result.totalQuestions} ({result.percentage}%)
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Time Used</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {formatTimeUsed(result.timeUsed)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Answered</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {result.answeredCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Unanswered</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {result.unansweredCount}
                </p>
              </div>
            </div>

            <div
              className={`mt-6 inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
                passed
                  ? "bg-teal-100 text-teal-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {passed ? <BadgeCheck size={18} /> : <BadgeX size={18} />}
              Final Status: {passed ? "PASS" : "FAIL"}
            </div>

            <div className="mt-6 border-t border-dashed border-slate-300 pt-4 text-xs text-slate-500">
              <p>Generated by PharmTechSuccess CBT Platform</p>
              <p className="mt-1">
                Submitted at: {new Date(result.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Question Review
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review each question, your selected answer, and the correct answer
            </p>

            <div className="mt-6 space-y-4">
              {result.review.map((item) => (
                <div
                  key={item.questionNumber}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Question {item.questionNumber}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-slate-900">
                        {item.question}
                      </h3>
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
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
                          className={`rounded-xl border p-3 ${
                            isCorrectOption
                              ? "border-teal-300 bg-teal-50"
                              : isSelected
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <span className="font-semibold">{optionLetter}.</span>{" "}
                          {option}
                          {isSelected && (
                            <span className="ml-2 text-sm font-medium text-slate-500">
                              (Your answer)
                            </span>
                          )}
                          {isCorrectOption && (
                            <span className="ml-2 text-sm font-medium text-teal-700">
                              (Correct answer)
                            </span>
                          )}
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
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm"
            >
              <ArrowLeft size={16} />
              Back Home
            </Link>

            <Link
              href={`/exam/${paperId}`}
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white"
            >
              Retake Exam
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}