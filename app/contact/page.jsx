import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <Container className="relative z-10">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
            Contact Us
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Let’s connect.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Have questions, partnership requests, premium access issues, or
            feedback concerning PharmTechSuccess? Reach out directly and we’ll
            respond as soon as possible.
          </p>
        </div>

        {/* CONTACT CARDS */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {/* EMAIL CARD */}
          <Link
            href="mailto:ikechukwufrontend@gmail.com"
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/40"
          >
            {/* Glow */}
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-teal-500/10 blur-3xl transition duration-300 group-hover:bg-teal-500/20" />

            <div className="relative z-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                <Image
                  src="/icons/gmail.svg"
                  alt="Email Icon"
                  width={30}
                  height={30}
                  className="opacity-90"
                />
              </div>

              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-teal-700">
                    Email Address
                  </p>

                  <h2 className="mt-2 break-all text-xl font-semibold text-slate-900">
                    ikechukwufrontend@gmail.com
                  </h2>
                </div>

                <ArrowUpRight className="text-slate-400 transition group-hover:text-teal-600" />
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                For collaborations, platform support, educational partnerships,
                or general enquiries.
              </p>
            </div>
          </Link>

          {/* WHATSAPP CARD */}
          <Link
            href="https://wa.me/2348157902426"
            target="_blank"
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/40"
          >
            {/* Glow */}
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl transition duration-300 group-hover:bg-emerald-500/20" />

            <div className="relative z-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                <Image
                  src="/icons/whatsapp.svg"
                  alt="WhatsApp Icon"
                  width={30}
                  height={30}
                  className="opacity-90"
                />
              </div>

              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    WhatsApp
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    +234 815 790 2426
                  </h2>
                </div>

                <ArrowUpRight className="text-slate-400 transition group-hover:text-emerald-600" />
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Reach out directly for faster communication, premium access
                support, or platform enquiries.
              </p>
            </div>
          </Link>
        </div>

        {/* BOTTOM TEXT */}
        <div className="mx-auto mt-14 max-w-2xl text-center">
          <p className="text-sm leading-7 text-slate-500 sm:text-base">
            PharmTechSuccess is committed to building a smarter and more modern
            CBT preparation experience for Pharmacy Technician students in
            Nigeria.
          </p>
        </div>
      </Container>
    </main>
  );
}