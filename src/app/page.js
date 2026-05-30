"use client";

import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const { lang, t } = useLanguage();

  const handleAboutScroll = () => {};
  const handlePresentationVideoScroll = () => {};

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header
        handleAboutScroll={handleAboutScroll}
        handlePresentationVideoScroll={handlePresentationVideoScroll}
      />

      <main className="flex-grow">
        {/* ton contenu viendra ici */}
      </main>

      <Footer />
    </div>
  );
}