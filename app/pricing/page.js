"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Crown,
  Copy,
  Sparkles,
  ShieldCheck,
  Clock3,
  FileText,
  MessageCircle,
  Lock,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/src/lib/supabase/client";

const PREMIUM_PRICE = 5000;

const PAYMENT_DETAILS = {
  bankName: "Opay",
  accountName: "PharmTechSuccess",
  accountNumber: "7088358123", // replace with your real account number
  whatsappNumber: "2348157902426", // replace if needed
};

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function generateReference(user) {
  const emailPart =
    user?.email?.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6) ||
    "USER";
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `PTS-${emailPart.toUpperCase()}-${randomPart}`;
}

export default function PricingPage() {
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [activeRequest, setActiveRequest] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [copiedField, setCopiedField] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestMessageType, setRequestMessageType] = useState("default");

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

        const { data: pendingRequests } = await supabase
          .from("premium_requests")
          .select("*")
          .eq("user_id", authUser.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1);

        if (!mounted) return;

        setProfile(profileData || null);
        setActiveRequest(pendingRequests?.[0] || null);

        if (pendingRequests?.[0]?.reference) {
          setPaymentReference(pendingRequests[0].reference);
        }
      }

      setLoadingUser(false);
    }

    loadUserData();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const isPremium =
    profile?.plan === "premium" || profile?.premium_status === "active";

  const isPending = profile?.premium_status === "pending" || !!activeRequest;

  const fullName =
    profile?.full_name || user?.user_metadata?.full_name || "Student";

  const currentReference =
    activeRequest?.reference || paymentReference || generateReference(user);

  const whatsappMessage = useMemo(() => {
    const email = user?.email || "No email provided";

    return encodeURIComponent(
      `Hello, I want to upgrade to PharmTechSuccess Premium.

Name: ${fullName}
Email: ${email}
Plan: Premium
Amount: ${formatNaira(PREMIUM_PRICE)}
Reference: ${currentReference}

I have made payment / I want to send my proof of payment.`
    );
  }, [currentReference, fullName, user]);

  const whatsappLink = `https://wa.me/${PAYMENT_DETAILS.whatsappNumber}?text=${whatsappMessage}`;

  const handleOpenPayment = () => {
    setRequestMessage("");
    setRequestMessageType("default");

    if (!user) {
      setRequestMessage("Please sign in first before upgrading.");
      setRequestMessageType("error");
      return;
    }

    if (activeRequest?.reference) {
      setPaymentReference(activeRequest.reference);
    } else {
      setPaymentReference(generateReference(user));
    }

    setShowPaymentModal(true);
  };

  const copyToClipboard = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(key);
      setTimeout(() => setCopiedField(""), 1800);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handlePaymentSubmitted = async () => {
    if (!user) {
      setRequestMessage("Please sign in first before submitting a payment request.");
      setRequestMessageType("error");
      return;
    }

    if (activeRequest) {
      window.open(whatsappLink, "_blank");
      return;
    }

    setRequestLoading(true);
    setRequestMessage("");
    setRequestMessageType("default");

    const referenceToUse = paymentReference || generateReference(user);

    const { data: insertedRequest, error: insertError } = await supabase
      .from("premium_requests")
      .insert({
        user_id: user.id,
        email: user.email,
        full_name: fullName,
        amount: PREMIUM_PRICE,
        reference: referenceToUse,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      setRequestLoading(false);
      setRequestMessage(insertError.message);
      setRequestMessageType("error");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        premium_status: "pending",
      })
      .eq("id", user.id);

    if (profileError) {
      setRequestLoading(false);
      setRequestMessage(profileError.message);
      setRequestMessageType("error");
      return;
    }

    setActiveRequest(insertedRequest);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            premium_status: "pending",
          }
        : prev
    );

    setRequestLoading(false);
    setRequestMessage(
      "Payment request saved successfully. Send your proof on WhatsApp for activation."
    );
    setRequestMessageType("success");

    window.open(whatsappLink, "_blank");
  };

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-10 w-80 rounded bg-slate-200" />
              <div className="h-4 w-full max-w-2xl rounded bg-slate-200" />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="h-96 rounded-[28px] bg-slate-200" />
                <div className="h-96 rounded-[28px] bg-slate-200" />
              </div>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 py-16 sm:py-20">
        <Container>
          <Link
            href="/papers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft size={16} />
            Back to Papers
          </Link>

          <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                PharmTechSuccess Pricing
              </div>

              <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Choose the access level that fits your preparation
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Start with free preview access, then upgrade to premium when
                you’re ready to unlock the full question bank and stronger exam
                preparation flow.
              </p>

              {isPremium && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                  <BadgeCheck size={16} />
                  Your account already has premium access
                </div>
              )}

              {!isPremium && isPending && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                  <AlertCircle size={16} />
                  Premium request pending confirmation
                </div>
              )}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Free Plan
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      Start for free
                    </h2>
                  </div>

                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Default Access
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-4xl font-bold text-slate-900">₦0</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Good for trying the platform and testing the paper preview flow.
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    "Access preview questions in available papers",
                    "Practice inside a clean CBT-style interface",
                    "View preview-level result summary",
                    "Get started immediately after account creation",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-teal-600"
                      />
                      <p className="text-sm leading-7 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/papers"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Continue with Free Access
                </Link>
              </div>

              <div className="relative rounded-[28px] border border-amber-200 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-6 text-white shadow-xl shadow-slate-300/40">
                <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950">
                  <Crown size={14} />
                  Recommended
                </div>

                <div className="max-w-lg">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
                    Premium Plan
                  </p>
                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                    Unlock the full Pharm Tech experience
                  </h2>
                </div>

                <div className="mt-6">
                  <p className="text-4xl font-bold">{formatNaira(PREMIUM_PRICE)}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    One-time access payment for full paper unlock and deeper exam preparation.
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    "Unlock all questions in premium papers",
                    "Go beyond the free 10-question preview",
                    "Get full paper result flow and stronger review experience",
                    "Prepare more seriously for real Pharmacy Technician CBT exams",
                    "Use your account across devices once premium is activated",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-amber-300"
                      />
                      <p className="text-sm leading-7 text-slate-100">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-amber-200">
                      <FileText size={16} />
                      <span className="text-sm font-medium">Full Papers</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-200">
                      Access complete CBT paper flow
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-amber-200">
                      <Clock3 size={16} />
                      <span className="text-sm font-medium">Better Practice</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-200">
                      Stronger timed preparation
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-amber-200">
                      <ShieldCheck size={16} />
                      <span className="text-sm font-medium">Account-based</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-200">
                      Premium tied to your account
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-amber-200">
                      <Lock size={16} />
                      <span className="text-sm font-medium">No More Limits</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-200">
                      Remove free preview restriction
                    </p>
                  </div>
                </div>

                {isPremium ? (
                  <div className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3.5 text-sm font-semibold text-white">
                    <BadgeCheck size={16} />
                    Premium Already Active
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenPayment}
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                  >
                    <Sparkles size={16} />
                    {isPending ? "Continue Premium Request" : "Upgrade to Premium"}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  How premium activation works
                </h3>

                <div className="mt-6 space-y-4">
                  {[
                    "Click upgrade and copy the payment details shown.",
                    "Make your transfer using the exact reference generated for your account.",
                    "Send your proof of payment through WhatsApp.",
                    "Your premium access will be activated on your account after confirmation.",
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

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">
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
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-teal-600"
                      />
                      <p className="text-sm leading-7 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {requestMessage && (
              <div
                className={`mt-8 rounded-2xl border px-4 py-3 text-sm ${
                  requestMessageType === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-teal-200 bg-teal-50 text-teal-700"
                }`}
              >
                {requestMessage}
              </div>
            )}
          </div>
        </Container>
      </main>

      {showPaymentModal && !isPremium && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
          <div className="w-full max-w-2xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Premium Payment
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Complete your premium upgrade
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Use the account details below, then save your request and send your proof of payment on WhatsApp.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {isPending && activeRequest && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">
                  Existing pending request found
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  Your account already has a pending premium request with reference{" "}
                  <span className="font-bold">{activeRequest.reference}</span>.
                  You can continue with that same reference.
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Amount</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {formatNaira(PREMIUM_PRICE)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Plan</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  Premium Access
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Bank Name</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="font-bold text-slate-900">{PAYMENT_DETAILS.bankName}</p>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(PAYMENT_DETAILS.bankName, "bank")
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    <Copy size={14} />
                    {copiedField === "bank" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Account Name</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="font-bold text-slate-900">
                    {PAYMENT_DETAILS.accountName}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(PAYMENT_DETAILS.accountName, "account-name")
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    <Copy size={14} />
                    {copiedField === "account-name" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Account Number</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="font-bold tracking-wide text-slate-900">
                    {PAYMENT_DETAILS.accountNumber}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(PAYMENT_DETAILS.accountNumber, "account-number")
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    <Copy size={14} />
                    {copiedField === "account-number" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-700">Payment Reference</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="font-bold text-amber-900">{currentReference}</p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentReference, "reference")}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-800"
                  >
                    <Copy size={14} />
                    {copiedField === "reference" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Important
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Use the reference above as your transfer narration if possible,
                then click “I have made payment” so your request is saved on your
                account before sending proof on WhatsApp.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handlePaymentSubmitted}
                disabled={requestLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <BadgeCheck size={18} />
                {requestLoading
                  ? "Saving request..."
                  : activeRequest
                  ? "Open WhatsApp"
                  : "I Have Made Payment"}
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <MessageCircle size={18} />
                Send Proof on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}