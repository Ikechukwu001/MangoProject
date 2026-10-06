"use client";

import { useEffect, useState } from "react";
import { Circle, CircleCheck } from "lucide-react";

// Progress is saved in this browser only (no backend involved).
const STORAGE_KEY = "pts-completed-guides";

function readCompleted() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCompleted(list) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage can be blocked (private mode); progress just won't be saved.
  }
}

// "Mark as complete" button shown at the bottom of a lesson.
export function CompleteButton({ id }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(readCompleted().includes(id));
  }, [id]);

  function toggle() {
    const current = readCompleted();
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    writeCompleted(next);
    setDone(next.includes(id));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={done}
      className={`inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition ${
        done
          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
          : "border-stone-300 bg-white text-stone-800 hover:border-teal-500 hover:bg-teal-50"
      }`}
    >
      {done ? (
        <CircleCheck className="h-4 w-4 text-emerald-600" />
      ) : (
        <Circle className="h-4 w-4 text-stone-400" />
      )}
      {done ? "Completed" : "Mark as complete"}
    </button>
  );
}

// Small tick shown next to a lesson in the index when it is completed.
export function CompletedMark({ id }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(readCompleted().includes(id));
  }, [id]);

  if (!done) return null;
  return (
    <CircleCheck
      className="h-4 w-4 text-emerald-600"
      aria-label="Completed"
    />
  );
}

// "2 of 5 completed" with a progress bar, shown on each course card.
export function CourseProgress({ ids }) {
  const [count, setCount] = useState(0);
  const key = ids.join("|");

  useEffect(() => {
    const completed = readCompleted();
    setCount(ids.filter((id) => completed.includes(id)).length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const total = ids.length;
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          {count} of {total} completed
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div
          className="h-full rounded-full bg-teal-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
