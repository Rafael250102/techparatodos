import HeroSection from "@/components/home/HeroSection";
import ImpactStats from "@/components/home/ImpactStats";
import ServicesSection from "@/components/home/ServicesSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ImpactStats />
      <ServicesSection />
      <CTASection />
    </div>
  );
}