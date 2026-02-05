import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import CampRegistrationBanner from '@/components/CampRegistrationBanner';
import EvidencniListy from '@/components/EvidencniListy';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CampRegistrationBanner />
      <AboutSection />
      <EvidencniListy />
      <ContactSection />
    </main>
  );
}
