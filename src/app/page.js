"use client";

/*-------------------------------------------------------------------------------------------------------------------------------
* 1. Accéder directement à un élément du DOM
* C'est utile pour des timers, des animations, garder une valeur précédente, ou manipuler un élément HTML directement.
* Le DOM (Document Object Model) est la représentation en mémoire de ta page HTML sous forme d'un arbre d'objets que JavaScript peut lire et modifier.
* 
* useRef retourne un objet avec une seule propriété : { current: <ta valeur> } Tu lis et modifies toujours via .current.
* En résumé : utilise useRef quand tu veux retenir quelque chose sans que React réaffiche le composant, ou quand tu veux toucher directement un élément HTML.
 *-------------------------------------------------------------------------------------------------------------------------------*/
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

import Header from "../components/Header";
import data from "../data/lesDeuxBlondes.json";
import Footer from "../components/Footer";

export default function Home() {
  /*-------------------------------------------------------------------------------------------------------------------------------
  * export  — rend ce code disponible pour d'autres fichiers qui voudront l'importer.
  * default — désigne cet export comme l'export principal du fichier. Il ne peut y en avoir qu'un seul par fichier.
  * Home — le nom de la fonction. Par convention en React, les composants commencent par une majuscule.
  * 
  * En résumé : "Je crée une fonction appelée Home et je l'exporte comme élément principal de ce fichier, pour que d'autres fichiers puissent l'utiliser."
  * 
  *-------------------------------------------------------------------------------------------------------------------------------*/
  const { lang, t } = useLanguage();
  
  /*-------------------------------------------------------------------------------------------------------------------------------
  * const    — on déclare une variable constante (la référence elle-même ne sera jamais réassignée).
  * aboutRef — le nom de la variable. Par convention, les refs se terminent par Ref pour indiquer clairement que c'est une référence.
  * useRef   — le hook React qui crée la référence (voir explication précédente).
  * null     — la valeur initiale de current. On met null car au départ, la ref n'est encore attachée à aucun élément HTML du DOM.
  * 
  * Une fois attachée à un élément HTML :
  * aboutRef = { current: <section id="about"> }  // après le rendu
  *   * 
  * En résumé : "Je crée une référence vide, qui sera plus tard attachée à un élément HTML de la section about."
  *-------------------------------------------------------------------------------------------------------------------------------*/
  const aboutRef = useRef(null);
  
 /*-------------------------------------------------------------------------------------------------------------------------------
  * const handleAboutScroll — on déclare une variable constante. Par convention, les fonctions qui gèrent un événement commencent par handle.
  * () => — c'est une fonction fléchée (arrow function), sans paramètres.
  * aboutRef.current — on accède à l'élément HTML actuellement attaché à la ref (la section about).
  * ? — c'est l'opérateur optionnel (?.). Il vérifie que aboutRef.current n'est pas null avant d'appeler la fonction. Sans lui, si la ref est vide, ça planterait.
  * 
  * scrollIntoView() — méthode native du DOM qui fait défiler la page jusqu'à l'élément.
  * { behavior: "smooth" } — option passée à scrollIntoView pour que le défilement soit fluide au lieu d'être instantané.
  * 
  * { behavior: "smooth" }  // défilement fluide 🟢
  * { behavior: "auto" }    // défilement instantané ⚡
  *
  * En résumé : "Quand cette fonction est appelée, la page défile doucement jusqu'à la section about, mais seulement si elle existe."
  *-------------------------------------------------------------------------------------------------------------------------------*/
  const handleAboutScroll = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });  
  };

  /*-------------------------------------------------------------------------------------------------------------------------------
 
  *-------------------------------------------------------------------------------------------------------------------------------*/
  const handlePresentationVideoScroll = () => {
    presentationRef.current?.scrollIntoView({ behavior: "smooth" }); 

  };
  

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
        <div className="mt-15t lg:mt-[2.275rem] xl:mt-[2.275rem] pt-2 px-2" ref={aboutRef}>
          <h1
            className="text-[1.5rem] mt-4 lg:text-[3rem] xl:text-[3rem] mb-[2.275rem] lg:mt-[2.275rem] lg:mb-[2.275rem] xl:mt-[2.275rem] xl:mb-[2.275rem]"
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


