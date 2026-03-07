import Link from "next/link";
import { Clock3, FileText, Lock, ArrowRight } from "lucide-react";
import Container from "../layout/Container";
import SectionTitle from "../common/SectionTitle";

const samplePapers = [
  {
    id: "paper-2023-pharmaceutics-1",
    title: "Pharmaceutics 2023 Paper 1",
    subject: "Pharmaceutics",
    year: 2023,
    duration: "1hr 45mins",
    totalQuestions: 100,
    freeQuestions: 20,
  },
  {
    id: "paper-2022-pharmacology-1",
    title: "Pharmacology 2022 Paper 1",
    subject: "Pharmacology",
    year: 2022,
    duration: "1hr 45mins",
    totalQuestions: 100,
    freeQuestions: 20,
  },
  {
    id: "paper-2021-pce-1",
    title: "PCE 2021 Paper 1",
    subject: "PCE",
    year: 2021,
    duration: "1hr 45mins",
    totalQuestions: 100,
    freeQuestions: 20,
  },
];

export default function PapersPreview() {
  return (
    <section className="bg-white py-16 sm:py-20">
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
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
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

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock3 size={16} className="text-teal-700" />
                  <span>{paper.duration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-teal-700" />
                  <span>{paper.totalQuestions} questions</span>
                </div>

                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-amber-600" />
                  <span>{paper.freeQuestions} free questions available</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-600">
                  Free preview + premium unlock
                </span>
              </div>

              <Link
                href={`/papers/${paper.id}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
              >
                View Paper
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/papers"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Browse All Papers
          </Link>
        </div>
      </Container>
    </section>
  );
}