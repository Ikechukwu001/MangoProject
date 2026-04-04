"use client";

import { useState } from "react";
import PaystackPop from "@paystack/inline-js";

export default function PaystackPremiumButton({ user }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: 500000, // ₦5,000 in kobo
          metadata: {
            plan: "premium",
            userId: user.uid,
            fullName: user.fullName,
          },
        }),
      });

      const result = await res.json();

      if (!result.success) {
        alert(result.message || "Unable to start payment.");
        return;
      }

      const popup = new PaystackPop();

      popup.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: 500000,
        access_code: result.data.access_code,
        onSuccess: (transaction) => {
          window.location.href = `/payment/verify?reference=${transaction.reference}`;
        },
        onCancel: () => {
          alert("Payment was cancelled.");
        },
      });
    } catch (error) {
      alert("Payment initialization failed.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="rounded-2xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
    >
      {loading ? "Processing..." : "Unlock Premium for ₦5,000"}
    </button>
  );
}