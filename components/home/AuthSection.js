"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { Eye, EyeOff, ArrowRight, LogOut, Sparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { createClient } from "@/src/lib/supabase/client";
import accessAnimation from "@/public/lottie/Email.json";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pharmtechsuccess.study";

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
  const [googleLoading, setGoogleLoading] = useState(false);
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

      if (session?.user) {
        router.refresh();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const resetMessage = () => {
    setMessage("");
    setMessageType("default");
  };

  const handleGoogleSignIn = async () => {
    resetMessage();
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${SITE_URL}/auth/callback?next=/papers`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      setGoogleLoading(false);
    }
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
          emailRedirectTo: `${SITE_URL}/auth/callback?next=/papers`,
          data: {
            full_name: fullName,
          },
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
        router.refresh();
        return;
      }

      setMessage("Check your email to confirm your account.");
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
    router.refresh();
  };

  if (checkingUser) return null;

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "4rem 1rem",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(20,184,166,0.12)",
                border: "1px solid rgba(20,184,166,0.25)",
                borderRadius: 100,
                padding: "6px 14px",
                marginBottom: "1.5rem",
              }}
            >
              <Sparkles size={13} color="#14b8a6" />
              <span
                style={{
                  fontSize: 12,
                  color: "#14b8a6",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                }}
              >
                PHARMTECH CBT PLATFORM
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                margin: "0 0 1.25rem",
                letterSpacing: "-0.02em",
              }}
            >
              Your Pharmacy Technician PCNE
              <br />
              <span style={{ color: "#14b8a6" }}>edge starts here.</span>
            </h1>

            <p
              style={{
                fontSize: 16,
                color: "#94a3b8",
                lineHeight: 1.7,
                margin: "0 0 2.5rem",
                maxWidth: 420,
              }}
            >
              Access curated pharmacy tech council exam papers, track your
              progress, and sharpen your knowledge — all in one place.
            </p>

            <div
              style={{
                background: "#ffffff",
                border: "2px solid rgba(0,0,0,0.08)",
                borderRadius: 24,
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: 160 }}>
                <Lottie animationData={accessAnimation} loop />
              </div>

              {!currentUser ? (
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 13,
                    color: "#8f8f8f",
                    textAlign: "center",
                  }}
                >
                  Sign up and start in under 60 seconds
                </p>
              ) : (
                <div style={{ marginTop: 12, textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                    Signed in as
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      margin: "4px 0 0",
                      maxWidth: 220,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentUser.email}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              background: "rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 28,
              padding: "clamp(1.5rem, 4vw, 2.5rem)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
            }}
          >
            {!currentUser ? (
              <>
                <div
                  style={{
                    display: "flex",
                    background: "rgba(0,0,0,0.05)",
                    borderRadius: 14,
                    padding: 4,
                    marginBottom: "1.25rem",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {["signup", "login"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMode(m);
                        resetMessage();
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 11,
                        fontSize: 14,
                        fontWeight: 500,
                        transition: "all 0.2s",
                        background: mode === m ? "#fff" : "transparent",
                        color: mode === m ? "#0d9488" : "#94a3b8",
                        boxShadow:
                          mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      {m === "signup" ? "Create Account" : "Sign In"}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    marginBottom: "1rem",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: 14,
                    cursor:
                      googleLoading || loading ? "not-allowed" : "pointer",
                    background: "#ffffff",
                    color: "#334155",
                    fontSize: 14,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                    opacity: googleLoading || loading ? 0.7 : 1,
                  }}
                >
                  <FcGoogle size={20} />
                  {googleLoading ? "Connecting..." : "Continue with Google"}
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(0,0,0,0.08)",
                    }}
                  />
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>OR</span>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(0,0,0,0.08)",
                    }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.form
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.875rem",
                    }}
                  >
                    {mode === "signup" && (
                      <div>
                        <label style={labelStyle}>FULL NAME</label>
                        <input
                          placeholder="Jane Smith"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          style={inputStyle}
                          onFocus={(e) =>
                            Object.assign(e.target.style, inputFocusStyle)
                          }
                          onBlur={(e) =>
                            Object.assign(e.target.style, inputBlurStyle)
                          }
                        />
                      </div>
                    )}

                    <div>
                      <label style={labelStyle}>EMAIL</label>
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, inputFocusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputBlurStyle)
                        }
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>PASSWORD</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ ...inputStyle, paddingRight: 44 }}
                          onFocus={(e) =>
                            Object.assign(e.target.style, inputFocusStyle)
                          }
                          onBlur={(e) =>
                            Object.assign(e.target.style, inputBlurStyle)
                          }
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#94a3b8",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {message && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            fontSize: 13,
                            background:
                              messageType === "success"
                                ? "rgba(20,184,166,0.1)"
                                : "rgba(239,68,68,0.1)",
                            border: `1px solid ${
                              messageType === "success"
                                ? "rgba(20,184,166,0.25)"
                                : "rgba(239,68,68,0.25)"
                            }`,
                            color:
                              messageType === "success"
                                ? "#0d9488"
                                : "#ef4444",
                          }}
                        >
                          {message}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      disabled={loading || googleLoading}
                      whileHover={{ scale: loading ? 1 : 1.01 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      style={{
                        width: "100%",
                        padding: "14px 0",
                        marginTop: 4,
                        border: "none",
                        borderRadius: 14,
                        cursor:
                          loading || googleLoading ? "not-allowed" : "pointer",
                        background:
                          loading || googleLoading
                            ? "rgba(20,184,166,0.4)"
                            : "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 600,
                        letterSpacing: "0.01em",
                        boxShadow:
                          loading || googleLoading
                            ? "none"
                            : "0 8px 24px rgba(20,184,166,0.25)",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      {loading ? (
                        <span>Processing...</span>
                      ) : (
                        <>
                          <span>
                            {mode === "signup"
                              ? "Create Account"
                              : "Sign In"}
                          </span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                </AnimatePresence>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "#94a3b8",
                    marginTop: "1.25rem",
                  }}
                >
                  {mode === "signup"
                    ? "Already have an account? "
                    : "Don't have an account? "}

                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signup" ? "login" : "signup");
                      resetMessage();
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#14b8a6",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 500,
                      padding: 0,
                    }}
                  >
                    {mode === "signup" ? "Sign in" : "Create one"}
                  </button>
                </p>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(20,184,166,0.1)",
                    border: "2px solid rgba(20,184,166,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontSize: 20,
                  }}
                >
                  👤
                </div>

                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    margin: "0 0 4px",
                  }}
                >
                  Welcome back
                </h3>

                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: 13,
                    margin: "0 0 2rem",
                  }}
                >
                  {currentUser.email}
                </p>

                <motion.button
                  type="button"
                  onClick={() => {
                    router.push("/papers");
                    router.refresh();
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    marginBottom: 12,
                    border: "none",
                    borderRadius: 14,
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    boxShadow: "0 8px 24px rgba(20,184,166,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  Go to Papers <ArrowRight size={16} />
                </motion.button>

                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setCurrentUser(null);
                    router.refresh();
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    background: "transparent",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: 14,
                    cursor: "pointer",
                    color: "#94a3b8",
                    fontSize: 14,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "border-color 0.2s",
                  }}
                >
                  <LogOut size={15} /> Switch Account
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const labelStyle = {
  fontSize: 12,
  color: "#94a3b8",
  letterSpacing: "0.05em",
  display: "block",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(0,0,0,0.03)",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: 12,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
  fontFamily: "inherit",
};

const inputFocusStyle = {
  borderColor: "rgba(20,184,166,0.5)",
  background: "rgba(20,184,166,0.03)",
};

const inputBlurStyle = {
  borderColor: "rgba(0,0,0,0.1)",
  background: "rgba(0,0,0,0.03)",
};