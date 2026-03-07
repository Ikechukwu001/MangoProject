export default function PapersEmptyState({ onReset }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <h3 className="text-2xl font-semibold text-slate-900">
        No papers found
      </h3>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
        No paper matches your current search or filter settings. Try changing
        your filters to explore more available papers.
      </p>

      <button
        onClick={onReset}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:bg-teal-800"
      >
        Reset Filters
      </button>
    </div>
  );
}