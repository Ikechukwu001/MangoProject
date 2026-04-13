"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { Crown, BadgeCheck, AlertCircle } from "lucide-react";
import useUserProfile from "@/src/hooks/useUserProfile";

export default function Footer() {
  const { user, loading, isPremium, isPending } = useUserProfile();

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-20 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-teal-600 blur-3xl" />
      </div>

      <Container className="relative py-16">
        <div className="mb-14 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Ready to pass your CBT exams?
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {loading
                  ? "Checking your account status..."
                  : isPremium
                  ? "Your premium access is active and ready."
                  : isPending
                  ? "Your premium request is being reviewed."
                  : "Unlock full access to all questions and explanations."}
              </p>
            </div>

            {loading ? (
              <div className="inline-flex items-center rounded-xl bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-400">
                Loading...
              </div>
            ) : isPremium ? (
              <div className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white">
                <BadgeCheck size={16} />
                Premium Active
              </div>
            ) : isPending ? (
              <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white">
                <AlertCircle size={16} />
                Request Pending
              </div>
            ) : (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/30 transition hover:bg-teal-700"
              >
                Upgrade to Premium
                <Crown size={16} />
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl">
                <Image
                  src="/PharmTechSuccess.png"
                  alt="PharmTechSuccess"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  PharmTechSuccess
                </h3>
                <p className="text-sm text-slate-400">
                  CBT Practice Platform
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
              PharmTechSuccess helps Pharmacy Technician students practice with
              realistic CBT-style exams, past questions, and premium answer
              explanations — all in a clean, modern learning experience.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Product
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <Link href="/papers" className="transition hover:text-white">
                Papers
              </Link>
              <Link href="/pricing" className="transition hover:text-white">
                Pricing
              </Link>
              <Link href="/about" className="transition hover:text-white">
                About
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Account
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              {!user ? (
                <>
                  <Link href="/" className="transition hover:text-white">
                    Login
                  </Link>
                  <Link href="/" className="transition hover:text-white">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/papers" className="transition hover:text-white">
                    Dashboard
                  </Link>
                  {!isPremium && (
                    <Link href="/pricing" className="transition hover:text-white">
                      Upgrade
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 h-px bg-slate-800" />

        <div className="mt-6 flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 PharmTechSuccess. All rights reserved. Created by <a href="https://ikechukwu-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-500">
            iKECHUKWUFRONTEND
          </a></p>

          <p className="max-w-2xl leading-6 md:text-right">
            PharmTechSuccess is an independent CBT practice platform for
            Pharmacy Technician students and is not affiliated with the official
            PCN examination body.
          </p>
        </div>
      </Container>
    </footer>
  );
}