import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Lightbulb,
  Target,
  TriangleAlert,
} from "lucide-react";
import {
  getAdjacentGuides,
  getAllGuides,
  getGuide,
} from "../../../_lib/guides";
import GuideBody from "../../../_components/GuideBody";
import QuickCheck from "../../../_components/QuickCheck";
import { CompleteButton } from "../../../_components/Progress";

// Only lessons that exist as files are served; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({
    subject: guide.subject,
    course: guide.courseSlug,
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { subject, course, slug } = await params;
  const guide = getGuide(subject, course, slug);
  if (!guide) return {};

  return {
    title: `${guide.title} (${guide.courseCode}) | PharmTechSuccess`,
    description: guide.description,
  };
}

export default async function GuidePage({ params }) {
  const { subject, course, slug } = await params;
  const guide = getGuide(subject, course, slug);
  if (!guide) notFound();

  const { previous, next } = getAdjacentGuides(guide);

  return (
    <main className="min-h-screen bg-stone-50">
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
          <Link href="/study" className="hover:text-teal-700">
            Study Guides
          </Link>
          <span className="mx-2">/</span>
          <span>{guide.courseCode}</span>
        </nav>

        <header className="mt-6 border-b border-stone-200 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-teal-700 px-3 py-1 text-white">
              {guide.courseCode}
            </span>
            {guide.courseTitle && (
              <span className="text-stone-500">{guide.courseTitle}</span>
            )}
            {guide.draft && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">
                Draft
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {guide.title}
          </h1>
          {guide.readingTime && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone-500">
              <Clock className="h-4 w-4" />
              {guide.readingTime} minute read
            </p>
          )}
        </header>

        {guide.objectives.length > 0 && (
          <section
            aria-labelledby="objectives"
            className="mt-8 rounded-2xl border border-stone-200 bg-white p-6"
          >
            <h2
              id="objectives"
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-500"
            >
              <Target className="h-4 w-4" />
              What you will learn
            </h2>
            <ul className="mt-4 space-y-2 text-stone-700">
              {guide.objectives.map((objective, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-stone-300" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {guide.keyPoints.length > 0 && (
          <section
            aria-labelledby="key-points"
            className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-6"
          >
            <h2
              id="key-points"
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-800"
            >
              <Lightbulb className="h-4 w-4" />
              Key points
            </h2>
            <ul className="mt-4 space-y-3">
              {guide.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-stone-800">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-2">
          <GuideBody content={guide.content} />
        </div>

        {guide.examFocus.length > 0 && (
          <section
            aria-labelledby="exam-focus"
            className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6"
          >
            <h2
              id="exam-focus"
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-900"
            >
              <TriangleAlert className="h-4 w-4" />
              Exam focus
            </h2>
            <ul className="mt-4 space-y-3">
              {guide.examFocus.map((tip, i) => (
                <li key={i} className="flex gap-3 text-stone-800">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <QuickCheck questions={guide.quickCheck} />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-8">
          <CompleteButton id={guide.id} />
          <Link
            href="/papers"
            className="text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            Practise past questions
          </Link>
        </div>

        <nav
          aria-label="Lesson navigation"
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          {previous ? (
            <Link
              href={previous.href}
              className="group rounded-xl border border-stone-200 bg-white p-4 hover:border-teal-400"
            >
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </span>
              <span className="mt-1 block font-medium text-stone-900 group-hover:text-teal-700">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={next.href}
              className="group rounded-xl border border-stone-200 bg-white p-4 text-right hover:border-teal-400"
            >
              <span className="flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                Next
                <ChevronRight className="h-4 w-4" />
              </span>
              <span className="mt-1 block font-medium text-stone-900 group-hover:text-teal-700">
                {next.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </main>
  );
}
