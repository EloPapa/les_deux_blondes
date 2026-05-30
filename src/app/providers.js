"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "../context/LanguageContext";

export default function AppProviders({ children }) {  // ← renommé
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange
    >
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}