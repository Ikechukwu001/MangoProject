"use client";

import React, { useMemo, useState } from "react";
import {
  Brain,
  Trophy,
  Target,
  RotateCcw,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Sparkles,
  TrendingUp,
  Flame,
} from "lucide-react";

import { useConfidence } from "@/src/hooks/useConfidence.js";
import { TOPICS, ALL_TOPICS } from "@/src/data/topicMap.js";
import {
  getConfidenceLevel,
  getAccuracyPercent,
} from "@/src/store/confidenceStore.js";

const CONF_META = {
  master: {
    label: "Mastered",
    color: "from-emerald-500 to-green-600",
    solid: "#16a34a",
    light: "bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-500/20",
    icon: Trophy,
  },

  good: {
    label: "Good",
    color: "from-blue-500 to-cyan-600",
    solid: "#2563eb",
    light: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/20",
    icon: TrendingUp,
  },

  learning: {
    label: "Learning",
    color: "from-amber-500 to-orange-500",
    solid: "#d97706",
    light: "bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-500/20",
    icon: Sparkles,
  },

  weak: {
    label: "Needs Work",
    color: "from-red-500 to-rose-600",
    solid: "#dc2626",
    light: "bg-red-500/10",
    text: "text-red-600",
    border: "border-red-500/20",
    icon: Flame,
  },

  new: {
    label: "Not Started",
    color: "from-zinc-400 to-zinc-500",
    solid: "#71717a",
    light: "bg-zinc-500/10",
    text: "text-zinc-500",
    border: "border-zinc-500/20",
    icon: MinusCircle,
  },
};

const COURSE_DATA = {
  AUM: {
    label: "AUM",
    color: "from-violet-600 to-indigo-600",
  },
  BDT: {
    label: "BDT",
    color: "from-blue-600 to-cyan-600",
  },
  PPTP: {
    label: "PPTP",
    color: "from-emerald-600 to-green-600",
  },
  ANA: {
    label: "Anatomy",
    color: "from-orange-600 to-amber-600",
  },
  ENG: {
    label: "English",
    color: "from-yellow-500 to-orange-500",
  },
};

export default function ConfidenceScorer() {
  const { confidenceState, recordResultByTopicId, reset } =
    useConfidence();

  const [activeCourse, setActiveCourse] = useState("AUM");

  const courseTopic = TOPICS[activeCourse] || [];

  const stats = useMemo(() => {
    const totalAttempts = ALL_TOPICS.reduce(
      (sum, t) =>
        sum + (confidenceState[t.id]?.attempts || 0),
      0
    );

    const totalCorrect = ALL_TOPICS.reduce(
      (sum, t) =>
        sum + (confidenceState[t.id]?.correct || 0),
      0
    );

    const mastered = ALL_TOPICS.filter(
      (t) =>
        getConfidenceLevel(confidenceState[t.id]) ===
        "master"
    ).length;

    const started = ALL_TOPICS.filter(
      (t) =>
        (confidenceState[t.id]?.attempts || 0) > 0
    ).length;

    const overallPct = totalAttempts
      ? Math.round((totalCorrect / totalAttempts) * 100)
      : 0;

    return {
      totalAttempts,
      totalCorrect,
      mastered,
      started,
      overallPct,
    };
  }, [confidenceState]);

  const confCounts = useMemo(() => {
    return ["master", "good", "learning", "weak", "new"].reduce(
      (acc, k) => {
        acc[k] = ALL_TOPICS.filter(
          (t) =>
            getConfidenceLevel(
              confidenceState[t.id]
            ) === k
        ).length;

        return acc;
      },
      {}
    );
  }, [confidenceState]);

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-6 md:p-8 shadow-2xl">

        <div className="absolute top-0 right-0 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-600">
              <Brain className="h-4 w-4" />
              PharmTechSuccess Confidence Analytics
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Confidence Scorer
            </h1>

            <p className="mt-3 max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-400">
              Track your mastery level across every topic based
              on real exam performance and identify your weak
              areas instantly.
            </p>
          </div>

          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-3 text-sm font-semibold shadow-sm transition hover:scale-[1.02]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        {[
          {
            label: "Overall Accuracy",
            value: `${stats.overallPct}%`,
            icon: Target,
          },

          {
            label: "Topics Mastered",
            value: `${stats.mastered}/${ALL_TOPICS.length}`,
            icon: Trophy,
          },

          {
            label: "Topics Started",
            value: stats.started,
            icon: Brain,
          },

          {
            label: "Total Attempts",
            value: stats.totalAttempts,
            icon: TrendingUp,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-3">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                {item.value}
              </div>

              <div className="mt-1 text-sm text-zinc-500">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* OVERVIEW */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Mastery Overview
            </h3>

            <p className="text-sm text-zinc-500">
              Distribution of your confidence levels
            </p>
          </div>

          <div className="text-sm font-medium text-zinc-500">
            {stats.mastered} mastered
          </div>
        </div>

        {/* progress */}
        <div className="mb-6 flex h-4 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          {["master", "good", "learning", "weak", "new"].map(
            (k) => (
              <div
                key={k}
                style={{
                  width: `${
                    (confCounts[k] / ALL_TOPICS.length) *
                    100
                  }%`,
                }}
                className={`bg-gradient-to-r ${CONF_META[k].color}`}
              />
            )
          )}
        </div>

        {/* legend */}
        <div className="flex flex-wrap gap-3">
          {["master", "good", "learning", "weak", "new"].map(
            (k) => {
              const meta = CONF_META[k];
              const Icon = meta.icon;

              return (
                <div
                  key={k}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${meta.light} ${meta.text} border ${meta.border}`}
                >
                  <Icon className="h-4 w-4" />
                  {meta.label} ({confCounts[k]})
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* COURSE TABS */}
      <div className="flex flex-wrap gap-3">
        {Object.keys(TOPICS).map((k) => (
          <button
            key={k}
            onClick={() => setActiveCourse(k)}
            className={`
              rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300
              ${
                activeCourse === k
                  ? `bg-gradient-to-r ${COURSE_DATA[k].color} text-white shadow-2xl`
                  : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:scale-[1.03]"
              }
            `}
          >
            {COURSE_DATA[k].label}
          </button>
        ))}
      </div>

      {/* TOPICS */}
      <div className="space-y-4">

        {courseTopic.map((topic) => {
          const s = confidenceState[topic.id] || {
            correct: 0,
            wrong: 0,
            skipped: 0,
            attempts: 0,
          };

          const pct = getAccuracyPercent(s);
          const conf = getConfidenceLevel(s);
          const meta = CONF_META[conf];
          const Icon = meta.icon;

          return (
            <div
              key={topic.id}
              className="group rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              {/* top */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div
                    className={`rounded-2xl p-3 ${meta.light}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${meta.text}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-white">
                      {topic.name}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      {topic.examQuestions} exam questions
                    </p>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${meta.light} ${meta.text} border ${meta.border}`}
                >
                  {meta.label}
                </div>
              </div>

              {/* progress */}
              <div className="mb-4">

                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    Accuracy
                  </span>

                  <span className="font-bold text-zinc-900 dark:text-white">
                    {pct !== null ? `${pct}%` : "—"}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${meta.color} transition-all duration-700`}
                    style={{
                      width: `${pct ?? 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* stats */}
              <div className="mb-5 flex flex-wrap gap-3 text-sm">

                <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-emerald-600">
                  {s.correct} Correct
                </div>

                <div className="rounded-xl bg-red-500/10 px-3 py-2 text-red-600">
                  {s.wrong} Wrong
                </div>

                <div className="rounded-xl bg-zinc-500/10 px-3 py-2 text-zinc-500">
                  {s.skipped} Skipped
                </div>

                <div className="rounded-xl bg-blue-500/10 px-3 py-2 text-blue-600">
                  {s.attempts} Attempts
                </div>
              </div>

              {/* actions */}
              <div className="flex flex-wrap gap-3">

                <button
                  onClick={() =>
                    recordResultByTopicId(
                      topic.id,
                      "correct"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:scale-[1.03]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Correct
                </button>

                <button
                  onClick={() =>
                    recordResultByTopicId(
                      topic.id,
                      "wrong"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition hover:scale-[1.03]"
                >
                  <XCircle className="h-4 w-4" />
                  Wrong
                </button>

                <button
                  onClick={() =>
                    recordResultByTopicId(
                      topic.id,
                      "skipped"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-500/20 bg-zinc-500/10 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:scale-[1.03]"
                >
                  <MinusCircle className="h-4 w-4" />
                  Skip
                </button>

                <button
                  onClick={() =>
                    recordResultByTopicId(
                      topic.id,
                      "_reset"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-semibold transition hover:scale-[1.03]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}