"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import PaperCard from "@/components/papers/PaperCard";
import PaperFilter from "@/components/papers/PaperFilter";
import PapersEmptyState from "@/components/papers/PapersEmptyState";
import papers from "@/src/data/papers";
import useUserProfile from "@/src/hooks/useUserProfile";
import { Crown, AlertCircle, BadgeCheck, Sparkles } from "lucide-react";
import PrecouncilCountdown from "@/components/papers/PrecouncilCountdown";

export default function PapersClient() {
  const router = useRouter();
  const { user, profile, loading, isPremium, isPending } = useUserProfile();

  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  const subjects = [
    ...new Set(papers.map((paper) => paper.subject).filter(Boolean)),
  ];

  const years = [
    ...new Set(papers.map((paper) => paper.year).filter(Boolean)),
  ].sort((a, b) => b - a);

  const filteredPapers = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return papers.filter((paper) => {
      const title = (paper.title || "").toLowerCase();
      const subject = (paper.subject || "").toLowerCase();
      const year = String(paper.year || "");

      const matchesSearch =
        title.includes(normalizedSearch) || subject.includes(normalizedSearch);

      const matchesSubject =
        subjectFilter === "all" || paper.subject === subjectFilter;

      const matchesYear = yearFilter === "all" || year === String(yearFilter);

      return matchesSearch && matchesSubject && matchesYear;
    });
  }, [searchTerm, subjectFilter, yearFilter]);

  function resetFilters() {
    setSearchTerm("");
    setSubjectFilter("all");
    setYearFilter("all");
  }

  // Loading skeleton while we check auth — avoids a flash of the wrong state.
  if (loading || !user) {
    return (
      <main className="min-h-screen bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-20 rounded-2xl bg-slate-100" />
            <div className="h-10 w-72 rounded bg-slate-100" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-40 rounded-3xl bg-slate-100" />
              <div className="h-40 rounded-3xl bg-slate-100" />
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-16 sm:py-20">
      <Container>
        {/* Welcome / Plan Bar */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <p className="font-semibold text-slate-900">
                {profile?.full_name || user.email}
              </p>
              <p className="mt-1 text-sm text-slate-500">{user.email}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isPremium ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  <BadgeCheck size={14} />
                  Premium Active
                </span>
              ) : isPending ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <AlertCircle size={14} />
                  Premium Pending
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Free Plan
                </span>
              )}
            </div>
          </div>
        </div>

        <PrecouncilCountdown />

        {/* Status info card */}
        {!isPremium && (
          <div
            className={`mb-8 rounded-3xl border p-5 shadow-sm ${
              isPending
                ? "border-amber-200 bg-amber-50"
                : "border-teal-200 bg-teal-50"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    isPending
                      ? "bg-amber-100 text-amber-700"
                      : "bg-teal-100 text-teal-700"
                  }`}
                >
                  {isPending ? <AlertCircle size={18} /> : <Sparkles size={18} />}
                </div>

                <div>
                  <p
                    className={`font-semibold ${
                      isPending ? "text-amber-800" : "text-teal-800"
                    }`}
                  >
                    {isPending
                      ? "Your premium request is pending confirmation"
                      : "You are currently on the free plan"}
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      isPending ? "text-amber-700" : "text-teal-700"
                    }`}
                  >
                    {isPending
                      ? "You can still continue using the free preview while your premium request is being reviewed."
                      : "You can open any paper and access the first 10 questions for free before upgrading to premium."}
                  </p>
                </div>
              </div>

              <Link
                href="/pricing"
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  isPending
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-teal-700 text-white hover:bg-teal-800"
                }`}
              >
                <Crown size={16} />
                {isPending ? "View Premium Request" : "Upgrade to Premium"}
              </Link>
            </div>
          </div>
        )}

        <SectionTitle
          badge="Exam papers"
          title="Browse available CBT practice papers"
          text="Choose from different years and subjects, then start practicing in a structured exam-like environment."
          align="left"
        />

        <PaperFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          subjects={subjects}
          years={years}
        />

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredPapers.length}
            </span>{" "}
            paper{filteredPapers.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="mt-8">
          {filteredPapers.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredPapers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isPremium={isPremium}
                  isPending={isPending}
                />
              ))}
            </div>
          ) : (
            <PapersEmptyState onReset={resetFilters} />
          )}
        </div>
      </Container>
    </main>
  );
}