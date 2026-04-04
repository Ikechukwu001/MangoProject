"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, ChevronRight, Crown, BadgeCheck, AlertCircle } from "lucide-react";
import Container from "./Container";
import useUserProfile from "@/src/hooks/useUserProfile";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Papers", href: "/papers" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, isPremium, isPending } = useUserProfile();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <Container>
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl">
                <Image
                  src="/PharmTechSuccess.png"
                  alt="PharmTechSuccess"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-slate-900">
                  PharmTechSuccess
                </span>
                <span className="text-xs text-slate-500">
                  CBT Practice Platform
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              {loading ? (
                <div className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500">
                  Loading...
                </div>
              ) : !user ? (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:bg-teal-800"
                  >
                    Start Practicing
                  </Link>
                </>
              ) : isPremium ? (
                <>
                  <Link
                    href="/papers"
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>

                  <div className="inline-flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-700">
                    <BadgeCheck size={16} />
                    Premium Active
                  </div>
                </>
              ) : isPending ? (
                <>
                  <Link
                    href="/papers"
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>

                  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700">
                    <AlertCircle size={16} />
                    Pending Review
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/papers"
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-amber-600"
                  >
                    <Crown size={16} />
                    Upgrade
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white md:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </Container>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/30 transition ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />

      <div
        className={`fixed inset-x-0 top-[80px] z-50 mx-4 rounded-3xl bg-white p-5 shadow-2xl transition ${
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
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {link.name}
              <ChevronRight size={16} />
            </Link>
          ))}
        </nav>

        <div className="my-5 h-px bg-slate-200" />

        {loading ? (
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-500">
            Loading...
          </div>
        ) : !user ? (
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              onClick={closeMenu}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={closeMenu}
              className="rounded-2xl bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Start Practicing
            </Link>
          </div>
        ) : isPremium ? (
          <div className="flex flex-col gap-3">
            <Link
              href="/papers"
              onClick={closeMenu}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <div className="rounded-2xl bg-teal-50 px-4 py-3 text-center text-sm font-semibold text-teal-700">
              Premium Active
            </div>
          </div>
        ) : isPending ? (
          <div className="flex flex-col gap-3">
            <Link
              href="/papers"
              onClick={closeMenu}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-700">
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
              className="rounded-2xl bg-amber-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Upgrade to Premium
            </Link>
          </div>
        )}
      </div>
    </>
  );
}