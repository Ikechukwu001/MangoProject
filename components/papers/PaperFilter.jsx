export default function PaperFilter({
  searchTerm,
  setSearchTerm,
  subjectFilter,
  setSubjectFilter,
  yearFilter,
  setYearFilter,
  subjects,
  years,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Search papers
          </label>
          <input
            type="text"
            placeholder="Search by title or subject"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Filter by subject
          </label>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-600"
          >
            <option value="all">All subjects</option>
            {subjects
              .filter(Boolean) // remove undefined/null
              .map((subject, index) => (
                <option key={`${subject}-${index}`} value={subject}>
                  {subject}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Filter by year
          </label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-600"
          >
            <option value="all">All years</option>
            {years
              .filter(Boolean)
              .map((year, index) => (
                <option key={`${year}-${index}`} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}