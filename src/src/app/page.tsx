import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Hero } from "@/components/landing/Hero";
import { LogoCloud } from "@/components/landing/LogoCloud";
import { Features } from "@/components/landing/Features";
import { Platforms } from "@/components/landing/Platforms";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Agents } from "@/components/landing/Agents";
import { Showcase } from "@/components/landing/Showcase";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <LandingNavbar />
      <main>
        <Hero />
        <LogoCloud />
        <Features />
        <Platforms />
        <HowItWorks />
        <Agents />
        <Showcase />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
