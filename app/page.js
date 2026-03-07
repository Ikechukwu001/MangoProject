import Hero from "@/components/home/Hero";
import StatsStrip from "@/components/home/StatsStrip";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import PapersPreview from "@/components/home/PapersPreview";
import PremiumTeaser from "@/components/home/PremiumTeaser";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatsStrip />
      <Features />
      <HowItWorks />
      <PapersPreview />
      <PremiumTeaser />
      <CTASection />
    </main>
  );
}