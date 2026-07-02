"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import Container from "@/components/layout/Container";
import { createClient } from "@/src/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  // Gate the form on an actual, confirmed recovery session
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);

  useEffect(() => {
    let resolved = false;

    // Primary signal: Supabase fires this event once the recovery
    // session from the callback redirect is actually live.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          resolved = true;
          setSessionValid(true);
          setCheckingSession(false);
        }
      }
    );

    // Fallback: in case the event already fired before this component
    // mounted, or on a hard refresh, check for an existing session directly.
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!resolved) {
        if (session) {
          setSessionValid(true);
        } else {
          setSessionValid(false);
        }
        setCheckingSession(false);
      }
    })();

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const checks = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const passwordValid = Object.values(checks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!sessionValid) {
      setMessage("This password reset link is invalid or has expired.");
      return;
    }

    if (!passwordValid) {
      setMessage("Please choose a stronger password.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/?mode=login");
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-14 sm:py-20">
      <Container className="max-w-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-10"
        >
          <AnimatePresence mode="wait">
            {checkingSession ? (
              <motion.div
                key="checking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-10 text-center"
              >
                <Loader2
                  className="animate-spin text-teal-700"
                  size={32}
                />
                <p className="mt-4 text-slate-600">
                  Verifying your reset link...
                </p>
              </motion.div>
            ) : !sessionValid ? (
              <motion.div
                key="invalid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle
                    className="text-red-600"
                    size={30}
                  />
                </div>

                <h2 className="mt-6 text-3xl font-bold text-slate-900">
                  Link expired or invalid
                </h2>

                <p className="mt-3 text-slate-600 leading-7">
                  This password reset link is no longer valid. Reset links
                  expire after a short time and can only be used once.
                </p>

                <Link
                  href="/forgot-password"
                  className="mt-8 inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
                >
                  Request a new link
                </Link>
              </motion.div>
            ) : !success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
                  <Lock className="text-teal-700" size={30} />
                </div>

                <h1 className="mt-6 text-3xl font-bold text-slate-900">
                  Create a new password
                </h1>

                <p className="mt-3 text-slate-600 leading-7">
                  Choose a strong password for your PharmTechSuccess account.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-teal-600"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-teal-600"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirm(!showConfirm)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                      >
                        {showConfirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 text-sm">
                    <p
                      className={
                        checks.length
                          ? "text-green-600"
                          : "text-slate-500"
                      }
                    >
                      • At least 8 characters
                    </p>

                    <p
                      className={
                        checks.uppercase
                          ? "text-green-600"
                          : "text-slate-500"
                      }
                    >
                      • One uppercase letter
                    </p>

                    <p
                      className={
                        checks.lowercase
                          ? "text-green-600"
                          : "text-slate-500"
                      }
                    >
                      • One lowercase letter
                    </p>

                    <p
                      className={
                        checks.number
                          ? "text-green-600"
                          : "text-slate-500"
                      }
                    >
                      • One number
                    </p>

                    <p
                      className={
                        checks.symbol
                          ? "text-green-600"
                          : "text-slate-500"
                      }
                    >
                      • One special character
                    </p>
                  </div>

                  {message && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {message}
                    </div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
                  >
                    {loading
                      ? "Updating Password..."
                      : "Update Password"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2
                    className="text-green-600"
                    size={34}
                  />
                </div>

                <h2 className="mt-6 text-3xl font-bold text-slate-900">
                  Password Updated
                </h2>

                <p className="mt-3 text-slate-600">
                  Your password has been changed successfully.
                </p>

                <p className="mt-6 text-sm text-slate-500">
                  Redirecting you to sign in...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </main>
  );
}