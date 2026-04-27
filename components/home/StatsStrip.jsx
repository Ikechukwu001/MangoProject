import { Clock3, FileText, ShieldCheck, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import Container from "../layout/Container";

const stats = [
  {
    icon: FileText,
    value: "6+",
    title: "Years of past questions",
    text: "Every paper archived and ready to practise — sorted by year, no digging required.",
  },
  {
    icon: Clock3,
    value: "1:45",
    label: "hrs",
    title: "Exam-accurate timing",
    text: "Train under the exact same time conditions as the real CBT. No surprises on exam day.",
    featured: true,
  },
  {
    icon: ShieldCheck,
    value: "100%",
    title: "CBT-style interface",
    text: "Question flow, layout, and pacing built to match the real Pharmacy Technician exam.",
  },
  {
    icon: GraduationCap,
    value: "Free",
    title: "To get started",
    text: "No card needed. Begin practising immediately, then upgrade when you need the full experience.",
  },
];

export default function StatsStrip() {
  const featured = stats.find((s) => s.featured);
  const others = stats.filter((s) => !s.featured);

  return (
    <section className="border-y border-slate-100 bg-white py-0">
      <Container className="!px-0 sm:!px-0 lg:!px-0 xl:!px-0">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">

          {/* Left pair */}
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {others.slice(0, 2).map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative flex flex-col justify-between gap-6 overflow-hidden px-8 py-10 transition-colors duration-200 hover:bg-slate-50 sm:py-12"
                >
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition duration-200 group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-600">
                      <Icon size={17} />
                    </div>

                    <div className="mt-6 flex items-end gap-1 leading-none">
                      <span className="text-[3.5rem] font-black tracking-[-0.05em] text-slate-900 leading-none">
                        {item.value}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-400">
                      {item.text}
                    </p>
                  </div>

                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-teal-500 transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>

          {/* Centre — featured */}
          <div className="group relative flex flex-col items-center justify-center overflow-hidden border-x border-slate-100 bg-teal-600 px-10 py-12 text-center sm:py-14 lg:min-w-[280px]">

            {/* Background pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative">
              <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-white/20 text-white border border-white/20">
                <featured.icon size={18} />
              </div>

              <div className="mt-5 flex items-end justify-center gap-1 leading-none">
                <span className="text-[4rem] font-black tracking-[-0.05em] text-white leading-none">
                  {featured.value}
                </span>
                {featured.label && (
                  <span className="mb-2 text-lg font-semibold text-teal-200">
                    {featured.label}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm font-semibold text-white">
                {featured.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-teal-100/80 max-w-[22ch] mx-auto">
                {featured.text}
              </p>

              <Link
                href="/papers"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-widest text-teal-700 transition hover:bg-teal-50"
              >
                Start practising <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right pair */}
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {others.slice(2).map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative flex flex-col justify-between gap-6 overflow-hidden px-8 py-10 transition-colors duration-200 hover:bg-slate-50 sm:py-12"
                >
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition duration-200 group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-600">
                      <Icon size={17} />
                    </div>

                    <div className="mt-6 flex items-end gap-1 leading-none">
                      <span className="text-[3.5rem] font-black tracking-[-0.05em] text-slate-900 leading-none">
                        {item.value}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-400">
                      {item.text}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-teal-500 transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>

        </div>
      </Container>
    </section>
  );
}