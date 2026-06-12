import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Les Deux Blondes",            //  title:       "Les Deux Blondes - [ajoutez ici ce que vous faites: vidéos, contenu, etc.]",
  description: "Les Deux Blondes : ",   //  description: "Les Deux Blondes : [description avec mots-clés pertinents, 150-160 caractères]",
  verification: {
    google: "pDOZtr9gZYf_OqtAbp_Vw5yN7hqrGA6RNLiwSMgHvSY"  // ← collez le code ici
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",        // iOS
    shortcut: "/favicon.ico",
    other: {
      rel: "icon",
      url: "/android-chrome-192x192.png",  // Android
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/fonts/AmsterdamOne.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/>       
      
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <div className="min-h-full">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

