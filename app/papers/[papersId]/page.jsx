import Link from "next/link";
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
} from "lucide-react";
import Container from "@/components/layout/Container";
import getPaperById from "@/lib/getPaperById";

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}hr ${mins}mins`;
  }

  return `${mins}mins`;
}

export default async function PaperDetailsPage({ params }) {
  const { paperId } = await params;
  const paper = getPaperById(paperId);

  if (!paper) {
    return (
      <main className="bg-slate-50 py-20">
        <Container>
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Paper not found
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              The paper you are trying to view does not exist or may have been
              removed.
            </p>

            <Link
              href="/papers"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:bg-teal-800"
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
        <Link
          href="/papers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Back to Papers
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                {paper.subject}
              </span>

              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {paper.year}
              </span>

              {paper.isPremium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <Crown size={14} />
                  Premium Unlock Available
                </span>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {paper.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              {paper.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock3 size={16} />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {formatDuration(paper.duration)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <FileText size={16} />
                  <span className="text-sm font-medium">Questions</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {paper.totalQuestions}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Lock size={16} />
                  <span className="text-sm font-medium">Free Access</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {paper.freeQuestions} Questions
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarDays size={16} />
                  <span className="text-sm font-medium">Session</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {paper.year}
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                What to expect from this paper
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <ShieldCheck size={18} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      CBT-style interface
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Practice in a structured exam environment with question
                    navigation and timed flow.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <BadgeCheck size={18} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Result review
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Review your performance after submission and understand how
                    well you handled the paper.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <Lock size={18} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Free preview included
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Start with the free questions available in this paper before
                    choosing to unlock full access.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <Layers3 size={18} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Stronger preparation
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Use this paper to improve speed, confidence, and familiarity
                    with Pharmacy Technician CBT practice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Start this paper
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Begin your timed practice now or explore premium access for full
                questions and better review features.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href={`/exam/${paper.id}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:bg-teal-800"
                >
                  Start Free Practice
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/pricing"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  View Premium Access
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Crown size={20} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Premium unlock
                  </h3>
                  <p className="text-sm text-slate-600">
                    More complete exam preparation
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                <li>• Unlock all {paper.totalQuestions} questions</li>
                <li>• Get answer explanations after submission</li>
                <li>• Review your practice in more detail</li>
                <li>• Access more advanced preparation flow</li>
              </ul>

              <Link
                href="/pricing"
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Unlock Premium
              </Link>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Paper summary
              </h3>

              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subject</span>
                  <span className="font-semibold text-slate-900">
                    {paper.subject}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Year</span>
                  <span className="font-semibold text-slate-900">
                    {paper.year}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Duration</span>
                  <span className="font-semibold text-slate-900">
                    {formatDuration(paper.duration)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Total Questions</span>
                  <span className="font-semibold text-slate-900">
                    {paper.totalQuestions}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Free Questions</span>
                  <span className="font-semibold text-slate-900">
                    {paper.freeQuestions}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}