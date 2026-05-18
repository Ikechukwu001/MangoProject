"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/src/lib/supabase/client";

const GOAL = 10;

const MILESTONES = [
  { days: 3,  title: "Consistent Beginner" },
  { days: 7,  title: "CBT Warrior"         },
  { days: 14, title: "Council Ready"       },
  { days: 30, title: "PharmTech Legend"    },
];

function getWeekDays() {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      isToday: i === 0,
      done: false,
    });
  }
  return days;
}

export function getMilestones(currentStreak) {
  return MILESTONES.map((m, i) => {
    const nextMilestone = MILESTONES[i + 1];
    return {
      ...m,
      unlocked: currentStreak >= m.days,
      isCurrent:
        currentStreak >= m.days &&
        (!nextMilestone || currentStreak < nextMilestone.days),
      daysAway: Math.max(0, m.days - currentStreak),
    };
  });
}

export function getCurrentTitle(currentStreak) {
  const earned = [...MILESTONES].reverse().find((m) => currentStreak >= m.days);
  return earned?.title ?? "Newcomer";
}

// ✅ FIX: Accept userId as a parameter — no more internal auth fetching
export function useStreak(userId = null) {
  // ✅ FIX: useMemo so supabase is never recreated on re-renders
  const supabase = useMemo(() => createClient(), []);

  const [streak, setStreak]     = useState(null);
  const [weekDays, setWeekDays] = useState(getWeekDays());
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // ✅ FIX: If userId not ready yet, don't try to fetch — just wait
    if (!userId) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);

      const { data: streakRow } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (streakRow) {
        const today = new Date().toISOString().split("T")[0];
        const isNewDay = streakRow.last_activity_date !== today;
        setStreak({
          current_streak:     streakRow.current_streak,
          longest_streak:     streakRow.longest_streak,
          questions_today:    isNewDay ? 0 : streakRow.questions_today,
          goal_met_today:     isNewDay ? false : streakRow.goal_met_today,
          last_activity_date: streakRow.last_activity_date,
        });
      } else {
        setStreak({
          current_streak:     0,
          longest_streak:     0,
          questions_today:    0,
          goal_met_today:     false,
          last_activity_date: null,
        });
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      const { data: activity } = await supabase
        .from("streak_activity")
        .select("activity_date, goal_met")
        .eq("user_id", userId)
        .gte("activity_date", sevenDaysAgo.toISOString().split("T")[0]);

      if (activity) {
        const doneSet = new Set(
          activity.filter((a) => a.goal_met).map((a) => a.activity_date)
        );
        setWeekDays((prev) =>
          prev.map((d) => ({ ...d, done: doneSet.has(d.date) }))
        );
      }

      setLoading(false);
    }

    load();
  }, [userId, supabase]); // ✅ re-runs when userId becomes available

  const recordAnswer = useCallback(async () => {
    // ✅ FIX: userId is now guaranteed to be passed in before this is callable
    if (!userId) return null;

    const { data, error } = await supabase.rpc("record_question_answered", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Streak RPC error:", error);
      return null;
    }

    setStreak((prev) => ({
      ...(prev ?? { last_activity_date: new Date().toISOString().split("T")[0] }),
      current_streak:     data.current_streak,
      longest_streak:     data.longest_streak,
      questions_today:    data.questions_today,
      goal_met_today:     data.goal_met_today,
      last_activity_date: new Date().toISOString().split("T")[0],
    }));

    if (data.goal_just_met) {
      const today = new Date().toISOString().split("T")[0];
      setWeekDays((prev) =>
        prev.map((d) => (d.date === today ? { ...d, done: true } : d))
      );
    }

    return {
      goalJustMet:    data.goal_just_met,
      newStreak:      data.current_streak,
      questionsToday: data.questions_today,
    };
  }, [userId, supabase]);

  return {
    streak,
    weekDays,
    loading,
    recordAnswer,
    milestones:   streak ? getMilestones(streak.current_streak) : [],
    currentTitle: streak ? getCurrentTitle(streak.current_streak) : "Newcomer",
    GOAL,
  };
}