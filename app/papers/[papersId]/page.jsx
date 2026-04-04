import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  FileText,
  Lock,
  CalendarDays,
  BadgeCheck,
  Crown,
  ShieldCheck,
  Layers3,
  AlertCircle,
} from "lucide-react";

import Container from "@/components/layout/Container";
import getPaperById from "@/lib/getPaperById";
import { createClient } from "@/src/lib/supabase/server";

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) return `${hours}hr ${mins}mins`;
  return `${mins}mins`;
}

export default async function PaperDetailsPage({ params }) {
  const { paperId } = params;
  const paper = getPaperById(paperId);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // 🔥 fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, premium_status, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const isPremium =
    profile?.plan === "premium" || profile?.premium_status === "active";

  const isPending = profile?.premium_status === "pending";

  if (!paper) {
    return (
      <main className="bg-slate-50 py-20">
        <Container>
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Paper not found
            </h1>

            <Link
              href="/papers"
              className="mt-8 inline-flex rounded-2xl bg-teal-700 px-6 py-3 text-white"
            >
              Back to Papers
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <Link href="/papers" className="inline-flex items-center gap-2 text-sm">
          <ArrowLeft size={16} />
          Back to Papers
        </Link>

        {/* 🔥 STATUS BANNER */}
        {!isPremium && (
          <div
            className={`mt-6 rounded-2xl border p-4 ${
              isPending
                ? "bg-amber-50 border-amber-200"
                : "bg-teal-50 border-teal-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {isPending ? (
                <AlertCircle className="text-amber-600" size={18} />
              ) : (
                <Lock className="text-teal-700" size={18} />
              )}

              <p className="text-sm font-medium">
                {isPending
                  ? "Your premium request is under review. You can still use the free preview."
                  : `You can access the first ${paper.freeQuestions} questions for free.`}
              </p>
            </div>
          </div>
        )}

        {isPremium && (
          <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-center gap-3">
              <BadgeCheck className="text-teal-700" size={18} />
              <p className="text-sm font-semibold text-teal-800">
                Premium active — full access unlocked
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          {/* LEFT SIDE */}
          <div className="rounded-[32px] border bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-bold">{paper.title}</h1>

            <p className="mt-4 text-slate-600">{paper.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>{formatDuration(paper.duration)}</div>
              <div>{paper.totalQuestions} Questions</div>
              <div>{paper.freeQuestions} Free</div>
              <div>{paper.year}</div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <aside className="space-y-6">
            <div className="rounded-[32px] border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Start this paper</h2>

              <div className="mt-6 space-y-3">
                <Link
                  href={`/exam/${paper.id}`}
                  className="w-full inline-flex justify-center rounded-2xl bg-teal-700 px-5 py-3 text-white"
                >
                  {isPremium
                    ? "Start Full Exam"
                    : `Start Free Preview (${paper.freeQuestions} Questions)`}
                </Link>

                {!isPremium && (
                  <Link
                    href="/pricing"
                    className="w-full inline-flex justify-center rounded-2xl border px-5 py-3"
                  >
                    Unlock Full Access
                  </Link>
                )}
              </div>
            </div>

            {/* PREMIUM BOX */}
            {!isPremium && (
              <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-6">
                <h3 className="font-semibold">Premium unlock</h3>

                <ul className="mt-4 text-sm space-y-2">
                  <li>• Unlock all {paper.totalQuestions} questions</li>
                  <li>• Better result insights</li>
                  <li>• Full CBT experience</li>
                </ul>

                <Link
                  href="/pricing"
                  className="mt-4 inline-flex w-full justify-center rounded-2xl bg-black text-white px-4 py-3"
                >
                  Upgrade Now
                </Link>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </main>
  );
}