import { Hero } from "@/components/sections/Hero";
import { CoreServices } from "@/components/sections/CoreServices";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { BentoFeatures } from "@/components/sections/BentoFeatures";
import { ProcessMethodology } from "@/components/sections/ProcessMethodology";
import { TestimonialsStats } from "@/components/sections/TestimonialsStats";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <CoreServices />
      <ProjectsShowcase />
      <BentoFeatures />
      <ProcessMethodology />
      <TestimonialsStats />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
