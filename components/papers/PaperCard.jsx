import Link from "next/link";
import {
  Clock3,
  FileText,
  Lock,
  ArrowRight,
  CalendarDays,
  Crown,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}hr ${mins}mins`;
  }

  return `${mins}mins`;
}

export default function PaperCard({ paper, isPremium = false, isPending = false }) {
  const accessText = isPremium
    ? "Full paper access available"
    : "Free preview available";

  const primaryButtonText = isPremium ? "Start Full Practice" : "Start Free Preview";

  const secondaryButtonText = isPremium ? "Open Exam" : "Quick Preview";

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            {paper.subject}
          </span>

          <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
            {paper.title}
          </h3>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {paper.year}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {paper.description}
      </p>

      <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Clock3 size={16} className="text-teal-700" />
          <span>{formatDuration(paper.duration)}</span>
        </div>

        <div className="flex items-center gap-2">
          <FileText size={16} className="text-teal-700" />
          <span>{paper.totalQuestions} Questions</span>
        </div>

        <div className="flex items-center gap-2">
          <Lock size={16} className="text-amber-600" />
          <span>{paper.freeQuestions} Free questions</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-teal-700" />
          <span>{paper.year} Session</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">{accessText}</p>
            <p className="mt-1 text-xs leading-6 text-slate-500">
              {isPremium
                ? "You can access the full question flow for this paper."
                : `You can access the first ${paper.freeQuestions} questions before premium unlock.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isPremium ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                <BadgeCheck size={14} />
                Premium Active
              </span>
            ) : paper.isPremium ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <Crown size={14} />
                Premium Unlock
              </span>
            ) : (
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                Preview Open
              </span>
            )}
          </div>
        </div>

        {isPending && !isPremium && (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-3">
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-700" />
            <p className="text-xs leading-6 text-amber-700">
              Your premium request is pending. You can keep using the free preview for now.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/exam/${paper.id}`}
          className="inline-flex items-center justify-center rounded-2xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:bg-teal-800"
        >
          {primaryButtonText}
        </Link>

        <Link
          href={`/exam/${paper.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          {secondaryButtonText}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}