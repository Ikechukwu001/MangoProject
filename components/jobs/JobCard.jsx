// components/jobs/JobCard.jsx

"use client";

import { Building2, MapPin, ArrowUpRight, Briefcase } from "lucide-react";
import Lottie from "lottie-react";
import jobAlertAnimation from "@/public/lottie/Job.json";

export default function JobCard({ job }) {
  return (
    <a
      href={job.job_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-blue-400/60 dark:hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-[2px]"
    >

      {/* ── Content: left on desktop, top on mobile ── */}
      <div className="flex flex-1 flex-col justify-between gap-5 p-6">

        {/* Top: tag + title */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border-blue-100 dark:border-blue-500/20 px-2.5 py-0.5">
              <Briefcase className="h-3 w-3 text-blue-500" />
              <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                {job.source || "MyJobMag"}
              </span>
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[15px] font-bold leading-snug text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {job.title}
            </h3>
            <div className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-400 transition-all duration-200 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Middle: company + location */}
        <div className="flex flex-col gap-2">
          {job.company && (
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                <Building2 className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
              </div>
              <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-200">
                {job.company}
              </span>
            </div>
          )}
          {job.location && (
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                <MapPin className="h-3 w-3 text-zinc-400" />
              </div>
              <span className="text-[12px] text-zinc-400 dark:text-zinc-500">
                {job.location}
              </span>
            </div>
          )}
        </div>

        {/* Bottom: cta text */}
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 transition-colors">
            View opening
          </span>
          <ArrowUpRight className="h-3 w-3 text-zinc-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="sm:hidden h-px bg-zinc-100 dark:bg-zinc-800 mx-6" />
      <div className="hidden sm:block w-px bg-zinc-100 dark:bg-zinc-800 my-5" />

      {/* ── Lottie: right on desktop, bottom on mobile ── */}
      <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-50/60 to-zinc-50 dark:from-blue-950/20 dark:to-zinc-900 sm:w-48 h-40 sm:h-auto shrink-0">

        {/* subtle inner border highlight */}
        <div className="absolute inset-0 sm:rounded-r-2xl ring-1 ring-inset ring-white/60 dark:ring-white/5 pointer-events-none" />

        <Lottie
          animationData={jobAlertAnimation}
          loop
          className="h-32 w-32 sm:h-36 sm:w-36 drop-shadow-sm"
        />
      </div>
    </a>
  );
}