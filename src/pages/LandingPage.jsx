import { TopNavBar } from '../components/landing/TopNavBar';
import { HeroSection } from '../components/landing/HeroSection';
import { TrustSection } from '../components/landing/TrustSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { SolutionSection } from '../components/landing/SolutionSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { TemplateGallerySection } from '../components/landing/TemplateGallerySection';
import { LeadCaptureSection } from '../components/landing/LeadCaptureSection';
import { Footer } from '../components/landing/Footer';

/**
 * LandingPage — Full landing page (route: /)
 * Design System: Editorial Precision
 * Goal: Brand awareness + Lead capture (Supabase)
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <TopNavBar />
      <HeroSection />
      <TrustSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <TemplateGallerySection />
      <LeadCaptureSection />
      <Footer />
    </div>
  );
}
