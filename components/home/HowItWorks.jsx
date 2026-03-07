import { UserPlus, FileText, TimerReset, BarChart3 } from "lucide-react";
import Container from "../layout/Container";
import SectionTitle from "../common/SectionTitle";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your account",
    text: "Sign up and get access to free practice features so you can start preparing immediately.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Choose a paper or practice mode",
    text: "Select a single paper by year or prepare across multiple papers when cumulative mode is available.",
  },
  {
    number: "03",
    icon: TimerReset,
    title: "Take the timed CBT exam",
    text: "Practice in a structured exam interface with a timer to build confidence and speed.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Review your result and improve",
    text: "See your score, review your answers, and unlock explanations to learn better after submission.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <SectionTitle
          badge="How it works"
          title="A simple path to smarter CBT preparation"
          text="PharmTechSuccess is designed to be straightforward so students can focus on practice instead of struggling with the system."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon size={24} />
                  </div>

                  <span className="text-sm font-bold tracking-[0.2em] text-slate-300">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}