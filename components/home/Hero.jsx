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
  BadgeCheck,
  BarChart3,
  CircleDashed,
  Star,
} from "lucide-react";
import Container from "../layout/Container";

const trustItems = [
  { icon: Clock3, label: "Timed CBT" },
  { icon: FileText, label: "Past Questions" },
  { icon: CheckCircle2, label: "Answer Review" },
];

const metricCards = [
  {
    icon: Activity,
    title: "Real exam flow",
    text: "Practice in a proper CBT environment that feels familiar before exam day.",
  },
  {
    icon: Sparkles,
    title: "Smart explanations",
    text: "Learn faster with clear breakdowns that help you understand each answer.",
  },
  {
    icon: LockKeyhole,
    title: "Flexible access",
    text: "Preview free questions first, then unlock the full premium experience.",
  },
  {
    icon: BarChart3,
    title: "Performance insight",
    text: "Track your progress and build confidence as your score improves.",
  },
];

const quickStats = [
  { value: "100+", label: "Practice Questions" },
  { value: "CBT", label: "Real Simulation" },
  { value: "NG", label: "Nigeria Focused" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f7fbfc]">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(to_bottom,_#f8fcfd,_#ffffff_40%,_#f8fafc)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_22%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.05),_transparent_28%)]" />
      <div className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(to_right,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.10)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="absolute left-[8%] top-16 -z-10 h-36 w-36 rounded-full bg-teal-200/40 blur-3xl sm:h-40 sm:w-40" />
      <div className="absolute right-[8%] top-12 -z-10 h-36 w-36 rounded-full bg-sky-200/40 blur-3xl sm:h-44 sm:w-44" />
      <div className="absolute bottom-10 left-1/2 -z-10 h-28 w-52 -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl sm:h-36 sm:w-64" />

      <Container className="py-12 sm:py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-14">
          {/* LEFT */}
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-teal-200/80 bg-white/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur sm:px-4 sm:text-xs">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
                <ShieldCheck size={14} />
              </span>
              <span className="min-w-0 truncate">
                CBT Practice for Pharmacy Technician Students
              </span>
            </div>

            <h1 className="mt-5 max-w-[12ch] text-[2rem] font-bold leading-[1] tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
              Practice smarter. Pass with confidence.
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-lg">
              Prepare for pharmacy technician exams with realistic CBT practice,
              past questions, timed sessions, and premium explanations designed
              to help you perform better in Nigeria.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 xs:grid-cols-2 sm:flex sm:flex-wrap">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="inline-flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm sm:text-sm"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <Icon size={15} />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#auth-section"
                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-teal-700 bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(13,148,136,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-teal-800 sm:w-auto"
              >
                Start Practicing
                <ArrowRight
                  size={18}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/papers"
                className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
              >
                Explore Papers
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
              {quickStats.map((item) => (
                <div
                  key={item.label}
                  className="min-w-0 rounded-[22px] border border-slate-200/80 bg-white/95 px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-lg font-bold text-slate-950 sm:text-2xl">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {metricCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="min-w-0 rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.10)] sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700 ring-1 ring-teal-100">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="min-w-0">
            <div className="relative mx-auto w-full max-w-[620px]">
              {/* floating badges kept inside mobile safe zone */}
              <div className="absolute left-3 top-3 z-20 rounded-2xl border border-white/80 bg-white/90 px-3 py-2 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:left-[-14px] sm:top-8 sm:px-4 sm:py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
                  CBT Mode
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-900 sm:text-sm">
                  Timed Simulation
                </p>
              </div>

              <div className="absolute bottom-3 right-3 z-20 rounded-2xl border border-white/80 bg-white/90 px-3 py-2 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:bottom-[-12px] sm:right-3 sm:px-4 sm:py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
                  Free Preview
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-900 sm:text-sm">
                  First 10 Questions Free
                </p>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white/70 p-2.5 shadow-[0_30px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur-sm sm:rounded-[34px] sm:p-4">
                <div className="rounded-[24px] border border-slate-200/80 bg-[linear-gradient(to_bottom,_#ffffff,_#f8fafc)] p-3 sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div className="min-w-0">
                      <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700 sm:text-[11px]">
                        <CircleDashed size={13} className="shrink-0" />
                        <span className="truncate">Active Practice</span>
                      </div>

                      <h3 className="mt-3 text-base font-bold text-slate-950 sm:text-xl">
                        Pharmaceutics 2023 Paper 1
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Question 12 of 100
                      </p>
                    </div>

                    <div className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-center shadow-sm sm:w-auto">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Time Left
                      </p>
                      <p className="mt-1 text-base font-bold text-slate-950 sm:text-lg">
                        01:12:24
                      </p>
                    </div>
                  </div>

                  {/* mobile-first grid */}
                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="min-w-0 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)] sm:p-5">
                      <div className="flex flex-col gap-3 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Question 12
                        </p>

                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                          <Activity size={14} />
                          Live Practice
                        </div>
                      </div>

                      <p className="mt-4 text-sm font-medium leading-7 text-slate-800 sm:text-base">
                        Which of the following dosage forms is designed for
                        application to the skin?
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-3">
                        <button className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                          A. Tablet
                        </button>

                        <button className="w-full rounded-2xl border border-teal-600 bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-3 text-left text-sm font-semibold text-teal-800 shadow-sm">
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

                    {/* mobile grid for side cards */}
                    <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-1">
                      <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Progress
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-950">
                          46%
                        </p>
                        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full w-[46%] rounded-full bg-gradient-to-r from-teal-600 to-cyan-500" />
                        </div>
                      </div>

                      <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Score Trend
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-950">
                          78%
                        </p>
                        <p className="mt-1 text-sm text-emerald-600">
                          Improving steadily
                        </p>
                      </div>

                      <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm min-[430px]:col-span-2 lg:col-span-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Access
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
                          <Crown size={16} />
                          Premium
                        </div>
                        <div className="mt-3 inline-flex items-start gap-2 text-sm text-slate-700">
                          <BadgeCheck size={15} className="mt-0.5 shrink-0 text-teal-700" />
                          <span>Explanations after submission</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                      Real exam-style interface
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                      Built for focused revision
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                      Trusted by serious students
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-4 top-4 z-20 hidden items-center gap-2 rounded-full border border-white/80 bg-slate-950 px-3 py-2 text-white shadow-lg sm:inline-flex">
                <Star size={13} className="fill-current text-amber-400" />
                <span className="text-xs font-semibold">Premium CBT Feel</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}