import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
          Admin Panel
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          PharmTechSuccess Admin
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Manage premium requests and administrative controls from here.
        </p>

        <div className="mt-8">
          <Link
            href="/admin/premium"
            className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Open Premium Requests
          </Link>
        </div>
      </div>
    </main>
  );
}