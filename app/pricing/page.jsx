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
  X,
} from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/src/lib/supabase/client";

const PREMIUM_PRICE = 5000;

const PAYMENT_DETAILS = {
  bankName: "Opay",
  accountName: "PharmTechSuccess",
  accountNumber: "7088358123",
  whatsappNumber: "2348157902426",
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

function PaymentInfoCard({
  label,
  value,
  copyKey,
  copiedField,
  onCopy,
  highlight = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-amber-200 bg-amber-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <p
        className={`text-xs font-medium uppercase tracking-wider ${
          highlight ? "text-amber-700" : "text-slate-500"
        }`}
      >
        {label}
      </p>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`break-all text-sm font-bold sm:text-base ${
            highlight ? "text-amber-900" : "text-slate-900"
          }`}
        >
          {value}
        </p>

        {copyKey ? (
          <button
            type="button"
            onClick={() => onCopy(value, copyKey)}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              highlight
                ? "border-amber-200 bg-white text-amber-800 hover:bg-amber-100/40"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Copy size={14} />
            {copiedField === copyKey ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
    </div>
  );
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
    <>
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
                you’re ready to unlock the full question bank and stronger exam
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
                  <span className="truncate">Premium request pending confirmation</span>
                </div>
              )}
            </div>

            <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-2 lg:gap-6">
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
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:mt-8"
                >
                  Continue with Free Access
                </Link>
              </div>

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
                    One-time access payment for full paper unlock and deeper exam preparation.
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
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-amber-300"
                      />
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
                  <div className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3.5 text-sm font-semibold text-white sm:mt-8">
                    <BadgeCheck size={16} />
                    Premium Already Active
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenPayment}
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 sm:mt-8"
                  >
                    <Sparkles size={16} />
                    {isPending ? "Continue Premium Request" : "Upgrade to Premium"}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  How premium activation works
                </h3>

                <div className="mt-5 space-y-4 sm:mt-6">
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
                className={`mt-6 rounded-2xl border px-4 py-3 text-sm sm:mt-8 ${
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
  <div className="fixed inset-0 z-[70] bg-slate-950/65 p-3 backdrop-blur-[2px] sm:p-4">
    <div className="flex min-h-dvh items-end justify-center sm:items-center">
      
      {/* MODAL CARD */}
      <div className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:rounded-[26px]">
        
        {/* HEADER */}
        <div className="border-b border-slate-200 px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
          <div className="pr-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700">
              PharmTechSuccess
            </p>

            <h2 className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
              Complete your premium upgrade
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Transfer the amount below and send your proof on WhatsApp for activation.
            </p>
          </div>

          {/* CLOSE */}
          <button
            onClick={() => setShowPaymentModal(false)}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[65vh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">

          {isPending && activeRequest && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-semibold text-amber-800">
                Pending request detected
              </p>
              <p className="mt-1 text-xs text-amber-700">
                Ref: <span className="font-bold">{activeRequest.reference}</span>
              </p>
            </div>
          )}

          {/* PAYMENT GRID */}
          <div className="grid gap-3">

            <PaymentInfoCard label="Amount" value={formatNaira(PREMIUM_PRICE)} />

            <PaymentInfoCard
              label="Bank"
              value={PAYMENT_DETAILS.bankName}
              copyKey="bank"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />

            <PaymentInfoCard
              label="Account Name"
              value={PAYMENT_DETAILS.accountName}
              copyKey="account-name"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />

            <PaymentInfoCard
              label="Account Number"
              value={PAYMENT_DETAILS.accountNumber}
              copyKey="account-number"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />

            <PaymentInfoCard
              label="Reference (VERY IMPORTANT)"
              value={currentReference}
              copyKey="reference"
              copiedField={copiedField}
              onCopy={copyToClipboard}
              highlight
            />
          </div>

          {/* NOTE */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-600">
              Use the reference as your transfer narration to avoid delays.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <div className="grid gap-3">

            <button
              onClick={handlePaymentSubmitted}
              disabled={requestLoading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <BadgeCheck size={16} />
              {requestLoading
                ? "Saving..."
                : activeRequest
                ? "Open WhatsApp"
                : "I Have Made Payment"}
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle size={16} />
              Send Proof on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}