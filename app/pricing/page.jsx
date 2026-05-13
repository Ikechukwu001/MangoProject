"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Crown,
  Sparkles,
  ShieldCheck,
  Clock3,
  FileText,
  Lock,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/src/lib/supabase/client";

const PREMIUM_PRICE = 3000;

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PricingPage() {
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUserData() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;
      setUser(authUser ?? null);

      if (authUser) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, email, full_name, plan, premium_status")
          .eq("id", authUser.id)
          .maybeSingle();

        if (!mounted) return;
        setProfile(profileData || null);
      }

      setLoadingUser(false);
    }

    loadUserData();
    return () => { mounted = false; };
  }, [supabase]);

  const isPremium =
    profile?.plan === "premium" || profile?.premium_status === "active";

  const isPending = profile?.premium_status === "pending";

  const handleUpgrade = async () => {
    setErrorMessage("");

    if (!user) {
      setErrorMessage("Please sign in before upgrading.");
      return;
    }

    setPaymentLoading(true);

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.authorization_url) {
        setErrorMessage(data.error || "Failed to initialize payment. Please try again.");
        setPaymentLoading(false);
        return;
      }

      // Redirect user to Paystack's hosted checkout page
      window.location.href = data.authorization_url;
    } catch {
      setErrorMessage("A network error occurred. Please try again.");
      setPaymentLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-8 w-56 rounded bg-slate-200 sm:h-10 sm:w-80" />
              <div className="h-4 w-full max-w-2xl rounded bg-slate-200" />
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                <div className="h-80 rounded-[24px] bg-slate-200 sm:h-96" />
                <div className="h-80 rounded-[24px] bg-slate-200 sm:h-96" />
              </div>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16 lg:py-20">
      <Container>
        <Link
          href="/papers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Back to Papers
        </Link>

        <div className="mt-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:mt-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700 sm:px-4 sm:text-xs">
              PharmTechSuccess Pricing
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-6 sm:text-4xl lg:text-5xl">
              Choose the access level that fits your preparation
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
              Start with free preview access, then upgrade to premium when
              you're ready to unlock the full question bank and stronger exam
              preparation flow.
            </p>

            {isPremium && (
              <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                <BadgeCheck size={16} />
                <span className="truncate">Your account already has premium access</span>
              </div>
            )}

            {!isPremium && isPending && (
              <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                <AlertCircle size={16} />
                <span className="truncate">Payment pending — awaiting Paystack confirmation</span>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-2 lg:gap-6">
            {/* FREE PLAN */}
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">
                    Free Plan
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    Start for free
                  </h2>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                  Default Access
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <p className="text-3xl font-bold text-slate-900 sm:text-4xl">₦0</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Good for trying the platform and testing the paper preview flow.
                </p>
              </div>

              <div className="mt-6 space-y-4 sm:mt-8">
                {[
                  "Access preview questions in available papers",
                  "Practice inside a clean CBT-style interface",
                  "View preview-level result summary",
                  "Get started immediately after account creation",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-600" />
                    <p className="text-sm leading-7 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/papers"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:mt-8"
              >
                Continue with Free Access
              </Link>
            </div>

            {/* PREMIUM PLAN */}
            <div className="relative overflow-hidden rounded-[24px] border border-amber-200 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-5 text-white shadow-xl shadow-slate-300/40 sm:p-6">
              <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-slate-950 sm:right-5 sm:top-5 sm:text-xs">
                <Crown size={14} />
                Recommended
              </div>

              <div className="max-w-lg pr-20 sm:pr-24">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 sm:text-sm">
                  Premium Plan
                </p>
                <h2 className="mt-2 text-xl font-bold sm:text-3xl">
                  Unlock the full Pharm Tech experience
                </h2>
              </div>

              <div className="mt-5 sm:mt-6">
                <p className="text-3xl font-bold sm:text-4xl">
                  {formatNaira(PREMIUM_PRICE)}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  One-time payment. Instant activation via Paystack — cards, bank transfer & USSD supported.
                </p>
              </div>

              <div className="mt-6 space-y-4 sm:mt-8">
                {[
                  "Unlock all questions in premium papers",
                  "Go beyond the free 10-question preview",
                  "Get full paper result flow and stronger review experience",
                  "Prepare more seriously for real Pharmacy Technician CBT exams",
                  "Use your account across devices once premium is activated",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-amber-300" />
                    <p className="text-sm leading-7 text-slate-100">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-amber-200">
                    <FileText size={16} />
                    <span className="text-sm font-medium">Full Papers</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">Access complete CBT paper flow</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-amber-200">
                    <Clock3 size={16} />
                    <span className="text-sm font-medium">Better Practice</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">Stronger timed preparation</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-amber-200">
                    <ShieldCheck size={16} />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">Powered by Paystack</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-amber-200">
                    <Lock size={16} />
                    <span className="text-sm font-medium">No More Limits</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">Remove free preview restriction</p>
                </div>
              </div>

              {/* Paystack badge */}
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0ba4db]">
                  <span className="text-[10px] font-bold text-white">P</span>
                </div>
                <p className="text-xs text-slate-300">
                  Pay securely via card, bank transfer, or USSD — powered by Paystack
                </p>
              </div>

              {isPremium ? (
                <div className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3.5 text-sm font-semibold text-white sm:mt-8">
                  <BadgeCheck size={16} />
                  Premium Already Active
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={paymentLoading}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-70 sm:mt-8"
                >
                  <Sparkles size={16} />
                  {paymentLoading
                    ? "Preparing checkout…"
                    : isPending
                    ? "Continue Payment"
                    : "Upgrade to Premium"}
                </button>
              )}
            </div>
          </div>

          {/* HOW IT WORKS + WHY UPGRADE */}
          <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                How premium activation works
              </h3>
              <div className="mt-5 space-y-4 sm:mt-6">
                {[
                  "Click upgrade — you'll be taken to Paystack's secure checkout page.",
                  "Pay with your card, bank transfer, or USSD — whichever works for you.",
                  "Paystack confirms your payment and sends you back to this site.",
                  "Your account is instantly upgraded to premium — no waiting needed.",
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-teal-700 ring-1 ring-slate-200">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-7 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Why students upgrade
              </h3>
              <div className="mt-5 space-y-4">
                {[
                  "To go beyond the first preview questions",
                  "To practice with more confidence before the real exam",
                  "To unlock a more complete CBT preparation experience",
                  "To make their study process more serious and structured",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-600" />
                    <p className="text-sm leading-7 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mt-8">
              {errorMessage}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}