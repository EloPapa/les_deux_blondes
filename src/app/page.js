"use client";

import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

import Header from "../components/Header";
import data from "../data/lesDeuxBlondes.json";
import Footer from "../components/Footer";

export default function Home() {
  const { lang, t } = useLanguage();
  const aboutRef = useRef(null);  

  const handleAboutScroll = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });  
  };
  
  const handlePresentationVideoScroll = () => {};

  const aboutParagraphs =
    lang === "fr" ? data.about_fr || data.about : data.about;

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header
        {/* DÉFILEMENT RAPIDE  */}  
        handleAboutScroll={handleAboutScroll}
        handlePresentationVideoScroll={handlePresentationVideoScroll}
      />

      <main className="flex-grow">
        {/* TITRE ABOUT EN FONT AMSTERDAM */}   
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
         {/* PARAGRAPHE ABOUT */}   
        <div className="text-xl lg:text-[1rem] xl:text-[0.952rem] 2xl:text-[1.9rem] max-w-2xl lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl leading-relaxed xl:leading-loose 2xl:leading-loose">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={index} className="mb-3 lg:mb-[1.05rem] xl:mb-[1.05rem] 2xl:mb-8">
                {paragraph}
              </p>
            ))}
          </div>        
        </div>      
      </main>

      <Footer />
    </div>
  );
}