import Link from "next/link";
import { Stethoscope } from "lucide-react";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white">
                <Stethoscope size={20} />
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
              timed CBT-style exams, past questions, and premium answer
              explanations in a clean and professional learning environment.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
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
              <Link href="/login" className="transition hover:text-white">
                Login
              </Link>
              <Link href="/register" className="transition hover:text-white">
                Register
              </Link>
              <Link href="/dashboard" className="transition hover:text-white">
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 h-px bg-slate-800" />

        <div className="mt-6 flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 PharmTechSuccess. All rights reserved.</p>

          <p className="max-w-2xl text-sm leading-6 md:text-right">
            PharmTechSuccess is an independent exam practice platform for
            Pharmacy Technician students and is not the official PCN examination
            portal.
          </p>
        </div>
      </Container>
    </footer>
  );
}