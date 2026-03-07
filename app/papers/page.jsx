"use client";

import { useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import PaperCard from "@/components/papers/PaperCard";
import PaperFilter from "@/components/papers/PaperFilter";
import PapersEmptyState from "@/components/papers/PapersEmptyState";
import papers from "@/data/papers";

export default function PapersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const subjects = [...new Set(papers.map((paper) => paper.subject))];
  const years = [...new Set(papers.map((paper) => paper.year))].sort(
    (a, b) => b - a
  );

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const matchesSearch =
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubject =
        subjectFilter === "all" || paper.subject === subjectFilter;

      const matchesYear =
        yearFilter === "all" || String(paper.year) === yearFilter;

      return matchesSearch && matchesSubject && matchesYear;
    });
  }, [searchTerm, subjectFilter, yearFilter]);

  function resetFilters() {
    setSearchTerm("");
    setSubjectFilter("all");
    setYearFilter("all");
  }

  return (
    <main className="bg-slate-50 py-16 sm:py-20">
      <Container>
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
                <PaperCard key={paper.id} paper={paper} />
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