"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle2,
} from "lucide-react";

import Container from "@/components/layout/Container";
import { createClient } from "@/src/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = () => {
    setCooldown(60);

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const sendResetEmail = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return false;
    }

    setSent(true);
    startCooldown();
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (cooldown > 0 || loading) return;
    await sendResetEmail();
  }

  return (
    <main className="min-h-screen bg-slate-50 py-14 sm:py-20">
      <Container className="max-w-xl">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-10"
        >

          <AnimatePresence mode="wait">

            {!sent ? (

              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
                  <Mail className="text-teal-700" size={30} />
                </div>

                <h1 className="mt-6 text-3xl font-bold text-slate-900">
                  Forgot your password?
                </h1>

                <p className="mt-3 text-slate-600 leading-7">
                  Don't worry. Enter the email associated with your account
                  and we'll send you a secure password reset link.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-6"
                >

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600"
                    />

                  </div>

                  {message && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || cooldown > 0}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />

                    {loading
                      ? "Sending..."
                      : "Send Reset Link"}
                  </button>

                </form>

              </motion.div>

            ) : (

              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2
                    size={34}
                    className="text-green-600"
                  />
                </div>

                <h2 className="mt-6 text-3xl font-bold text-slate-900">
                  Check your email
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  If an account exists for
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {email}
                </p>

                <p className="mt-5 leading-7 text-slate-600">
                  We've sent a secure password reset link.
                  Check your inbox and spam folder.
                </p>

                <button
                  disabled={loading || cooldown > 0}
                  onClick={sendResetEmail}
                  className="mt-8 w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : "Resend Email"}
                </button>

                <Link
                  href="/"
                  className="mt-4 flex justify-center text-sm font-semibold text-teal-700 hover:underline"
                >
                  Return to Sign In
                </Link>

              </motion.div>

            )}

          </AnimatePresence>

        </motion.div>

      </Container>
    </main>
  );
}