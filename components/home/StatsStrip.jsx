import { Clock3, FileText, ShieldCheck, GraduationCap } from "lucide-react";
import Container from "../layout/Container";

const stats = [
  {
    icon: FileText,
    title: "Past Questions by Year",
    text: "Practice with organized papers from different exam years.",
  },
  {
    icon: Clock3,
    title: "1hr 45min Timed Papers",
    text: "Train under the same time pressure students expect in CBT exams.",
  },
  {
    icon: ShieldCheck,
    title: "Real CBT Practice Flow",
    text: "Build confidence with a familiar exam-style question interface.",
  },
  {
    icon: GraduationCap,
    title: "Free + Premium Access",
    text: "Start free, then unlock full questions and explanations when ready.",
  },
];

export default function StatsStrip() {
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <Container className="py-8 sm:py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon size={20} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}