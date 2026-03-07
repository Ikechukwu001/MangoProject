import {
  MonitorSmartphone,
  FileCheck2,
  BarChart3,
  BookOpenCheck,
  Layers3,
  Smartphone,
} from "lucide-react";
import Container from "../layout/Container";
import SectionTitle from "../common/SectionTitle";

const features = [
  {
    icon: MonitorSmartphone,
    title: "Real CBT exam feel",
    text: "Practice in a timed format that feels close to the actual CBT exam experience so students can get familiar with the system before exam day.",
  },
  {
    icon: FileCheck2,
    title: "Past questions organized by paper",
    text: "Access questions arranged by year and paper so revision becomes more focused and less stressful.",
  },
  {
    icon: BarChart3,
    title: "Track your performance",
    text: "Review your score after each attempt and gradually identify areas where you need more work.",
  },
  {
    icon: BookOpenCheck,
    title: "Explanations after submission",
    text: "Premium users can unlock answer explanations to understand why an option is correct instead of just memorizing answers.",
  },
  {
    icon: Layers3,
    title: "Single or cumulative practice",
    text: "Attempt one paper at a time or combine multiple papers for broader revision and stronger preparation.",
  },
  {
    icon: Smartphone,
    title: "Practice anywhere",
    text: "Use the platform on your phone or laptop in a clean and easy interface built for convenience.",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionTitle
          badge="Why PharmTechSuccess"
          title="A smarter way to prepare for Pharmacy Technician CBT exams"
          text="Designed to help students practice with confidence, improve speed, and understand their performance in a professional exam-like environment."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}