"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference =
    searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setErrorMessage("No payment reference found. Please contact support.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${reference}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setTimeout(() => router.push("/papers"), 4000);
        } else {
          setStatus("error");
          setErrorMessage(
            data.error || "Payment verification failed. Please contact support."
          );
        }
      } catch {
        setStatus("error");
        setErrorMessage("A network error occurred. Please contact support.");
      }
    }

    verify();
  }, [reference, router]);

  if (status === "verifying") {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Loader2 size={28} className="animate-spin text-teal-600" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-slate-900">
          Verifying your payment
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Please wait while we confirm your transaction with Paystack…
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
          <CheckCircle2 size={32} className="text-teal-600" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-slate-900">
          Premium activated!
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your account has been upgraded to premium. You now have full access to
          all papers and exam preparation features.
        </p>
        <p className="mt-4 text-xs text-slate-400">
          Redirecting you to papers in a moment…
        </p>
        <Link
          href="/papers"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-500"
        >
          Go to Papers
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <XCircle size={32} className="text-red-500" />
      </div>
      <h1 className="mt-5 text-xl font-bold text-slate-900">
        Verification failed
      </h1>
      <p className="mt-2 text-sm text-slate-600">{errorMessage}</p>
      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/pricing"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Back to Pricing
        </Link>
        <a
          href={`https://wa.me/2348157902426?text=${encodeURIComponent(
            `Hello, I made a payment but verification failed. Reference: ${reference}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"
        >
          Contact Support on WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function PaystackVerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <Container>
        <div className="mx-auto max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <Suspense
            fallback={
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Loader2 size={28} className="animate-spin text-teal-600" />
                </div>
                <p className="mt-4 text-sm text-slate-500">Loading…</p>
              </div>
            }
          >
            <VerifyContent />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}