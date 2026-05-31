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
  title: "L2Blondes",
  description: "Les 2 Blondes", 
  
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href="/fonts/AmsterdamOne.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"        />
      
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
