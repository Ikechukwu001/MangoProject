"use client";

import { motion } from "framer-motion";
import { UserPlus, FileText, TimerReset, BarChart3, ArrowRight } from "lucide-react";
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

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(13,148,136,0.07),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.06),_transparent_25%)]" />

      <Container>
        <SectionTitle
          badge="How it works"
          title="A simple path to smarter CBT preparation"
          text="PharmTechSuccess is designed to be straightforward so students can focus on practice instead of struggling with the system."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-12"
        >
          {/* desktop progress line */}
          <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-[2px] xl:block">
            <div className="mx-auto h-full w-[82%] bg-gradient-to-r from-teal-100 via-sky-100 to-teal-100" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="group relative"
                >
                  <div className="relative rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 group-hover:shadow-xl group-hover:shadow-slate-200/70">
                    {/* step connector cue */}
                    {index !== steps.length - 1 && (
                      <div className="absolute -right-3 top-10 z-10 hidden xl:flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm">
                        <ArrowRight size={16} />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0 rgba(20,184,166,0)",
                            "0 0 0 10px rgba(20,184,166,0.08)",
                            "0 0 0 rgba(20,184,166,0)",
                          ],
                        }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          delay: index * 0.25,
                        }}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"
                      >
                        <Icon size={24} />
                      </motion.div>

                      <span className="text-sm font-bold tracking-[0.2em] text-slate-300 transition group-hover:text-teal-300">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                      {step.text}
                    </p>

                    <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(index + 1) * 25}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.15 }}
                        className="h-full rounded-full bg-gradient-to-r from-teal-600 to-sky-500"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}