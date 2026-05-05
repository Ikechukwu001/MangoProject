import Link from "next/link";
import {
  Clock3, FileText, Lock, ArrowRight,
  CalendarDays, Crown, AlertCircle, BadgeCheck, Play,
} from "lucide-react";

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) return `${hours}hr ${mins > 0 ? `${mins}mins` : ""}`.trim();
  return `${mins}mins`;
}

export default function PaperCard({ paper, isPremium = false, isPending = false }) {
  const accessText = isPremium ? "Full paper access available" : "Free preview available";
  const primaryButtonText = isPremium ? "Start Full Practice" : "Start Free Preview";
  const secondaryButtonText = isPremium ? "Open Exam" : "Quick Preview";

  return (
    <div className="group rounded-[20px] border border-black/[0.07] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/[0.07]">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-6 pb-0">
        <div>
          <span className="inline-block rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal-700">
            {paper.subject}
          </span>
          <h3 className="mt-2.5 font-serif text-xl leading-snug tracking-tight text-slate-900">
            {paper.title}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
          {paper.year}
        </span>
      </div>

      {/* Description */}
      <p className="px-6 pt-3 text-[13.5px] leading-relaxed text-slate-500">
        {paper.description}
      </p>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-2 px-6 pt-5">
        {[
          { icon: <Clock3 size={14} />, label: formatDuration(paper.duration), color: "teal" },
          { icon: <FileText size={14} />, label: `${paper.totalQuestions} Questions`, color: "teal" },
          { icon: <Lock size={14} />, label: `${paper.freeQuestions} Free questions`, color: "amber" },
          { icon: <CalendarDays size={14} />, label: `${paper.year} Session`, color: "teal" },
        ].map(({ icon, label, color }, i) => (
          <div key={i} className="flex items-center gap-2.5 text-[13px] text-slate-700">
            <span className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] ${
              color === "amber" ? "bg-amber-50 text-amber-700" : "bg-teal-50 text-teal-700"
            }`}>
              {icon}
            </span>
            {label}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-6 mt-5 h-px bg-black/[0.05]" />

      {/* Access strip */}
      <div className="mx-6 mt-4 rounded-[14px] border border-black/[0.05] bg-stone-50 px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold text-slate-800">{accessText}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">
              {isPremium
                ? "You can access the full question flow for this paper."
                : `Access the first ${paper.freeQuestions} questions before premium unlock.`}
            </p>
          </div>

          <div className="shrink-0">
            {isPremium ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1.5 text-[11.5px] font-semibold text-teal-700">
                <BadgeCheck size={12} /> Premium Active
              </span>
            ) : paper.isPremium ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-[11.5px] font-semibold text-amber-700">
                <Crown size={12} /> Premium unlock
              </span>
            ) : (
              <span className="rounded-full bg-teal-50 px-2.5 py-1.5 text-[11.5px] font-semibold text-teal-700">
                Preview Open
              </span>
            )}
          </div>
        </div>

        {isPending && !isPremium && (
          <div className="mt-2.5 flex items-start gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-2.5 py-2">
            <AlertCircle size={13} className="mt-0.5 shrink-0 text-amber-700" />
            <p className="text-[12px] leading-relaxed text-amber-700">
              Your premium request is pending. You can keep using the free preview for now.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 p-6 pt-4">
        <Link
          href={`/exam/${paper.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-[13.5px] font-semibold text-white transition hover:bg-teal-800"
        >
          <Play size={14} />
          {primaryButtonText}
        </Link>

        <Link
          href={`/exam/${paper.id}`}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-black/[0.12] bg-white px-4 py-3 text-[13.5px] font-medium text-slate-600 transition hover:border-black/20 hover:bg-stone-50"
        >
          {secondaryButtonText}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}