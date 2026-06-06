"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";
const Content = dynamic(() => import("../components/Content/index"), { ssr: false });
import data from "../data/lesDeuxBlondes.json";
import Footer from "../components/Footer";

export default function Home() {
  const { lang, t } = useLanguage();
  const aboutRef = useRef(null);
  const contentRef = useRef(null);
  const contactRef = useRef(null);

  const handleAboutScroll = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });  
  };

  const handleContentScroll = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });  
  };

  const handleContactScroll = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" }); 
  };
  
  const aboutParagraphs = lang === "fr" ? data.about_fr || data.about : data.about;

  return (
    <div className="relative flex flex-col min-h-screen">     

      <Header
        handleAboutScroll={handleAboutScroll}
        handleContentScroll={handleContentScroll}
        handleContactScroll={handleContactScroll}
      />

      <main className="flex-grow">

        {/* CONTENT */}
        <div className="mt-30 lg:mt-[14rem] xl:mt-[14rem] 2xl:mt-[16rem] p-2" ref={contentRef}>
          <h1 className="sr-only">{t.header.content}</h1>
          <Content lang={lang} />
        </div>

        {/* TITRE ABOUT EN FONT AMSTERDAM */}   
        <div className="mt-15t lg:mt-[2.275rem] xl:mt-[2.275rem] pt-2 px-2 flex flex-col items-center" ref={aboutRef}>
          
          {/* BLOC TITRE + PARAGRAPHES alignés ensemble */}
          <div className="max-w-2xl lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl w-full">

            {/* TITRE + AVATAR côte à côte */}
            <div className="flex items-center gap-4 mt-4 lg:mt-[2.275rem] mb-[2.275rem]">

              <h1
                className="text-[1.5rem] lg:text-[3rem] xl:text-[3rem]"
                style={{
                  fontFamily: "'Amsterdam', cursive",
                  textDecoration: "underline",
                  color: "#664b23",
                }}
              >
                {t.sections.about}
              </h1>

              {/* AVATAR — juste à droite du titre */}
              <div
                className="
                  flex-shrink-0 ml-28 -mt-8
                  w-[117px] h-[117px]
                  sm:w-[156px] sm:h-[156px]
                  md:w-[175px] md:h-[175px]
                  lg:w-[156px] lg:h-[156px]
                  xl:w-[175px] xl:h-[175px]
                  2xl:w-[215px] 2xl:h-[215px]
                  rounded-full overflow-hidden"
              >
                <img
                  src="/images/contenu/avatar.png"
                  alt="avatar"
                  className="w-full h-full object-cover object-center"
                  style={{ objectPosition: "center 15%" }}
                />
              </div>

            </div>

            {/* PARAGRAPHE ABOUT À PARTIR DU FICHIER JSON */}
            <div className="text-xl lg:text-[1rem] xl:text-[0.952rem] 2xl:text-[1.9rem] leading-relaxed xl:leading-loose 2xl:leading-loose" style={{ color: "#7a5a2a" }}>
              {aboutParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-3 lg:mb-[1.05rem] xl:mb-[1.05rem] 2xl:mb-8">
                  {paragraph}
                </p>
              ))}
            </div>

          </div>
        </div>      
      </main>

      <div ref={contactRef}>
        <Footer />
      </div>
    </div>
  );
}

/*-------------------------- {aboutParagraphs.map((paragraph, index) => ( --------------------------
* aboutParagraphs : Un tableau de chaînes de caractères qui vient du JSON. Quelque chose comme : ["Je suis Eric.", "Je fais des vidéos.", "Voici mon travail."]
*
* .map(): Une méthode native JavaScript des tableaux. Elle parcourt chaque élément du tableau et le transforme en quelque chose d'autre — ici, en JSX (<p>).
*        La règle : pour chaque élément qui entre, un élément transformé sort. Le tableau original n'est jamais modifié.
*        Ex: [1, 2, 3].map(n => n * 2)  // → [2, 4, 6] 
*
* (paragraph, index): Les deux paramètres que .map() passe automatiquement à chaque itération 
* paragraph — la valeur de l'élément courant. Ex: "Je suis Eric." index — sa position dans le tableau. Ex: 0, 1, 2...
*
* Le nom paragraph c'est toi qui le choisis — tu aurais pu écrire item, texte, p. index est aussi une convention, souvent abrégé i.
*
* => La flèche de la fonction callback — la fonction qu'on passe à .map() et qu'elle appelle pour chaque élément.
* 
* ( La parenthèse ouvrante après => signale qu'on retourne du JSX sur plusieurs lignes. Sans elle, il faudrait écrire return explicitement :
*
* // avec parenthèse — return implicite
* .map((paragraph, index) => (
*  <p>...</p>
* ))
*
* // sans parenthèse — return explicite obligatoire
* .map((paragraph, index) => {
*   return <p>...</p>
* })
*
* aboutParagraphs = ["Phrase 1.", "Phrase 2.", "Phrase 3."]
*        ↓
* .map() passe sur chaque élément
*        ↓
* paragraph = "Phrase 1.", index = 0  →  <p key={0}>Phrase 1.</p>
* paragraph = "Phrase 2.", index = 1  →  <p key={1}>Phrase 2.</p>
* paragraph = "Phrase 3.", index = 2  →  <p key={2}>Phrase 3.</p>
*        ↓
* React affiche les 3 <p> dans la page
*
*----------------------------------------------------------------------------------------------------*/


