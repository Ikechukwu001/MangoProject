// components/jobs/JobsList.jsx

import JobCard from "./JobCard";
import { Briefcase } from "lucide-react";

export default function JobsList({ jobs }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-2 text-[13px] text-zinc-500 dark:text-zinc-400">
          <Briefcase className="h-3.5 w-3.5" />
          {jobs.length} opening{jobs.length !== 1 ? "s" : ""} found
        </span>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-600 italic">
          Auto-refreshed every 6 hrs
        </span>
      </div>

      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}