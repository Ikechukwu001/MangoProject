import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://pharmtechsuccess.study";
const siteName = "PharmTechSuccess";

export const metadata = {
  metadataBase: new URL(siteUrl),

  // ── Title ──────────────────────────────────────────────────────────────
  title: {
    default: "PharmTechSuccess — CBT Practice for the National PreCertification Examination",
    template: "%s | PharmTechSuccess",
  },

  // ── Description ────────────────────────────────────────────────────────
  description:
    "The #1 CBT practice platform for Nigerian Pharmacy Technician students preparing for the National PreCertification Examination. Past questions, timed mock exams, answer explanations, and performance tracking — free to start.",

  // ── Keywords ───────────────────────────────────────────────────────────
  keywords: [
    "Pharmacy Technician exam Nigeria",
    "National PreCertification Examination Pharmacy Technician",
    "CBT practice pharmacy technician",
    "pharmacy technician past questions Nigeria",
    "PCN pharmacy technician exam",
    "pharmacy technician mock exam",
    "pharmacy technician study platform",
    "Nigeria pharmacy technician certification",
    "PharmTechSuccess",
    "pharmacy technician exam preparation",
  ],

  // ── Canonical & Alternates ─────────────────────────────────────────────
  alternates: {
    canonical: siteUrl,
  },

  // ── Authors & Publisher ────────────────────────────────────────────────
  authors: [{ name: siteName, url: siteUrl }],
  publisher: siteName,
  creator: siteName,

  // ── Robots ─────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph (WhatsApp, Facebook, LinkedIn) ──────────────────────────
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName,
    title: "PharmTechSuccess — Pass the National PreCertification Examination",
    description:
      "Practice real CBT past questions, take timed mock exams, and track your performance. Built specifically for Nigerian Pharmacy Technician students.Built my iKECHUKWUFRONTEND",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PharmTechSuccess — CBT Practice for Nigerian Pharmacy Technician Students",
        type: "image/jpeg",
      },
    ],
  },

  // ── Twitter / X Card ──────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "PharmTechSuccess — CBT Practice for the National PreCertification Exam",
    description:
      "Timed past questions, answer explanations, and score tracking for Nigerian Pharmacy Technician students. Free to start.",
    images: ["/og-image.jpg"],
    creator: "@IKECHUKWU00001",
  },

  // ── App / PWA hints ────────────────────────────────────────────────────
  applicationName: siteName,
  category: "education",
};

// ── JSON-LD Structured Data ─────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description:
        "CBT practice platform for the National PreCertification Examination for Pharmacy Technicians in Nigeria.",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/papers?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.jpg`,
      },
      sameAs: [],
      description:
        "PharmTechSuccess provides structured CBT exam practice for Nigerian students preparing for the National PreCertification Examination for Pharmacy Technicians.",
      areaServed: {
        "@type": "Country",
        name: "Nigeria",
      },
    },
    {
      "@type": "Course",
      "@id": `${siteUrl}/#course`,
      name: "National PreCertification Examination for Pharmacy Technicians — CBT Practice",
      description:
        "Structured past question practice, timed mock exams, and detailed answer explanations for the National PreCertification Examination for Pharmacy Technicians in Nigeria.",
      provider: { "@id": `${siteUrl}/#organization` },
      url: siteUrl,
      inLanguage: "en",
      availableLanguage: "English",
      isAccessibleForFree: true,
      educationalLevel: "Professional Certification",
      teaches: "Pharmacy Technician Certification",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT1H45M",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Geo targeting — Nigeria */}
        <meta name="geo.region" content="NG" />
        <meta name="geo.placename" content="Nigeria" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-8RWW6FKLD4" />
    </html>
  );
}