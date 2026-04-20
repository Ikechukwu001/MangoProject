"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

// 🔥 Use ONE animation for both states (or swap if you want)
import accessAnimation from "@/public/lottie/Email.json";

export default function AuthSection() {
  const supabase = createClient();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const [mode, setMode] = useState("signup");
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("default");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setCurrentUser(user ?? null);
        setCheckingUser(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setCheckingUser(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const title = useMemo(() => {
    return mode === "signup"
      ? "Create your account"
      : "Log in to continue";
  }, [mode]);

  const resetMessage = () => {
    setMessage("");
    setMessageType("default");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessage();
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName },
        },
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (data?.session) {
        router.push("/papers");
        return;
      }

      setMessage("Check your email to confirm account.");
      setMessageType("success");
      setMode("login");
      setPassword("");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      setLoading(false);
      return;
    }

    router.push("/papers");
  };

  if (checkingUser) return null;

  return (
    <section className="bg-slate-50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* MOBILE STACK → animation first */}
        <div className="grid gap-8 lg:grid-cols-2 items-center">

          {/* =========================
              LEFT: PREMIUM ANIMATION BOX
          ========================== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="rounded-[32px] border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,0.06)]">

              {/* ANIMATION BOX */}
              <div className="rounded-3xl border bg-gradient-to-br from-slate-50 to-white p-4 shadow-inner">

                <div className="flex flex-col items-center justify-center">

                  <div className="w-[160px] sm:w-[200px]">
                    <Lottie animationData={accessAnimation} loop />
                  </div>

                  {/* 🔥 MINIMAL TEXT ONLY */}
                  {!currentUser ? (
                    <p className="mt-3 text-sm text-slate-500 text-center">
                      Create account → Start practice
                    </p>
                  ) : (
                    <div className="mt-3 text-center">
                      <p className="text-xs text-slate-400">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium text-slate-800 truncate max-w-[220px] mx-auto">
                        {currentUser.email}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </motion.div>

          {/* =========================
              RIGHT: AUTH FORM (UNCHANGED CORE)
          ========================== */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-7 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

            {!currentUser ? (
              <>
                <h3 className="text-xl font-semibold text-slate-900">
                  {title}
                </h3>

                <div className="mt-4 flex rounded-xl bg-slate-100 p-1">
                  <button
                    onClick={() => setMode("signup")}
                    className={`flex-1 rounded-lg py-2 text-sm ${
                      mode === "signup" ? "bg-white shadow" : ""
                    }`}
                  >
                    Sign Up
                  </button>

                  <button
                    onClick={() => setMode("login")}
                    className={`flex-1 rounded-lg py-2 text-sm ${
                      mode === "login" ? "bg-white shadow" : ""
                    }`}
                  >
                    Log In
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">

                  {mode === "signup" && (
                    <input
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border p-3"
                      required
                    />
                  )}

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border p-3"
                    required
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border p-3 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {message && (
                    <div className="text-sm text-red-500">
                      {message}
                    </div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full rounded-xl bg-teal-600 py-3 text-white"
                  >
                    {loading
                      ? "Processing..."
                      : mode === "signup"
                      ? "Create Account"
                      : "Log In"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-slate-900">
                  Continue
                </h3>

                <button
                  onClick={() => router.push("/papers")}
                  className="mt-5 w-full rounded-xl bg-teal-600 py-3 text-white flex items-center justify-center gap-2"
                >
                  Go to Papers <ArrowRight size={16} />
                </button>

                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setCurrentUser(null);
                  }}
                  className="mt-3 w-full rounded-xl border py-3 flex items-center justify-center gap-2"
                >
                  <LogIn size={16} />
                  Switch Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}