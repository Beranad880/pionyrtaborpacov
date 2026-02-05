import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DatabaseInitializer from '@/components/DatabaseInitializer';
import { Analytics } from "@vercel/analytics/next"


const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pionýrská skupina Pacov",
  description: "Pionýr je demokratický, dobrovolný, samostatný a nezávislý spolek dětí, mládeže a dospělých. Předmětem hlavní činnosti Pionýra je veřejně prospěšná činnost.",
  keywords: "pionýr, pacov, děti, mládež, tábor, oddíl, kroužek",
  authors: [{ name: "Pionýrská skupina Pacov" }],
  creator: "Pionýrská skupina Pacov",
  publisher: "Pionýrská skupina Pacov",
  openGraph: {
    title: "Pionýrská skupina Pacov",
    description: "Pionýr je demokratický, dobrovolný, samostatný a nezávislý spolek dětí, mládeže a dospělých.",
    url: "https://ldt-bela.webnode.cz/",
    siteName: "Pionýrská skupina Pacov",
    locale: "cs_CZ",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <DatabaseInitializer />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
