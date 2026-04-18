import {
  MonitorSmartphone,
  FileCheck2,
  BarChart3,
  BookOpenCheck,
  Layers3,
  Smartphone,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import Container from "../layout/Container";

const features = [
  {
    icon: MonitorSmartphone,
    badge: "CBT Mode",
    title: "Real exam feel",
    text: "Timed practice that feels close to the actual Pharmacy Technician CBT environment.",
    featured: true,
  },
  {
    icon: FileCheck2,
    badge: "Question Bank",
    title: "Past papers arranged properly",
    text: "Revise by year and paper without confusion.",
  },
  {
    icon: BarChart3,
    badge: "Performance",
    title: "Track your progress",
    text: "See your score clearly after every attempt.",
  },
  {
    icon: BookOpenCheck,
    badge: "Premium Review",
    title: "Answer explanations",
    text: "Understand why an option is correct after submission.",
  },
  {
    icon: Layers3,
    badge: "Practice Style",
    title: "Single or cumulative practice",
    text: "Practice one paper or combine multiple papers together.",
  },
  {
    icon: Smartphone,
    badge: "Any Device",
    title: "Built for mobile too",
    text: "Practice comfortably on phone or laptop.",
  },
];

const featuredStats = [
  {
    icon: Clock3,
    label: "Timed practice",
  },
  {
    icon: CheckCircle2,
    label: "Past questions",
  },
  {
    icon: ShieldCheck,
    label: "Exam-focused flow",
  },
];

export default function Features() {
  const featured = features.find((item) => item.featured);
  const others = features.filter((item) => !item.featured);

  return (
    <section className="relative overflow-hidden bg-[#f8fbfc] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(to_bottom,_#f8fbfc,_#ffffff_36%,_#f8fafc)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.10),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.08),_transparent_24%)]" />
      <div className="absolute left-[10%] top-16 -z-10 h-40 w-40 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="absolute right-[8%] bottom-10 -z-10 h-44 w-44 rounded-full bg-sky-200/30 blur-3xl" />

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur sm:text-xs">
            <Sparkles size={14} />
            Why PharmTechSuccess
          </div>

          <h2 className="mx-auto mt-5 max-w-4xl text-[2rem] font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
            Everything you need to prepare smarter
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-lg">
            A clean and focused CBT practice experience built to help Pharmacy
            Technician students prepare with confidence.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:mt-12 lg:grid-cols-12 lg:gap-5">
          {/* Featured card */}
          <div className="lg:col-span-7">
            <div className="group relative h-full overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-white/70 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_55px_rgba(15,23,42,0.10)] sm:p-6 lg:p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-teal-100/50 blur-3xl transition duration-300 group-hover:bg-teal-200/60" />
              <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-sky-100/40 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50 text-teal-700 shadow-sm transition duration-300 group-hover:bg-teal-700 group-hover:text-white">
                  <featured.icon size={28} />
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition duration-300 group-hover:border-teal-200 group-hover:text-teal-700">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div className="relative mt-6">
                <div className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700 sm:text-[11px]">
                  {featured.badge}
                </div>

                <h3 className="mt-4 max-w-[14ch] text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[2rem] sm:leading-[1.05]">
                  {featured.title}
                </h3>

                <p className="mt-4 max-w-[40ch] text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {featured.text}
                </p>
              </div>

              <div className="relative mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {featuredStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
                        <Icon size={18} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-900">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="relative mt-7 grid grid-cols-1 gap-3 min-[430px]:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
                  <p className="text-lg font-bold text-slate-950">CBT</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Exam Style
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
                  <p className="text-lg font-bold text-slate-950">Easy</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    To Navigate
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
                  <p className="text-lg font-bold text-slate-950">Better</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Preparation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Smaller cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            {others.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative min-w-0 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] ring-1 ring-white/70 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)] sm:p-5"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-teal-100/40 blur-2xl transition duration-300 group-hover:bg-teal-200/50" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-[18px] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50 text-teal-700 shadow-sm transition duration-300 group-hover:bg-teal-700 group-hover:text-white">
                      <Icon size={22} />
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition duration-300 group-hover:border-teal-200 group-hover:text-teal-700">
                      <ArrowUpRight size={15} />
                    </div>
                  </div>

                  <div className="relative mt-5">
                    <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                      {feature.badge}
                    </div>

                    <h3 className="mt-4 max-w-[15ch] text-base font-semibold tracking-[-0.02em] text-slate-950 sm:text-lg">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {feature.text}
                    </p>
                  </div>

                  <div className="relative mt-5 h-px w-full bg-gradient-to-r from-teal-200/80 via-slate-200 to-transparent" />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}