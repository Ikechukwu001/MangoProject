// app/(dashboard)/job-alerts/page.jsx
"use client";

import JobsList from "@/components/jobs/JobsList";
import useUserProfile from "@/src/hooks/useUserProfile";
import { createClient } from "@/src/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Briefcase, Zap } from "lucide-react";

const SOURCE_DOT = {
  MyJobMag: "bg-blue-500",
  Jobberman: "bg-emerald-500",
};

export default function JobAlertsPage() {
  const { loading, isPremium } = useUserProfile();
  const [jobs, setJobs] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isPremium) { setFetching(false); return; }
    async function fetchJobs() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("job_alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setJobs(data || []);
      setFetching(false);
    }
    fetchJobs();
  }, [isPremium]);

  if (loading) {
    return (
      <main className="p-6 max-w-2xl mx-auto space-y-4">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-52 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {isPremium ? (
        <div className="p-5 md:p-6 max-w-2xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-7">
            {/* Title row */}
            <div className="flex items-center gap-3 mb-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white shrink-0">
                <Briefcase className="h-4.5 w-4.5 text-white dark:text-zinc-900 h-[18px] w-[18px]" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Job Alerts
              </h1>
            </div>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 ml-12">
              Pharmacy Technician openings across Nigeria
            </p>

            {/* Source legend */}
            <div className="mt-4 ml-12 flex items-center gap-4">
              {["MyJobMag", "Jobberman"].map((src) => (
                <span key={src} className="flex items-center gap-1.5 text-[12px] text-zinc-500 dark:text-zinc-400">
                  <span className={`h-2 w-2 rounded-full ${SOURCE_DOT[src]}`} />
                  {src}
                </span>
              ))}
              <span className="flex items-center gap-1 text-[12px] text-zinc-400 dark:text-zinc-500 ml-auto">
                <Zap className="h-3 w-3 text-amber-400" />
                Auto-updated
              </span>
            </div>
          </div>

          {/* ── Content ── */}
          {fetching ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
              ))}
            </div>
          ) : jobs.length ? (
            <JobsList jobs={jobs} />
          ) : (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
              <Briefcase className="h-8 w-8 text-zinc-200 dark:text-zinc-700 mx-auto mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                No listings yet
              </h3>
              <p className="text-sm text-zinc-500">
                New openings will appear here automatically.
              </p>
            </div>
          )}
        </div>

      ) : (
        <>
          {/* ── Blurred preview ── */}
          <div className="pointer-events-none h-screen overflow-hidden blur-md select-none p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-zinc-900" />
              <div className="h-5 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-32">
                  <div className="flex-1 p-5 space-y-2">
                    <div className="h-3 w-16 rounded-full bg-blue-100 dark:bg-blue-900" />
                    <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                    <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                  <div className="w-36 bg-zinc-50 dark:bg-zinc-800" />
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-white dark:from-black to-transparent" />
          </div>

          {/* ── Lock overlay ── */}
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-8 md:p-10 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Premium Feature
              </h1>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                Get curated Pharmacy Technician openings from MyJobMag and Jobberman — updated automatically every 6 hours.
              </p>

              {/* Source pills */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  MyJobMag
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Jobberman
                </span>
              </div>

              <Link
                href="/pricing"
                className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 dark:bg-white px-6 py-4 text-sm font-semibold text-white dark:text-zinc-900 transition hover:scale-[1.02]"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}