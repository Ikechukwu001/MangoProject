import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Linkedin, Github, Twitter, Facebook } from "lucide-react";

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact PharmTechSuccess",
    description:
      "Get in touch with PharmTechSuccess for support, partnerships, or feedback on our CBT exam preparation platform for Nigerian Pharmacy Technician students.",
    mainEntity: {
      "@type": "Organization",
      name: "PharmTechSuccess",
      email: "ikechukwufrontend@gmail.com",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "ikechukwufrontend@gmail.com",
          telephone: "+234-815-790-2426",
          areaServed: "NG",
          availableLanguage: ["English"],
        },
      ],
      founder: {
        "@type": "Person",
        name: "Ikechukwu",
        jobTitle: "Founder & Developer",
        url: "https://pharmtechsuccess.study",
      },
    },
  };

  return (
    <main className="relative overflow-hidden bg-slate-50 py-14 sm:py-20 lg:py-24">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl sm:h-[500px] sm:w-[500px]" />
        <div className="absolute bottom-0 right-0 h-[200px] w-[200px] rounded-full bg-emerald-400/10 blur-3xl sm:h-[300px] sm:w-[300px]" />
      </div>

      <Container className="relative z-10 px-4 sm:px-6">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700 sm:px-4 sm:text-xs">
            Contact Us
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:mt-6 sm:text-4xl lg:text-5xl">
            Let's connect.
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base sm:leading-8 lg:text-lg">
            Have questions, partnership requests, premium access issues, or
            feedback concerning PharmTechSuccess? Reach out directly and we'll
            respond as soon as possible.
          </p>
        </div>

        {/* CONTACT CARDS */}
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2">
          {/* EMAIL CARD */}
          <Link
            href="mailto:ikechukwufrontend@gmail.com"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/40 sm:rounded-3xl sm:p-7"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-teal-500/10 blur-3xl transition duration-300 group-hover:bg-teal-500/20 sm:h-32 sm:w-32" />

            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 sm:h-16 sm:w-16 sm:rounded-2xl">
                <Image
                  src="/icons/gmail.svg"
                  alt="Email Icon"
                  width={24}
                  height={24}
                  className="opacity-90 sm:h-[30px] sm:w-[30px]"
                />
              </div>

              <div className="mt-4 flex items-start justify-between gap-3 sm:mt-6 sm:gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-teal-700 sm:text-sm">
                    Email Address
                  </p>

                  <h2 className="mt-1.5 break-all text-base font-semibold text-slate-900 sm:mt-2 sm:text-xl">
                    ikechukwufrontend@gmail.com
                  </h2>
                </div>

                <ArrowUpRight className="shrink-0 text-slate-400 transition group-hover:text-teal-600" size={20} />
              </div>

              <p className="mt-3 text-xs leading-6 text-slate-600 sm:mt-4 sm:text-sm sm:leading-7">
                For collaborations, platform support, educational partnerships,
                or general enquiries.
              </p>
            </div>
          </Link>

          {/* WHATSAPP CARD */}
          <Link
            href="https://wa.me/2348157902426"
            target="_blank"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/40 sm:rounded-3xl sm:p-7"
          >
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-emerald-500/10 blur-3xl transition duration-300 group-hover:bg-emerald-500/20 sm:h-32 sm:w-32" />

            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 sm:h-16 sm:w-16 sm:rounded-2xl">
                <Image
                  src="/icons/whatsapp.svg"
                  alt="WhatsApp Icon"
                  width={24}
                  height={24}
                  className="opacity-90 sm:h-[30px] sm:w-[30px]"
                />
              </div>

              <div className="mt-4 flex items-start justify-between gap-3 sm:mt-6 sm:gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-emerald-700 sm:text-sm">
                    WhatsApp
                  </p>

                  <h2 className="mt-1.5 text-base font-semibold text-slate-900 sm:mt-2 sm:text-xl">
                    +234 906 047 3646                  </h2>
                </div>

                <ArrowUpRight className="shrink-0 text-slate-400 transition group-hover:text-emerald-600" size={20} />
              </div>

              <p className="mt-3 text-xs leading-6 text-slate-600 sm:mt-4 sm:text-sm sm:leading-7">
                Reach out directly for faster communication, premium access
                support, or platform enquiries.
              </p>
            </div>
          </Link>
        </div>

        {/* MEET THE DEVELOPER */}
        <div className="mx-auto mt-8 max-w-4xl sm:mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 sm:rounded-3xl sm:p-8 lg:p-10">
            <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-teal-500/10 blur-3xl sm:-left-10 sm:-top-10 sm:h-40 sm:w-40" />

            <div className="relative z-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
              {/* Avatar placeholder */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-teal-500 to-emerald-500 text-lg font-bold text-black shadow-md sm:h-24 sm:w-24 sm:rounded-2xl sm:text-2xl">
                IK
              </div>

              <div className="w-full">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700 sm:text-xs">
                  Meet the Developer
                </p>

                <h3 className="mt-1.5 text-xl font-bold text-slate-900 sm:mt-2 sm:text-2xl">
                  Ikechukwu
                </h3>

                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                  Founder &amp; Developer, PharmTechSuccess
                </p>

                <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-600 sm:mt-4 sm:text-sm sm:leading-7">
                  I'm a Pharm Tech and web developer passionate about making professional certification more accessible for Nigerian students. I built PharmTechSuccess to give Pharmacy Technician students a smarter, more affordable way to prepare for the NPCE — combining real past questions, data-driven insights, and tools that actually fit how students study today.
                </p>

                {/* Social links placeholder */}
                <div className="mt-4 flex items-center justify-center gap-2.5 sm:mt-5 sm:justify-start sm:gap-3">
                  <Link
                    href="https://www.facebook.com/IKECHUKWUF00001"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-teal-200 hover:text-teal-700 sm:h-10 sm:w-10"
                    aria-label="Facebook"
                  >
                    <Facebook size={17} />
                  </Link>
                  <Link
                    href="https://github.com/ikechukwu00001"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-teal-200 hover:text-teal-700 sm:h-10 sm:w-10"
                    aria-label="GitHub"
                  >
                    <Github size={17} />
                  </Link>
                  <Link
                    href="https://x.com/PharmTechSucces"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-teal-200 hover:text-teal-700 sm:h-10 sm:w-10"
                    aria-label="Twitter / X"
                  >
                    <Twitter size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM TEXT */}
        <div className="mx-auto mt-8 max-w-2xl text-center sm:mt-14">
          <p className="text-xs leading-6 text-slate-500 sm:text-sm sm:leading-7 lg:text-base">
            PharmTechSuccess is committed to building a smarter and more modern
            CBT preparation experience for Pharmacy Technician students in
            Nigeria.
          </p>
        </div>
      </Container>
    </main>
  );
}