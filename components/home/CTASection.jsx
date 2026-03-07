import Link from "next/link";
import Container from "../layout/Container";

export default function CTASection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Start preparing smarter today
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Practice like the real CBT exam, build confidence with past
            questions, and get more comfortable before exam day.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:bg-teal-800"
            >
              Create Free Account
            </Link>

            <Link
              href="/papers"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Browse Papers
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}