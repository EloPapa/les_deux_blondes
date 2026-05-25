"use client";
import { createContext, useContext, useState } from "react";

const fr = {
  nav: {
    about: "À propos",
    contact: "Contact",
    presentationVideo: "Présentation Vidéo" 
  },

  sections: {
  passions: "Passions.",
  about: "À propos.",
  contact: "Contact.",
  presentationVideo: "Présentation Vidéo" 

  },


};

const en = {
  nav: {
    about: "About",
    contact: "Contact",
    presentationVideo: "Video Presentation" 
  },

  sections: {
  passions: "Passions.",
  about: "À propos.",
  contact: "Contact.",
  presentationVideo: "Video Presentation" 
    
  },

};

const translations = { fr, en };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("fr");
  const langueTraduction = translations[lang];
  const toggle = () => setLang((l) => (l === "fr" ? "en" : "fr"));

  return (
    <LanguageContext.Provider value={{ lang, langueTraduction, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
