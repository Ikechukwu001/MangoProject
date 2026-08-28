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
    if (!isPremium) {
      setFetching(false);
      return;
    }
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
      <main className="mx-auto max-w-5xl space-y-4 p-6">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-52 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {isPremium ? (
        <div className="mx-auto max-w-5xl p-5 md:p-6">
          {/* ── Header ── */}
          <div className="mb-7">
            <div className="mb-1.5 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
                <Briefcase className="h-[18px] w-[18px] text-white dark:text-zinc-900" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Job Alerts
              </h1>
            </div>

            <p className="ml-12 text-sm text-zinc-500 dark:text-zinc-400">
              Pharmacy Technician openings across Nigeria
            </p>

            <div className="ml-12 mt-4 flex items-center gap-4">
              {["MyJobMag", "Jobberman"].map((src) => (
                <span
                  key={src}
                  className="flex items-center gap-1.5 text-[12px] text-zinc-500 dark:text-zinc-400"
                >
                  <span className={`h-2 w-2 rounded-full ${SOURCE_DOT[src]}`} />
                  {src}
                </span>
              ))}
              <span className="ml-auto flex items-center gap-1 text-[12px] text-zinc-400 dark:text-zinc-500">
                <Zap className="h-3 w-3 text-amber-400" />
                Auto-updated
              </span>
            </div>
          </div>

          {/* ── Content ── */}
          {fetching ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-52 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
              ))}
            </div>
          ) : jobs.length ? (
            <JobsList jobs={jobs} />
          ) : (
            <div className="rounded-2xl border border-zinc-200 p-12 text-center dark:border-zinc-800">
              <Briefcase className="mx-auto mb-3 h-8 w-8 text-zinc-200 dark:text-zinc-700" />
              <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">No listings yet</h3>
              <p className="text-sm text-zinc-500">New openings will appear here automatically.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ── Blurred preview ── */}
          <div className="pointer-events-none mx-auto h-screen max-w-5xl select-none overflow-hidden p-6 blur-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-zinc-900" />
              <div className="h-5 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-52 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-3 h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                  <div className="mb-2 h-3 w-16 rounded-full bg-blue-100 dark:bg-blue-900" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-white to-transparent dark:from-black" />
          </div>

          {/* ── Lock overlay ── */}
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-[32px] border border-zinc-200 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 md:p-10">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Premium Feature
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
                Get curated Pharmacy Technician openings from MyJobMag and Jobberman — updated
                automatically every 6 hours.
              </p>

              <div className="mt-5 flex items-center justify-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  MyJobMag
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Jobberman
                </span>
              </div>

              <Link
                href="/pricing"
                className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-6 py-4 text-sm font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-zinc-900"
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