"use client";

import ConfidenceScorer from "@/components/dashboard/ConfidenceScorer";
import useUserProfile from "@/src/hooks/useUserProfile";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function ConfidencePage() {
  const { loading, isPremium } = useUserProfile();

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
          <ConfidenceScorer />
        </div>
      ) : (
        <>
          {/* BLURRED PREVIEW */}
          <div className="pointer-events-none h-screen overflow-hidden blur-md select-none">
            <div className="p-6">
              <ConfidenceScorer />
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
                Unlock the AI Confidence Scorer to track your mastery,
                analyze weak topics, and monitor your exam readiness in real time.
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