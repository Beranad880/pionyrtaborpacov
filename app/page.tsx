import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import EvidencniListy from '@/components/EvidencniListy';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <EvidencniListy />
      <ContactSection />
    </main>
  );
}
