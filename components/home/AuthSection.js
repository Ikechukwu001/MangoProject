"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  LogIn,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

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
      ? "Create your student account"
      : "Log in to continue your practice";
  }, [mode]);

  const subtitle = useMemo(() => {
    return mode === "signup"
      ? "Start practicing Pharmacy Technician CBT questions with a clean, guided experience."
      : "Pick up from where you stopped and continue your exam preparation.";
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
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        if (error.status === 429) {
          setMessage(
            "Too many signup attempts. Please wait a minute and try again."
          );
        } else {
          setMessage(error.message);
        }
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (data?.user && data.session) {
        setMessage("Account created successfully. Redirecting...");
        setMessageType("success");
        setLoading(false);
        router.push("/papers");
        router.refresh();
        return;
      }

      setMessage(
        "Account created. Please check your email and confirm your account before logging in."
      );
      setMessageType("success");
      setLoading(false);
      setMode("login");
      setPassword("");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.status === 400) {
        setMessage(
          "Login failed. Check your email/password, or confirm your email first if you just signed up."
        );
      } else if (error.status === 429) {
        setMessage("Too many login attempts. Please wait a bit and try again.");
      } else {
        setMessage(error.message);
      }
      setMessageType("error");
      setLoading(false);
      return;
    }

    setMessage("Login successful. Redirecting...");
    setMessageType("success");
    setLoading(false);

    router.push("/papers");
    router.refresh();
  };

  if (checkingUser) {
    return (
      <section
        id="auth-section"
        className="relative bg-slate-50 py-14 lg:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-8 w-72 rounded bg-slate-200" />
              <div className="h-4 w-full max-w-xl rounded bg-slate-200" />
              <div className="h-4 w-full max-w-md rounded bg-slate-200" />
              <div className="mt-6 h-12 w-full rounded-2xl bg-slate-200" />
              <div className="h-12 w-full rounded-2xl bg-slate-200" />
              <div className="h-12 w-full rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (currentUser) {
    return (
      <section
        id="auth-section"
        className="relative bg-slate-50 py-14 lg:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-950 via-teal-900 to-slate-950 p-6 text-white shadow-[0_20px_80px_rgba(15,118,110,0.18)] sm:p-8 lg:p-10">
              <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-teal-400/15 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-sky-400/10 blur-3xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">
                  PharmTechSuccess Access
                </div>

                <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
                  Welcome back. Your CBT practice is ready for you.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50/85 sm:text-base">
                  You’re already signed in. Continue your preparation, return to
                  your papers, and keep building confidence before the real exam.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-100">
                      <BookOpen size={18} />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">Continue Papers</h3>
                    <p className="mt-1 text-xs leading-6 text-teal-50/75">
                      Return straight to your paper library and start practicing.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-100">
                      <Clock3 size={18} />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">Stay Consistent</h3>
                    <p className="mt-1 text-xs leading-6 text-teal-50/75">
                      Keep improving your speed and accuracy with regular timed practice.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-100">
                      <ShieldCheck size={18} />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">Account Active</h3>
                    <p className="mt-1 text-xs leading-6 text-teal-50/75">
                      Your student account is active and ready to continue.
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">
                    Signed in as
                  </p>
                  <p className="mt-2 text-sm leading-6 text-teal-50/85">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-7 lg:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Student Access
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Continue your practice
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  You’re already logged in. Go straight to your papers and keep
                  practicing in your exam-style environment.
                </p>
              </div>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Ready to continue
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Jump back into your paper library and continue your Pharm
                      Tech CBT preparation.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/papers")}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Continue Practice
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setCurrentUser(null);
                  setMessage("");
                  setMessageType("default");
                  setMode("login");
                  router.refresh();
                }}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <LogIn size={16} />
                Use another account
              </button>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Built for Nigerian Pharm Tech students
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Continue from your account and move into papers immediately
                  without signing in again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="auth-section" className="relative bg-slate-50 py-14 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-950 via-teal-900 to-slate-950 p-6 text-white shadow-[0_20px_80px_rgba(15,118,110,0.18)] sm:p-8 lg:p-10">
            <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-teal-400/15 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-sky-400/10 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">
                PharmTechSuccess Access
              </div>

              <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
                Start your Pharm Tech exam preparation with the right system.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50/85 sm:text-base">
                Practice with a real CBT-style experience built for Nigerian
                Pharmacy Technician students. Create an account, track your
                progress, and prepare with confidence.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-100">
                    <BookOpen size={18} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">Real CBT Feel</h3>
                  <p className="mt-1 text-xs leading-6 text-teal-50/75">
                    Structured practice that feels close to the actual exam.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-100">
                    <Clock3 size={18} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">Timed Practice</h3>
                  <p className="mt-1 text-xs leading-6 text-teal-50/75">
                    Improve speed, accuracy, and confidence before exam day.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-100">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">Your Progress</h3>
                  <p className="mt-1 text-xs leading-6 text-teal-50/75">
                    Save your account and continue your preparation anytime.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">
                  What you get immediately
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    "Create your personal student account",
                    "Access free preview questions before premium upgrade",
                    "Track your progress inside your dashboard",
                    "Prepare with a clean medical-themed learning experience",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-teal-300"
                      />
                      <p className="text-sm leading-6 text-teal-50/85">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-7 lg:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                Student Access
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            </div>

            <div className="mt-6 inline-flex rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  resetMessage();
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Sign Up
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  resetMessage();
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Log In
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    required
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {message ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    messageType === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-teal-200 bg-teal-50 text-teal-700"
                  }`}
                >
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? mode === "signup"
                    ? "Creating Account..."
                    : "Logging In..."
                  : mode === "signup"
                  ? "Create Account"
                  : "Log In"}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                Built for Nigerian Pharm Tech students
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Start with a free account now. Premium access can be unlocked
                later for the full question bank and expanded exam practice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}