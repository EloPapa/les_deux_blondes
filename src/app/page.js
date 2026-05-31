"use client";

import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const { lang, t } = useLanguage();
  const aboutRef = useRef(null);  // ← ajoute ça

  const handleAboutScroll = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });  // ← et ça
  };
  const handlePresentationVideoScroll = () => {};

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header
        handleAboutScroll={handleAboutScroll}
        handlePresentationVideoScroll={handlePresentationVideoScroll}
      />

      <main className="flex-grow">
        <div className="mt-10 lg:mt-[2.275rem] xl:mt-[2.275rem] pt-2 px-2 xl:px-[0.75rem]" ref={aboutRef}>
          <h1
            className="text-3xl lg:text-[1.904rem] xl:text-[1.904rem] 2xl:text-[3.825rem] mb-10 lg:mb-[2.08rem] xl:mb-[2.083rem] px-2"
            style={{
              fontFamily: "'Amsterdam', cursive",
              textDecoration: "underline",
            }}
          >
            {t.sections.about}
          </h1>
        </div>
      </main>

      <Footer />
    </div>
  );
}