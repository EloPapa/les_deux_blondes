"use client";

import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";

export default function Home() {
  const { lang, t } = useLanguage();

  const handleAboutScroll = () => {};
  const handlePresentationVideoScroll = () => {};

  return (
    <div className="relative">
      <Header
        handleAboutScroll={handleAboutScroll}
        handlePresentationVideoScroll={handlePresentationVideoScroll}
      />
    </div>
  );
}