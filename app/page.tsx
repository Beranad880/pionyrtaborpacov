import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import CampRegistrationBanner from '@/components/CampRegistrationBanner';
import EvidencniListy from '@/components/EvidencniListy';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="py-12 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <CampRegistrationBanner />
          </div>
        </div>
      </section>
      <AboutSection />
      <EvidencniListy />
      <ContactSection />
    </main>
  );
}
