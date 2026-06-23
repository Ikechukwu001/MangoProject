// components/jobs/JobCard.jsx
"use client";

import { Building2, MapPin, Clock, ArrowUpRight, Briefcase } from "lucide-react";
import Lottie from "lottie-react";
import jobAlertAnimation from "@/public/lottie/Jobalertanimation.json";

const SOURCE_STYLES = {
  MyJobMag: {
    badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    dot: "bg-blue-500",
    hover: "group-hover:border-blue-400/60 group-hover:shadow-blue-500/5",
    icon: "text-blue-500",
  },
  Jobberman: {
    badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
    dot: "bg-emerald-500",
    hover: "group-hover:border-emerald-400/60 group-hover:shadow-emerald-500/5",
    icon: "text-emerald-500",
  },
};

export default function JobCard({ job, index = 0 }) {
  const style = SOURCE_STYLES[job.source] || SOURCE_STYLES.MyJobMag;

  return (
    <a
      href={job.job_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 ${style.hover} hover:shadow-xl hover:-translate-y-[2px]`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* ── Content ── */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5 md:p-6">

        {/* Source badge */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase ${style.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {job.source}
          </span>
          {job.date && (
            <span className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
              <Clock className="h-3 w-3" />
              {job.date}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-bold leading-snug text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-2">
            {job.title}
          </h3>
          <div className={`shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-400 transition-all duration-200 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:border-zinc-900 dark:group-hover:border-white group-hover:text-white dark:group-hover:text-zinc-900`}>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {job.company && (
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-600 dark:text-zinc-300">
              <Building2 className={`h-3.5 w-3.5 shrink-0 ${style.icon}`} />
              {job.company}
            </span>
          )}
          {job.location && (
            <span className="flex items-center gap-1.5 text-[12px] text-zinc-400 dark:text-zinc-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {job.location}
            </span>
          )}
        </div>

        {/* Description preview */}
        {job.description && (
          <p className="text-[12px] leading-relaxed text-zinc-400 dark:text-zinc-500 line-clamp-2">
            {job.description.replace(/^(Job Summary|Requirements?|Description|Responsibilities?)\s*/i, "")}
          </p>
        )}

        {/* CTA */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors uppercase tracking-wide">
            View opening
          </span>
          <ArrowUpRight className="h-3 w-3 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="hidden sm:block w-px bg-zinc-100 dark:bg-zinc-800 my-5 shrink-0" />

      {/* ── Animation panel ── */}
      <div className="relative flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 sm:w-44 h-36 sm:h-auto shrink-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30 dark:opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 70%)",
          }}
        />
        <Lottie
          animationData={jobAlertAnimation}
          loop
          className="relative z-10 h-28 w-28 sm:h-32 sm:w-32"
        />
      </div>
    </a>
  );
}