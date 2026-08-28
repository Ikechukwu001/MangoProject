// components/jobs/JobCard.jsx
"use client";

import { useState } from "react";
import { MapPin, Bookmark, Share2, ArrowUpRight, Check } from "lucide-react";

const SOURCE_STYLES = {
  MyJobMag: {
    dot: "bg-blue-500",
    badge: "text-blue-600 dark:text-blue-400",
    avatar: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  Jobberman: {
    dot: "bg-emerald-500",
    badge: "text-emerald-600 dark:text-emerald-400",
    avatar: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
};

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function relativeTime(isoString, fallback) {
  if (!isoString) return fallback || "";
  const then = new Date(isoString).getTime();
  if (Number.isNaN(then)) return fallback || "";

  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default function JobCard({ job, index = 0 }) {
  const style = SOURCE_STYLES[job.source] || SOURCE_STYLES.MyJobMag;
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const timeLabel = relativeTime(job.created_at, job.date);

  function handleCardClick(e) {
    if (e.target.closest("[data-action]")) return;
    window.open(job.job_url, "_blank", "noopener,noreferrer");
  }

  function handleShare(e) {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: job.title, url: job.job_url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(job.job_url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  }

  function handleSave(e) {
    e.stopPropagation();
    setSaved((s) => !s);
  }

  return (
    <div
      onClick={handleCardClick}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-zinc-200 bg-white p-4 transition-colors duration-150 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Header — avatar, company, source dot, timestamp */}
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${style.avatar}`}>
          {initials(job.company)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[13.5px] font-bold text-zinc-900 dark:text-white">
              {job.company || "Unlisted company"}
            </span>
            <span className={`h-1 w-1 shrink-0 rounded-full ${style.dot}`} />
            <span className={`shrink-0 text-[11px] font-semibold ${style.badge}`}>{job.source}</span>
          </div>
          <span className="text-[11.5px] text-zinc-400 dark:text-zinc-500">{timeLabel}</span>
        </div>
      </div>

      {/* Body — title acts like the "post" text */}
      <div className="mt-3">
        <p className="text-[14.5px] font-semibold leading-snug text-zinc-900 line-clamp-2 dark:text-zinc-50">
          {job.title}
        </p>

        {job.location && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
        )}

        {job.description && (
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-500 line-clamp-2 dark:text-zinc-400">
            {job.description.replace(/^(Job Summary|Requirements?|Description|Responsibilities?)\s*/i, "")}
          </p>
        )}
      </div>

      {/* Action row — save / share / apply, feed-style */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <div className="flex items-center gap-1">
          <button
            data-action
            onClick={handleSave}
            aria-label={saved ? "Remove from saved" : "Save"}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              saved
                ? "text-amber-500"
                : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
          </button>

          <button
            data-action
            onClick={handleShare}
            aria-label="Share"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
          </button>
        </div>

        <span className="flex items-center gap-1 text-[12px] font-bold text-zinc-700 transition-colors group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-white">
          Apply
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}