// app/(dashboard)/job-alerts/page.jsx

"use client";

import JobsList from "@/components/jobs/JobsList";
import useUserProfile from "@/src/hooks/useUserProfile";
import { createClient } from "@/src/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

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
      <main className="p-6">
        <div className="h-40 animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* PREMIUM USERS */}
      {isPremium ? (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-1 text-zinc-900 dark:text-white">
            Job Alerts
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Latest Pharmacy Technician openings in Nigeria — updated automatically.
          </p>

          {fetching ? (
            <div className="grid gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"
                />
              ))}
            </div>
          ) : jobs.length ? (
            <JobsList jobs={jobs} />
          ) : (
            <div className="rounded-2xl border p-8 text-center border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">
                No job listings yet
              </h3>
              <p className="text-zinc-500 mt-2 text-sm">
                New Pharmacy Technician opportunities will appear here automatically.
              </p>
            </div>
          )}
        </div>

      ) : (
        <>
          {/* BLURRED PREVIEW */}
          <div className="pointer-events-none h-screen overflow-hidden blur-md select-none">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-1">Job Alerts</h1>
              <p className="text-sm text-zinc-500 mb-6">
                Latest Pharmacy Technician openings in Nigeria.
              </p>
              <div className="grid gap-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border bg-white dark:bg-zinc-900 p-5 shadow-sm"
                  >
                    <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700 mb-2" />
                    <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700 mb-4" />
                    <div className="h-4 w-1/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                  </div>
                ))}
              </div>
            </div>

            {/* fade bottom */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white dark:from-black to-transparent" />
          </div>

          {/* LOCK SCREEN */}
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-8 md:p-10 text-center">

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Premium Feature
              </h1>

              <p className="mt-3 text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                Get instant access to curated Pharmacy Technician job openings
                across Nigeria — updated automatically, every 6 hours.
              </p>

              <Link
                href="/pricing"
                className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-black dark:bg-white px-6 py-4 text-sm font-semibold text-white dark:text-black transition hover:scale-[1.02]"
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