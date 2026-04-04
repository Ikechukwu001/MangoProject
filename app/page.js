import Hero from "@/components/home/Hero";
import AuthSection from "@/components/home/AuthSection";
import StatsStrip from "@/components/home/StatsStrip";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AuthSection />
      <StatsStrip />
      <Features />
      <HowItWorks />
    </main>
  );
}