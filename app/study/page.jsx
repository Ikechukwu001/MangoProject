import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { getCatalog } from "./_lib/guides";
import { CompletedMark, CourseProgress } from "./_components/Progress";

export const metadata = {
  title: "Study Guides | PharmTechSuccess",
  description:
    "Clear, exam-focused study guides for Nigerian Pharmacy Technician students, organised by the PCN Pharmacy Technicians Training Curriculum.",
};

export default function StudyIndexPage() {
  const catalog = getCatalog();

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Study Guides
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Understand the topics behind the questions
          </h1>
          <p className="mt-4 text-lg leading-8 text-stone-600">
            Short, clear guides with the key points up front and a plain
            explanation behind them. Organised by the Pharmacists Council of
            Nigeria Pharmacy Technicians Training Curriculum, so you can study
            exactly what the exam covers.
          </p>
        </header>

        {catalog.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">
            Study guides are on the way. Check back soon.
          </div>
        ) : (
          <div className="mt-12 space-y-14">
            {catalog.map((subject) => (
              <section key={subject.subject} aria-labelledby={subject.subject}>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                    {subject.subjectCode}
                  </span>
                  <h2
                    id={subject.subject}
                    className="text-2xl font-semibold tracking-tight text-stone-900"
                  >
                    {subject.subjectName}
                  </h2>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {subject.courses.map((course) => (
                    <article
                      key={course.courseSlug}
                      className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                        {course.courseCode}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-stone-900">
                        {course.courseTitle || course.courseCode}
                      </h3>

                      <CourseProgress ids={course.guides.map((g) => g.id)} />

                      <ul className="mt-4 divide-y divide-stone-100">
                        {course.guides.map((guide) => (
                          <li key={guide.id}>
                            <Link
                              href={guide.href}
                              className="group flex items-center justify-between gap-3 py-3 text-stone-800 hover:text-teal-700"
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                <span className="truncate font-medium">
                                  {guide.title}
                                </span>
                                {guide.draft && (
                                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                                    Draft
                                  </span>
                                )}
                              </span>
                              <span className="flex shrink-0 items-center gap-3 text-xs text-stone-500">
                                {guide.readingTime && (
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {guide.readingTime} min
                                  </span>
                                )}
                                <CompletedMark id={guide.id} />
                                <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-teal-600" />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
