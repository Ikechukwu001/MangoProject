import Link from "next/link";
import {
  Clock3,
  FileText,
  Lock,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Crown,
} from "lucide-react";
import Container from "../layout/Container";
import SectionTitle from "../common/SectionTitle";

const samplePapers = [
  {
    id: "waec-2020-math",
    title: "WAEC 2020 Mathematics",
    subject: "Mathematics",
    year: "2020",
    duration: "1 hr 30 mins",
    totalQuestions: 100,
    freeQuestions: 10,
    premium: false,
  },
  {
    id: "waec-2021-english",
    title: "WAEC 2021 English",
    subject: "English",
    year: "2021",
    duration: "1 hr 15 mins",
    totalQuestions: 100,
    freeQuestions: 10,
    premium: false,
  },
  {
    id: "aum-sep-2021-pharmacology",
    title: "AUM September 2021 Pharmacology",
    subject: "Pharmacology",
    year: "2021",
    duration: "2 hrs",
    totalQuestions: 100,
    freeQuestions: 10,
    premium: true,
  },
];

export default function PapersPreview() {
  return (
    <section className="relative bg-white py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(13,148,136,0.06),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.05),_transparent_25%)]" />

      <Container>
        <SectionTitle
          badge="Available papers"
          title="Start practicing with past papers"
          text="Choose a paper, test yourself under time, and build the confidence you need before the real CBT exam."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {samplePapers.map((paper) => (
            <div
              key={paper.id}
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-200/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    <BookOpen size={14} />
                    {paper.subject}
                  </span>

                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                    {paper.title}
                  </h3>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {paper.year}
                </span>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3">
                  <Clock3 size={16} className="text-teal-700" />
                  <span>{paper.duration}</span>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3">
                  <FileText size={16} className="text-teal-700" />
                  <span>{paper.totalQuestions} questions</span>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-3">
                  <Lock size={16} className="text-amber-600" />
                  <span>{paper.freeQuestions} free questions available</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Access Type
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Free preview available before full unlock
                    </p>
                  </div>

                  {paper.premium ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                      <Crown size={14} />
                      Premium
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                      <CheckCircle2 size={14} />
                      Preview Open
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <Link
                  href={`/papers/${paper.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
                >
                  View Paper
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <p className="text-xs font-medium text-slate-400">
                  Start with free preview
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/papers"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
          >
            Browse All Papers
          </Link>
        </div>
      </Container>
    </section>
  );
}