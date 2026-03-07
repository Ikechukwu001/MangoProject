import Link from "next/link";
import { CheckCircle2, Crown, Sparkles } from "lucide-react";
import Container from "../layout/Container";

const premiumBenefits = [
  "Unlock full question access",
  "Get answer explanations after submission",
  "Access cumulative practice mode",
  "Review papers in more detail",
  "Prepare with fewer limitations",
];

export default function PremiumTeaser() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 p-8 text-white shadow-2xl shadow-slate-950/30 sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
                <Sparkles size={16} />
                Premium Access
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Unlock the full PharmTechSuccess experience
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-teal-50/90 sm:text-lg">
                Get full access to all questions, better review options, answer
                explanations, and more complete CBT preparation tools.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  View Pricing
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Unlock Premium
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
                  <Crown size={22} />
                </div>

                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-teal-100/80">
                    Premium Benefits
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    More value for serious preparation
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {premiumBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4"
                  >
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-amber-300"
                    />
                    <p className="text-sm leading-7 text-white/90 sm:text-base">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}