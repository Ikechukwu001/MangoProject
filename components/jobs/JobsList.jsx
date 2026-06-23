// components/jobs/JobsList.jsx
"use client";

import { useState } from "react";
import JobCard from "./JobCard";
import { Briefcase, SlidersHorizontal } from "lucide-react";

const FILTERS = ["All", "MyJobMag", "Jobberman"];

export default function JobsList({ jobs }) {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? jobs : jobs.filter((j) => j.source === active);

  const counts = {
    All: jobs.length,
    MyJobMag: jobs.filter((j) => j.source === "MyJobMag").length,
    Jobberman: jobs.filter((j) => j.source === "Jobberman").length,
  };

  return (
    <div className="space-y-5">

      {/* Stats + filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-zinc-400" />
          <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
            <span className="font-bold text-zinc-900 dark:text-white">{filtered.length}</span> opening{filtered.length !== 1 ? "s" : ""}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 italic">
            refreshed every 6 hrs
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-1">
          <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400 ml-1.5 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all duration-150 ${
                active === f
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {f}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                active === f
                  ? f === "Jobberman"
                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : f === "MyJobMag"
                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
              }`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-10 text-center">
          <Briefcase className="h-7 w-7 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-500">No listings for this source yet</p>
        </div>
      )}
    </div>
  );
}