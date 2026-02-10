import { Hero, ServicesSection, TestimonialsSection, CTASection } from '@/components/sections';
import { PublicShell } from '@/components/layout';

export default function HomePage() {
  return (
    <PublicShell>
      <Hero />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </PublicShell>
  );
}
