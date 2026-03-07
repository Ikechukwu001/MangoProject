"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Stethoscope, ChevronRight } from "lucide-react";
import Container from "./Container";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Papers", href: "/papers" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <Container>
          <div className="flex h-20 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={closeMenu}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-600 text-white shadow-md shadow-teal-200">
                <Stethoscope size={20} />
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900">
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
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:bg-teal-800"
              >
                Start Practicing
              </Link>
            </div>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </Container>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] transition-all duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />

      <div
        className={`fixed inset-x-0 top-[80px] z-50 mx-4 origin-top rounded-3xl border border-white/60 bg-white/95 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-all duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="mb-5 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-600 p-4 text-white">
          <p className="text-sm font-medium text-teal-50">
            Prepare smarter for your Pharmacy Technician CBT exams
          </p>
          <p className="mt-1 text-xs text-teal-100/90">
            Practice with past questions, timed papers, and premium explanations.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-teal-700"
            >
              <span>{link.name}</span>
              <ChevronRight
                size={18}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-700"
              />
            </Link>
          ))}
        </nav>

        <div className="my-5 h-px bg-slate-200" />

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
            className="rounded-2xl bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:bg-teal-800"
          >
            Start Practicing
          </Link>
        </div>
      </div>
    </>
  );
}