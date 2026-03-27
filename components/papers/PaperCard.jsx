import Link from "next/link";
import { Clock3, FileText, Lock, ArrowRight, CalendarDays } from "lucide-react";

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}hr ${mins}mins`;
  }

  return `${mins}mins`;
}

export default function PaperCard({ paper }) {
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
          <span>{paper.totalQuestions} questions</span>
        </div>

        <div className="flex items-center gap-2">
          <Lock size={16} className="text-amber-600" />
          <span>{paper.freeQuestions} free questions</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-teal-700" />
          <span>{paper.year} session</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <span className="text-sm font-medium text-slate-600">
          {paper.isPremium ? "Free preview + premium unlock" : "Available for practice"}
        </span>

        {paper.isPremium && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Premium
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/exam/${paper.id}`}
          className="inline-flex items-center justify-center rounded-2xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:bg-teal-800"
        >
          View Paper
        </Link>

        <Link
          href={`/exam/${paper.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Quick Practice
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}