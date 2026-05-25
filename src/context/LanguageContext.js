"use client";
import { createContext, useContext, useState } from "react";

const fr = {

};

const en = {

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

export const useLanguage = () => useContext(LanguageContext);
