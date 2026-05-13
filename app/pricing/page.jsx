"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [status, setStatus] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!reference) { setStatus("error"); setErrorMessage("No payment reference found."); return; }
    fetch(`/api/paystack/verify?reference=${reference}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) { setStatus("success"); setTimeout(() => router.push("/papers"), 4000); }
        else { setStatus("error"); setErrorMessage(data.error || "Verification failed."); }
      })
      .catch(() => { setStatus("error"); setErrorMessage("Network error. Contact support."); });
  }, [reference, router]);

  if (status === "verifying") return <div className="text-center"><Loader2 className="mx-auto animate-spin text-teal-600" size={32} /><p className="mt-4 text-slate-600">Verifying payment…</p></div>;
  if (status === "success") return <div className="text-center"><CheckCircle2 className="mx-auto text-teal-600" size={40} /><h1 className="mt-4 text-xl font-bold text-slate-900">Premium activated!</h1><p className="mt-2 text-sm text-slate-500">Redirecting to papers…</p><Link href="/papers" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white">Go to Papers <ArrowRight size={15} /></Link></div>;
  return <div className="text-center"><XCircle className="mx-auto text-red-500" size={40} /><h1 className="mt-4 text-xl font-bold text-slate-900">Verification failed</h1><p className="mt-2 text-sm text-slate-500">{errorMessage}</p><Link href="/pricing" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white">Back to Pricing</Link></div>;
}

export default function PaystackVerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <Container>
        <div className="mx-auto max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <Suspense fallback={<div className="text-center"><Loader2 className="mx-auto animate-spin text-teal-600" size={32} /><p className="mt-4 text-slate-500">Loading…</p></div>}>
            <VerifyContent />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}