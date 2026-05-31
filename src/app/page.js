"use client";

/*-------------------------------------------------------------------------------------------------------------------------------
*
 *-------------------------------------------------------------------------------------------------------------------------------*/
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

import Header from "../components/Header";
import data from "../data/lesDeuxBlondes.json";
import Footer from "../components/Footer";

export default function Home() {
  /*-------------------------------------------------------------------------------------------------------------------------------
  *
  *-------------------------------------------------------------------------------------------------------------------------------*/
  const { lang, t } = useLanguage();
  
  /*-------------------------------------------------------------------------------------------------------------------------------
  *
  *-------------------------------------------------------------------------------------------------------------------------------*/
  const aboutRef = useRef(null);
  
 /*-------------------------------------------------------------------------------------------------------------------------------
  *
  *-------------------------------------------------------------------------------------------------------------------------------*/
  const handleAboutScroll = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });  
  };

  /*-------------------------------------------------------------------------------------------------------------------------------
  *
  *-------------------------------------------------------------------------------------------------------------------------------*/
  const handlePresentationVideoScroll = () => {};
  

  const aboutParagraphs = lang === "fr" ? data.about_fr || data.about : data.about;

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header
        /* DÉFILEMENT RAPIDE  */  
        handleAboutScroll={handleAboutScroll}
        handlePresentationVideoScroll={handlePresentationVideoScroll}
      />

      <main className="flex-grow">
        {/* TITRE ABOUT EN FONT AMSTERDAM */}   
        <div className="mt-15t lg:mt-[2.275rem] xl:mt-[2.275rem] pt-2 px-2 xxl:mt-[2.275rem] px-[0.75rem]" ref={aboutRef}>
          <h1
            className="text-3xl lg:text-[1.904rem] xl:text-[1.904rem] 2xl:text-[3.825rem] mb-10 lg:mb-[2.08rem] xl:mb-[2.083rem] px-2"
            style={{
              fontFamily: "'Amsterdam', cursive",
              textDecoration: "underline",
            }}
          >
            {t.sections.about}
          </h1>
         {/* PARAGRAPHE ABOUT À PARTIR DU FICHIER JSON */}   
        <div className="text-xl lg:text-[1rem] xl:text-[0.952rem] 2xl:text-[1.9rem] max-w-2xl lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl leading-relaxed xl:leading-loose 2xl:leading-loose">
            {/* PARAGRAPHE ABOUT À PARTIR DU FICHIER JSON */}   
            
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


