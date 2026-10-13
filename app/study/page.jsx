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
    <main className="min-h-screen overflow-x-clip bg-stone-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Page heading */}
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700 sm:text-sm">
            Study Guides
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Understand the topics behind the questions
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
            Short, clear guides with the key points up front and a plain
            explanation behind them. Organised by the Pharmacists Council of
            Nigeria Pharmacy Technicians Training Curriculum, so you can study
            exactly what the exam covers.
          </p>
        </header>

        {/* Empty catalog state */}
        {catalog.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-12 text-center sm:mt-12 sm:px-8">
            <p className="text-base font-medium text-stone-800">
              Study guides are on the way.
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Check back soon for more exam-focused study materials.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-10 sm:mt-14 sm:space-y-14">
            {catalog.map((subject) => (
              <section
                key={subject.subject}
                aria-labelledby={`subject-${subject.subject}`}
                className="min-w-0"
              >
                {/* Subject heading */}
                <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <span className="inline-flex shrink-0 items-center rounded-full bg-teal-700 px-3 py-1.5 text-xs font-bold tracking-wide text-white">
                    {subject.subjectCode}
                  </span>

                  <h2
                    id={`subject-${subject.subject}`}
                    className="min-w-0 break-words text-xl font-bold leading-snug tracking-tight text-stone-900 sm:text-2xl"
                  >
                    {subject.subjectName}
                  </h2>
                </div>

                {/* Responsive course grid */}
                <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2 lg:gap-6">
                  {subject.courses.map((course) => (
                    <article
                      key={course.courseSlug}
                      className="flex min-w-0 flex-col rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5 lg:p-6"
                    >
                      {/* Course information */}
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                          {course.courseCode}
                        </p>

                        <h3 className="mt-1 break-words text-base font-bold leading-snug text-stone-900 sm:text-lg">
                          {course.courseTitle || course.courseCode}
                        </h3>
                      </div>

                      <div className="mt-4 min-w-0">
                        <CourseProgress
                          ids={course.guides.map((guide) => guide.id)}
                        />
                      </div>

                      {/* Guide list */}
                      <ul className="mt-3 min-w-0 divide-y divide-stone-100">
                        {course.guides.map((guide) => (
                          <li key={guide.id} className="min-w-0">
                            <Link
                              href={guide.href}
                              className="group flex min-w-0 items-center gap-2 rounded-lg py-3 text-stone-800 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                            >
                              {/* Guide title and draft label */}
                              <span className="flex min-w-0 flex-1 items-start gap-2">
                                <span className="min-w-0 flex-1 break-words text-sm font-medium leading-6 sm:text-[15px]">
                                  {guide.title}
                                </span>

                                {guide.draft && (
                                  <span className="mt-1 shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                                    Draft
                                  </span>
                                )}
                              </span>

                              {/* Reading time, completion, and navigation */}
                              <span className="flex shrink-0 items-center gap-2 text-xs text-stone-500 sm:gap-3">
                                {guide.readingTime && (
                                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                    <Clock
                                      aria-hidden="true"
                                      className="h-3.5 w-3.5"
                                    />
                                    <span>{guide.readingTime} min</span>
                                  </span>
                                )}

                                <CompletedMark id={guide.id} />

                                <ChevronRight
                                  aria-hidden="true"
                                  className="h-4 w-4 shrink-0 text-stone-300 transition-colors group-hover:text-teal-600"
                                />
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