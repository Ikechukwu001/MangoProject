"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  CheckCircle2,
  Lock,
  Snowflake,
  Share2,
  Zap,
  Trophy,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";
// FIXED: was @/src/hooks/useStreak — must match where you saved the file
import { useStreak } from "@/src/hooks/useStreak";
import { createClient } from "@/src/lib/supabase/client";

const MILESTONE_ICONS = [Target, Zap, Trophy, Award];

export default function StreakDashboard() {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState(null);

  // fetch userId once on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, [supabase]);

  // ✅ pass userId into useStreak — no duplicate auth inside the hook
  const { streak, weekDays, loading, milestones, currentTitle, GOAL } =
    useStreak(userId);

  const [toast, setToast] = useState({ message: "", visible: false });
  const [celebrating, setCelebrating] = useState(false);

  function showToast(message) {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }

  function shareStreak() {
    if (!streak) return;
    const text = encodeURIComponent(
      `🔥 ${streak.current_streak}-Day Streak on PharmTechSuccess!\n\nI'm a "${currentTitle}" 💪 — practising every day for my Pharmacy Technician exam.\n\nJoin me: pharmtechsuccess.com`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    showToast("Opening WhatsApp... flex on them! 🚀");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />
      </div>
    );
  }

  if (!streak) return null;

  const pct       = Math.min(100, Math.round((streak.questions_today / GOAL) * 100));
  const remaining = Math.max(0, GOAL - streak.questions_today);

  return (
    <div className="mx-auto max-w-xl font-sans">

      {/* ── HERO STREAK CARD ── */}
      <motion.div
        className={`border-b px-5 pb-5 pt-6 transition-colors ${
          celebrating
            ? "border-teal-200 bg-teal-50"
            : "border-slate-200 bg-white"
        }`}
        animate={celebrating ? { scale: [1, 1.01, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-700">
          <Flame size={11} />
          Active streak
        </div>

        <div className="flex items-start gap-4">
          <motion.div
            key={streak.current_streak}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-7xl font-extrabold leading-none tracking-tighter text-teal-700"
          >
            {streak.current_streak}
          </motion.div>

          <div className="pt-1">
            <p className="text-xl font-bold text-slate-900">Day Streak</p>
            <p className="mt-1 text-sm text-slate-500">
              {streak.current_streak === 0
                ? "Start your streak — answer 10 questions today!"
                : `You've practiced consistently for ${streak.current_streak} day${streak.current_streak !== 1 ? "s" : ""}.`}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-700">
              <Award size={11} />
              {currentTitle}
            </div>
          </div>
        </div>

        <div className="mt-4">
          {streak.goal_met_today ? (
            <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700">
              <CheckCircle2 size={15} />
              Streak locked in for today! See you tomorrow 🎉
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              <Flame size={15} className="text-teal-600" />
              {streak.current_streak > 0
                ? `Don't break your streak — answer ${remaining} more question${remaining !== 1 ? "s" : ""} today!`
                : `Answer ${remaining} question${remaining !== 1 ? "s" : ""} to start your streak!`}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── 7-DAY DOT TRACKER ── */}
      <div className="border-b border-slate-200 bg-white px-5 py-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            This week
          </p>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            Best: {streak.longest_streak} days
            <TrendingUp size={11} />
          </span>
        </div>

        <div className="flex gap-2">
          {weekDays.map((day) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
              <motion.div
                animate={day.isToday && !day.done ? { scale: [1, 1.08, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                  day.done
                    ? "bg-teal-700 text-white shadow-sm shadow-teal-200"
                    : day.isToday
                    ? "border-2 border-teal-600 bg-teal-50 text-teal-700"
                    : "border border-dashed border-slate-200 bg-slate-50 text-slate-300"
                }`}
              >
                {day.done ? (
                  <CheckCircle2 size={15} />
                ) : day.isToday ? (
                  <Flame size={15} />
                ) : (
                  "·"
                )}
              </motion.div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {day.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="border-b border-slate-200 bg-white px-5 py-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Today's questions{" "}
            <strong className="text-teal-700">
              {streak.questions_today} / {GOAL}
            </strong>
          </span>
          <span className="font-semibold text-teal-700">{pct}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-400">
          {remaining === 0 ? (
            <span className="font-semibold text-teal-600">✓ Streak locked in for today!</span>
          ) : (
            <>
              Answer{" "}
              <strong className="text-teal-600">
                {remaining} more question{remaining !== 1 ? "s" : ""}
              </strong>{" "}
              to lock in today's streak!
            </>
          )}
        </p>
      </div>

      {/* ── TODAY'S SESSION CARD ── */}
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Today's session
          </p>
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              streak.goal_met_today
                ? "bg-teal-100 text-teal-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {streak.goal_met_today ? (
              <><CheckCircle2 size={11} /> Complete!</>
            ) : (
              <><Flame size={11} /> In progress</>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <motion.p
              key={streak.questions_today}
              initial={{ scale: 1.3, color: "#0d9488" }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-extrabold leading-none tracking-tighter text-teal-700"
            >
              {streak.questions_today}
            </motion.p>
            <p className="mt-1 text-xs text-slate-400">Done</p>
          </div>
          <p className="text-2xl font-light text-slate-300">/</p>
          <div className="text-center">
            <p className="text-4xl font-extrabold leading-none tracking-tighter text-slate-300">
              {GOAL}
            </p>
            <p className="mt-1 text-xs text-slate-400">Goal</p>
          </div>
        </div>

        <Link
          href="/papers"
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white transition ${
            streak.goal_met_today
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-teal-700 hover:bg-teal-800"
          }`}
        >
          {streak.goal_met_today ? (
            <><CheckCircle2 size={15} /> Keep practising — streak locked!</>
          ) : (
            <><Flame size={15} /> Go answer questions</>
          )}
        </Link>
      </div>

      {/* ── MILESTONES ── */}
      <div className="border-b border-slate-200 bg-white px-5 py-5">
        <p className="mb-3 text-sm font-bold text-slate-900">Milestones</p>
        <div className="grid grid-cols-2 gap-3">
          {milestones.map((m, i) => {
            const Icon = MILESTONE_ICONS[i];
            return (
              <motion.div
                key={m.days}
                whileHover={{ y: -1 }}
                className={`relative overflow-hidden rounded-2xl border p-4 transition ${
                  m.isCurrent
                    ? "border-2 border-teal-600 bg-teal-50"
                    : m.unlocked
                    ? "border-teal-200 bg-teal-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p
                  className={`text-3xl font-extrabold leading-none tracking-tighter ${
                    m.unlocked ? "text-teal-700" : "text-slate-300"
                  }`}
                >
                  {m.days}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-slate-400">days</p>
                <p
                  className={`mt-2 text-xs font-semibold ${
                    m.unlocked ? "text-teal-800" : "text-slate-500"
                  }`}
                >
                  {m.title}
                </p>

                <div
                  className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    m.unlocked
                      ? "bg-teal-700 text-white"
                      : m.isCurrent
                      ? "bg-teal-100 text-teal-700"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon size={9} />
                  {m.unlocked
                    ? "Earned"
                    : m.daysAway === 0
                    ? "Just unlocked!"
                    : `${m.daysAway} days away`}
                </div>

                <div className="absolute right-3 top-3">
                  {m.unlocked ? (
                    <CheckCircle2 size={14} className="text-teal-600" />
                  ) : (
                    <Lock size={13} className="text-slate-300" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── STREAK FREEZE TEASER ── */}
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-sky-300 bg-sky-50 px-4 py-3">
          <Snowflake size={18} className="shrink-0 text-sky-600" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-sky-800">Streak Freeze — coming soon</p>
            <p className="text-xs text-sky-600">Miss a day? A freeze will protect your streak.</p>
          </div>
          <span className="rounded-lg bg-sky-700 px-2 py-0.5 text-[10px] font-bold text-sky-100">
            SOON
          </span>
        </div>
      </div>

      {/* ── WHATSAPP SHARE ── */}
      <div className="bg-white px-5 py-5">
        <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-white">Flex your streak! 💪</p>
            <p className="text-xs text-slate-400">
              Share your {streak.current_streak}-day streak on WhatsApp
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={shareStreak}
            className="flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1aab50]"
          >
            <Share2 size={14} />
            Share
          </motion.button>
        </div>
      </div>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

