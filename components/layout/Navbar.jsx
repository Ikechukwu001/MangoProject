"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronRight,
  Crown,
  BadgeCheck,
  AlertCircle,
  Zap,
} from "lucide-react";

import Container from "./Container";
import useUserProfile from "@/src/hooks/useUserProfile";
import { useStreak } from "@/src/hooks/useStreak";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Papers", href: "/papers" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
  { name: "Streak", href: "/streak" },
  { name: "Insights", href: "/insights" },
  { name: "Confidence", href: "/confidence" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);


  const { user, loading, isPremium, isPending } = useUserProfile();
  const { streak } = useStreak(user?.id);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }

          100% {
            background-position: 200% center;
          }
        }

        .cta-shimmer {
          background: linear-gradient(
            105deg,
            #0f766e 0%,
            #0d9488 30%,
            #5eead4 50%,
            #0d9488 70%,
            #0f766e 100%
          );

          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          transition: opacity 0.2s;
        }

        .cta-shimmer:hover {
          opacity: 0.92;
        }

        .mobile-cta-shimmer {
          background: linear-gradient(
            105deg,
            #0f766e 0%,
            #0d9488 30%,
            #5eead4 50%,
            #0d9488 70%,
            #0f766e 100%
          );

          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Glow Effect */}
      <div className="pointer-events-none fixed left-1/2 top-0 z-40 h-24 w-[40rem] -translate-x-1/2 bg-teal-500/10 blur-3xl" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/75 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60">
        <Container>
          <div className="flex h-20 items-center justify-between">
            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={closeMenu}
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-900 shadow-lg shadow-teal-900/20">
                <Image
                  src="/PharmTechSuccessMainLogo.jpg"
                  alt="PharmTechSuccess"
                  fill
                  className="object-cover scale-105"
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-teal-700 to-emerald-600 bg-clip-text text-lg font-extrabold text-transparent">
                  PharmTechSuccess.
                </span>

                <span className="text-xs tracking-wide text-slate-500">
                  CBT Practice Platform
                </span>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-sm font-semibold tracking-wide text-slate-600 transition duration-300 hover:text-teal-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-teal-600 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* DESKTOP RIGHT SIDE */}
            <div className="hidden items-center gap-3 md:flex">
              {/* CONTACT CTA */}
              <Link
                href="/contact"
                className="hidden lg:inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              >
                Contact
              </Link>

              {loading ? (
                <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-100" />
              ) : !user ? (
                <>
                  <Link
                    href="/#auth-section"
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/#auth-section"
                    className="cta-shimmer inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-200/60"
                  >
                    <Zap size={14} className="shrink-0" />
                    Start Free
                  </Link>
                </>
              ) : isPremium ? (
                <>
            <Link
              href="/streak"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              🔥 {streak?.current_streak ?? 0}
              <span className="text-slate-400 font-normal">day streak</span>
            </Link>

                  <div className="inline-flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-700">
                    <BadgeCheck size={16} />
                    Premium Active
                  </div>
                </>
              ) : isPending ? (
                <>
            <Link
              href="/streak"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              🔥 {streak?.current_streak ?? 0}
              <span className="text-slate-400 font-normal">day streak</span>
            </Link>

                  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700">
                    <AlertCircle size={16} />
                    Pending Review
                  </div>
                </>
              ) : (
                <>
            <Link
              href="/streak"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              🔥 {streak?.current_streak ?? 0}
              <span className="text-slate-400 font-normal">day streak</span>
            </Link>

                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-200 transition hover:bg-amber-600"
                  >
                    <Crown size={15} />
                    Upgrade
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:border-teal-200 hover:bg-teal-50 md:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </Container>
      </header>

      {/* MOBILE BACKDROP */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition duration-300 ${
          menuOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-x-0 top-[84px] z-50 mx-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition duration-300 ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3.5 text-sm font-semibold text-slate-700 transition duration-300 hover:border-teal-100 hover:bg-teal-50/70 hover:text-teal-700"
            >
              {link.name}

              <ChevronRight
                size={16}
                className="transition duration-300 group-hover:translate-x-1 group-hover:text-teal-600"
              />
            </Link>
          ))}
        </nav>

        <div className="my-5 h-px bg-slate-200" />

        {loading ? (
          <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
        ) : !user ? (
          <div className="flex flex-col gap-3">
            <Link
              href="/#auth-section"
              onClick={closeMenu}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sign in
            </Link>

            <Link
              href="/#auth-section"
              onClick={closeMenu}
              className="mobile-cta-shimmer inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-200/50"
            >
              <Zap size={15} />
              Start Practicing Free
            </Link>
          </div>
        ) : isPremium ? (
          <div className="flex flex-col gap-3">
            <Link
              href="/streak"
              onClick={closeMenu}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Streak
            </Link>

            <div className="rounded-2xl bg-teal-50 px-4 py-3 text-center text-sm font-semibold text-teal-700">
              <BadgeCheck size={15} className="mr-1 inline" />
              Premium Active
            </div>
          </div>
        ) : isPending ? (
          <div className="flex flex-col gap-3">
            <Link
              href="/streak"
              onClick={closeMenu}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Streak
            </Link>

            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-700">
              <AlertCircle size={15} className="mr-1 inline" />
              Premium Pending
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Link
              href="/papers"
              onClick={closeMenu}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Dashboard
            </Link>

            <Link
              href="/pricing"
              onClick={closeMenu}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              <Crown size={15} />
              Upgrade to Premium
            </Link>
          </div>
        )}
      </div>
    </>
  );
}