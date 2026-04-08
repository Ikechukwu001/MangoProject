import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "PharmTechSuccess",
  description:
    "CBT Practice platform for Pharmacy Technician students preparing for council exams.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
      <GoogleAnalytics gaId="G-8RWW6FKLD4" />
    </html>
  );
}