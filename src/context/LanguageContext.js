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
    madeWith: "Fait avec ❤",
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
    madeWith: "Made with ❤",
  },
};

const translations = { fr, en };
const LanguageContext = createContext();

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
