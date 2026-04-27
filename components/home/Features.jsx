import {
  MonitorSmartphone,
  FileCheck2,
  BarChart3,
  BookOpenCheck,
  Layers3,
  Smartphone,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Container from "../layout/Container";

const features = [
  {
    icon: MonitorSmartphone,
    badge: "CBT Mode",
    title: "Practice in a real exam environment",
    text: "Our timed CBT simulation mirrors the actual Pharmacy Technician exam interface — so when exam day comes, nothing feels new.",
    featured: true,
  },
  {
    icon: FileCheck2,
    badge: "Question Bank",
    title: "Every past paper, perfectly organised",
    text: "Browse and revise by year and paper with zero confusion. No hunting, no guessing — just focused practice.",
  },
  {
    icon: BarChart3,
    badge: "Performance Tracking",
    title: "Know exactly where you stand",
    text: "Instant scores after every session. Spot your weak areas and double down before the exam.",
  },
  {
    icon: BookOpenCheck,
    badge: "Deep Review",
    title: "Understand every answer, not just the result",
    text: "Detailed explanations for every question — so you learn the reasoning, not just the answer.",
  },
  {
    icon: Layers3,
    badge: "Flexible Practice",
    title: "One paper or many — you choose",
    text: "Drill a single paper or blend multiple years into one cumulative session for broader coverage.",
  },
  {
    icon: Smartphone,
    badge: "Any Device",
    title: "Study on your terms, on any screen",
    text: "Fully optimised for mobile and desktop. Pick up where you left off — on the bus, at home, anywhere.",
  },
];

const featuredHighlights = [
  {
    icon: MonitorSmartphone,
    label: "Timed CBT simulation",
    sub: "Mirrors the real exam interface",
  },
  {
    icon: BarChart3,
    label: "Live score tracking",
    sub: "Know where you stand instantly",
  },
  {
    icon: BookOpenCheck,
    label: "Answer explanations",
    sub: "Learn the why, not just the what",
  },
];

export default function Features() {
  const featured = features.find((f) => f.featured);
  const others = features.filter((f) => !f.featured);

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
      <Container>

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-teal-700">
            <Sparkles size={12} />
            Built for Pharmacy Technician Students
          </div>

          <h2 className="mt-5 text-[1.9rem] font-bold leading-[1.1] tracking-[-0.03em] text-slate-900 sm:text-4xl lg:text-[3.2rem]">
            The smarter way to pass your{" "}
            <span className="text-teal-600">Pharmacy Technician exam</span>
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
            PharmTechSuccess gives you structured CBT practice, real past questions,
            and the performance insights you need — all in one focused platform.
          </p>
        </div>

        {/* Featured card */}
        <div className="mt-14 lg:mt-16">
          <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_8px_40px_rgba(15,23,42,0.07)] transition duration-300 hover:border-teal-200 hover:shadow-[0_16px_56px_rgba(15,23,42,0.11)] sm:p-8 lg:p-10">

            <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 ring-1 ring-inset ring-teal-300/30 transition duration-300 group-hover:opacity-100" />

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">

              {/* Left — copy */}
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal-600">
                  {featured.badge}
                </span>

                <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-900 sm:text-3xl lg:text-[2.1rem] lg:leading-[1.1]">
                  {featured.title}
                </h3>

                <p className="mt-4 text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
                  {featured.text}
                </p>

                <Link
                  href="#"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-700"
                >
                  Start practising free <ArrowRight size={15} />
                </Link>
              </div>

              {/* Right — icon strip */}
              <div className="flex flex-col gap-6 border-l border-slate-100 pl-8 lg:pl-12">
                {featuredHighlights.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-600 transition duration-300 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{label}</p>
                      <p className="mt-0.5 text-sm text-slate-500">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Feature rows */}
        <div className="mt-10 divide-y divide-slate-100">
          {others.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group flex items-start gap-5 py-7 sm:gap-7 sm:py-8"
              >
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition duration-200 group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-600">
                  <Icon size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-900 sm:text-lg">
                      {feature.title}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      {feature.badge}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500 sm:text-[15px] sm:leading-7">
                    {feature.text}
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="mt-1.5 shrink-0 text-slate-300 transition duration-200 group-hover:text-teal-500"
                />
              </div>
            );
          })}
        </div>

      </Container>
    </section>
  );
}