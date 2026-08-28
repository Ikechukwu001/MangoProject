"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";

// Wednesday, September 2, 2026, 11:00 AM WAT (UTC+1)
const TARGET_DATE = new Date("2026-09-02T11:00:00+01:00");

function getTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function DigitBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 sm:h-20 sm:w-20">
        <span className="font-mono text-2xl font-bold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

export default function PrecouncilCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-700">
          <CalendarClock size={12} />
          Precouncil Examination
        </div>

        {timeLeft ? (
          <>
            <h2 className="mt-3 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Countdown to Precouncil
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Wednesday, September 2, 2026 · 11:00 AM
            </p>

            <div className="mt-6 flex items-start gap-3 sm:gap-5">
              <DigitBlock value={timeLeft.days} label="Days" />
              <span className="mt-4 text-xl font-light text-slate-200 sm:mt-5 sm:text-2xl">:</span>
              <DigitBlock value={timeLeft.hours} label="Hours" />
              <span className="mt-4 text-xl font-light text-slate-200 sm:mt-5 sm:text-2xl">:</span>
              <DigitBlock value={timeLeft.minutes} label="Minutes" />
              <span className="mt-4 text-xl font-light text-slate-200 sm:mt-5 sm:text-2xl">:</span>
              <DigitBlock value={timeLeft.seconds} label="Seconds" />
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-3 text-lg font-bold tracking-tight text-teal-700 sm:text-xl">
              Precouncil is underway
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Good luck — you've got this.
            </p>
          </>
        )}
      </div>
    </div>
  );
}