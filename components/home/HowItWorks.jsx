"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { ArrowRight } from "lucide-react";
import Container from "../layout/Container";
import SectionTitle from "../common/SectionTitle";

// ===============================
// IMPORT YOUR 4 LOTTIE FILES HERE
// Replace these paths with your real files
// Example:
// import createAccountAnimation from "@/public/lottie/create-account.json";
// ===============================
import createAccountAnimation from "@/public/lottie/send-user.json";
import choosePaperAnimation from "@/public/lottie/Profile-user-card.json";
import takeExamAnimation from "@/public/lottie/Online-Test.json";
import reviewResultAnimation from "@/public/lottie/Premium.json";

const steps = [
  {
    number: "01",
    title: "Create your account",
    text: "Sign up and get access to free practice features so you can start preparing immediately.",
    animation: createAccountAnimation, // <-- PUT STEP 1 ANIMATION HERE
  },
  {
    number: "02",
    title: "Choose a paper or practice mode",
    text: "Select a single paper by year or prepare across multiple papers when cumulative mode is available.",
    animation: choosePaperAnimation, // <-- PUT STEP 2 ANIMATION HERE
  },
  {
    number: "03",
    title: "Take the timed CBT exam",
    text: "Practice in a structured exam interface with a timer to build confidence and speed.",
    animation: takeExamAnimation, // <-- PUT STEP 3 ANIMATION HERE
  },
  {
    number: "04",
    title: "Review your result and improve",
    text: "See your score, review your answers, and unlock explanations to learn better after submission.",
    animation: reviewResultAnimation, // <-- PUT STEP 4 ANIMATION HERE
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
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
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24">
      {/* background effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(13,148,136,0.08),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.08),_transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-white/70 to-transparent" />

      <Container>
        <SectionTitle
          badge="How it works"
          title="A simple path to smarter CBT preparation"
          text="PharmTechSuccess is designed to feel easy from start to finish, so students can focus on passing instead of struggling with the platform."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative mt-12"
        >
          {/* desktop line */}
          <div className="pointer-events-none absolute left-0 right-0 top-[86px] hidden xl:block">
            <div className="mx-auto h-[2px] w-[82%] bg-gradient-to-r from-teal-100 via-sky-100 to-teal-100" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => {
              return (
                <motion.div
                  key={step.number}
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="group relative"
                >
                  <div className="relative h-full overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 group-hover:border-teal-200 group-hover:shadow-2xl group-hover:shadow-slate-200/70 sm:p-6">
                    {/* arrow between cards */}
                    {index !== steps.length - 1 && (
                      <div className="absolute -right-3 top-[76px] z-10 hidden xl:flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm">
                        <ArrowRight size={16} />
                      </div>
                    )}

                    {/* top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="inline-flex rounded-full border border-teal-100 bg-teal-50/80 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-teal-700">
                        STEP {step.number}
                      </div>

                      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
                        0{index + 1}
                      </span>
                    </div>

                    {/* animation box */}
                    <div className="mt-5 rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 shadow-inner">
                      <div className="mx-auto flex h-[150px] w-[150px] items-center justify-center sm:h-[170px] sm:w-[170px]">
                        <Lottie
                          animationData={step.animation}
                          loop
                          className="h-full w-full"
                        />
                      </div>
                    </div>

                    {/* content */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
                        {step.text}
                      </p>
                    </div>

                    {/* progress bar */}
                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        <span>Progress</span>
                        <span>{(index + 1) * 25}%</span>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(index + 1) * 25}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.15 }}
                          className="h-full rounded-full bg-gradient-to-r from-teal-600 to-sky-500"
                        />
                      </div>
                    </div>

                    {/* decorative glow */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-teal-50/30 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
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