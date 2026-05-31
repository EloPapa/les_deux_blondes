"use client";

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* importe trois outils natifs React nécessaires pour construire un système de contexte complet.
* createContext — crée le contexte lui-même. C'est l'objet "conteneur" qui va transporter des données à travers l'arbre de composants sans passer par les props : 
* const LanguageContext = createContext(); // crée le conteneur
*  
* useContext    — hook qui lit la valeur d'un contexte depuis n'importe quel composant enfant
* useContext(LanguageContext); 
*
* useState — hook qui crée une variable d'état réactive. Quand elle change, React re-rend les composants concernés :
* const [lang, setLang] = useState("fr"); // état local réactif
*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/ import { createContext, useContext, useState } from "react";

const fr = {
  header: {
    presentation: "Présentation",
    about: "À propos",
    contact: "Contact",    
  },

  sections: {
    passions: "Passions.",
    about: "À propos.",
    contact: "Contact.",  

  },

  footer: {
    scheduleSession: "Planifier une session",
    madeWith: "Fait avec",
  },

};

const en = {
  header: {
    presentation: "Presentation",
    about: "About",
    contact: "Contact",    
  },
  
  sections: {
    passions: "Passions.",
    about: "About.",
    contact: "Contact.",    
  },

  footer: {
    scheduleSession: "Schedule a session",
    madeWith: "Made with",
  },
};

const translations = { fr, en }; // Structure de donné 

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
createContext() : crée un conteneur de données partagées que n'importe quel composant dans ton app peut lire, sans avoir à passer des props de parent en enfant.

Exemple
page.js
  └── Header.js        ← veut connaître la langue
  └── Section.js
        └── Card.js    ← veut aussi connaître la langue

Sans context, tu devrais passer lang comme prop à chaque niveau. Avec context, tous les composants y accèdent directement.
C'est juste la création — le conteneur est vide pour l'instant. Ensuite tu le remplis avec un Provider
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const LanguageContext = createContext();
/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const [lang, setLang] = useState("fr");
function App() {
  const [lang, setLang] = useState("fr");

  return (
    <>
      <p>Langue : {lang}</p>

      <button onClick={() => setLang("en")}>
        Anglais
      </button>
    </>
  );
}

 const t = translations[lang];
 équivalent à translations.fr ou translations.en

 const toggle = () => {
  if (lang === "fr") {
    setLang("en");
  } else {
    setLang("fr");
  }
};
toggle() bascule la valeur de lang entre "fr" et "en".

 Le Provider sert à partager des données avec tous les composants qui se trouvent à l'intérieur.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("fr");
  const t = translations[lang];
  const toggle = () => setLang((l) => (l === "fr" ? "en" : "fr"));

  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}
 /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Cette ligne définit et exporte le hook useLanguage en une seule ligne.
 * export                      — rend la fonction disponible pour les autres fichiers. C'est ce qui permet le import { useLanguage }, par exemple dans le component header.
 * const useLanguage           — déclare le hook comme une constante. Le préfixe use respecte la convention React obligatoire pour les hooks.
 * = () =>                     — c'est une arrow function sans paramètres. Le hook ne prend rien en entrée, il va juste lire un contexte.
 * useContext(LanguageContext) — le cœur de la ligne. useContext est un hook natif React qui lit la valeur actuelle d'un contexte :
 * 
 * Ce hook fait exactement ça sous le capot :
 * function useLanguage() {
 * return useContext(LanguageContext);
 * }
 *-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------* 
 */ export const useLanguage = () => useContext(LanguageContext);
