"use client";

import React, { useMemo, useState } from "react";
import {
  Brain,
  Flame,
  TrendingUp,
  Sparkles,
  BookOpen,
} from "lucide-react";

import { TOPICS } from "@/src/data/topicMap.js";

const COURSE_DATA = {
  AUM: {
    label: "AUM",
    color: "from-violet-600 to-indigo-600",
    glow: "shadow-violet-500/20",
  },
  BDT: {
    label: "BDT",
    color: "from-blue-600 to-cyan-600",
    glow: "shadow-blue-500/20",
  },
  PPTP: {
    label: "PPTP",
    color: "from-emerald-600 to-green-600",
    glow: "shadow-emerald-500/20",
  },
  ANA: {
    label: "Anatomy",
    color: "from-orange-600 to-amber-600",
    glow: "shadow-orange-500/20",
  },
  ENG: {
    label: "English",
    color: "from-yellow-500 to-orange-500",
    glow: "shadow-yellow-500/20",
  },
};

function getTier(weight) {
  if (weight >= 8) {
    return {
      label: "High Frequency",
      icon: Flame,
      className:
        "bg-red-500/10 text-red-600 border border-red-500/20",
    };
  }

  if (weight >= 5) {
    return {
      label: "Moderate",
      icon: TrendingUp,
      className:
        "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    };
  }

  return {
    label: "Low Frequency",
    icon: Sparkles,
    className:
      "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  };
}

export default function SmartInsight() {
  const [active, setActive] = useState("AUM");

  const topics = TOPICS[active] || [];

  const maxQ = Math.max(...topics.map((t) => t.examQuestions));

  const stats = useMemo(() => {
    const totalQuestions = topics.reduce(
      (acc, t) => acc + t.examQuestions,
      0
    );

    const highFreq = topics.filter((t) => t.weight >= 8).length;

    return {
      totalQuestions,
      highFreq,
      totalTopics: topics.length,
    };
  }, [topics]);

  return (
    <div className="w-full space-y-6">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-900 dark:to-black p-6 shadow-2xl">

        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm font-medium text-violet-600">
              <Brain className="h-4 w-4" />
              PharmTechSuccess Smart Insights
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Most Repeated Exam Topics
            </h1>

            <p className="mt-2 max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-400">
              Focus on the topics with the highest appearance frequency
              across past questions and maximize your exam performance.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-4 backdrop-blur">
              <div className="text-2xl font-bold">
                {stats.totalTopics}
              </div>
              <div className="text-xs text-zinc-500">
                Topics
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-4 backdrop-blur">
              <div className="text-2xl font-bold">
                {stats.highFreq}
              </div>
              <div className="text-xs text-zinc-500">
                High Priority
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-4 backdrop-blur">
              <div className="text-2xl font-bold">
                {stats.totalQuestions}
              </div>
              <div className="text-xs text-zinc-500">
                Total Questions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COURSE TABS */}
      <div className="flex flex-wrap gap-3">
        {Object.keys(COURSE_DATA).map((k) => {
          const course = COURSE_DATA[k];

          return (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`
                relative overflow-hidden rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300
                ${
                  active === k
                    ? `bg-gradient-to-r ${course.color} text-white shadow-2xl ${course.glow}`
                    : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:scale-[1.03]"
                }
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {course.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* TOPICS */}
      <div className="space-y-4">
        {topics.map((topic, i) => {
          const tier = getTier(topic.weight);
          const TierIcon = tier.icon;

          const progress = Math.round(
            (topic.examQuestions / maxQ) * 100
          );

          return (
            <div
              key={topic.id}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex items-start gap-4">

                {/* ranking */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-lg font-bold">
                  #{i + 1}
                </div>

                {/* content */}
                <div className="min-w-0 flex-1">

                  <div className="mb-3 flex flex-wrap items-center gap-3">

                    <h3 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-white">
                      {topic.name}
                    </h3>

                    <div
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tier.className}`}
                    >
                      <TierIcon className="h-3.5 w-3.5" />
                      {tier.label}
                    </div>
                  </div>

                  {/* progress */}
                  <div className="mb-2 h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${COURSE_DATA[active].color} transition-all duration-700`}
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">
                      Appearance Frequency
                    </span>

                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {topic.examQuestions} Questions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}