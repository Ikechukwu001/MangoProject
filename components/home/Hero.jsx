import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Crown,
  Sparkles,
  Activity,
  LockKeyhole,
} from "lucide-react";
import Container from "../layout/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.10),_transparent_30%),linear-gradient(to_bottom,_#ffffff,_#f8fafc)]" />

      <div className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />

      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* LEFT */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm">
              <ShieldCheck size={16} />
              CBT Practice for Pharmacy Technician Students
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Practice Pharmacy Technician CBT Exams With Confidence
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Prepare with past questions, realistic timed practice, and premium
              answer explanations designed to help you perform better in council
              exams across Nigeria.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#auth-section"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Start Practicing
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/papers"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                Explore Papers
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
                <Clock3 size={16} className="text-teal-700" />
                Timed CBT Practice
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
                <FileText size={16} className="text-teal-700" />
                Past Questions
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
                <CheckCircle2 size={16} className="text-teal-700" />
                Free + Premium Access
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Activity size={18} />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Exam Flow
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Realistic practice experience
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <Sparkles size={18} />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Learning
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Clear review and explanations
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <LockKeyhole size={18} />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Access
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Free preview, premium unlock
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-teal-100 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-sky-100 blur-3xl" />

            <div className="relative rounded-[30px] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-6">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                      Active Practice
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
                      Pharmaceutics 2023 Paper 1
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Question 12 of 100
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-slate-200">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                      Time Left
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      01:12:24
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>Exam progress</span>
                    <span>46%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[46%] rounded-full bg-teal-700 transition-all duration-500" />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-500">
                      Question 12
                    </p>

                    <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      <Activity size={14} />
                      Live Practice
                    </div>
                  </div>

                  <p className="mt-3 text-base font-medium leading-7 text-slate-800">
                    Which of the following dosage forms is designed for
                    application to the skin?
                  </p>

                  <div className="mt-5 space-y-3">
                    <button className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                      A. Tablet
                    </button>

                    <button className="w-full rounded-2xl border border-teal-700 bg-teal-50 px-4 py-3 text-left text-sm font-semibold text-teal-800 shadow-sm transition hover:bg-teal-100">
                      B. Ointment
                    </button>

                    <button className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                      C. Capsule
                    </button>

                    <button className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                      D. Syrup
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Score Trend
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      78%
                    </p>
                    <p className="mt-1 text-sm text-emerald-600">
                      Improving steadily
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Access
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
                      <Crown size={16} />
                      Premium
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Review
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-800">
                      Explanations available after submission
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-3 top-10 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur sm:block">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                CBT Mode
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Timed Simulation
              </p>
            </div>

            <div className="absolute -bottom-4 right-2 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur sm:block">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Free Preview
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                First 10 Questions Free
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}