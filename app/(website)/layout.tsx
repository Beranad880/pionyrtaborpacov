import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
