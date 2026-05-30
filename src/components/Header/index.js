/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* "use client" c'est une directive Next.js qui dit : ce composant tourne dans le navigateur, pas sur le serveur.
* 
* Next.js a deux environnements :
*
* SERVEUR                          NAVIGATEUR (client)
* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
* génère le HTML                   affiche le HTML
* pas d'interactivité              interactivité possible
* pas accès à window/document      accès à window/document
* hooks React interdits            hooks React autorisés
*
* Par défaut dans Next.js, tous les composants sont "serveur". Si tu utilises des hooks ou des événements sans "use client", tu obtiens des erreurs.
* En résumé — "use client" c'est la permission d'utiliser tout ce qui est interactif et dynamique.
*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
"use client";
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* C'est l'import de base de React avec deux de ses hooks (fonctionnalités) les plus fondamentaux.
* React — la librairie elle-même. Sans elle, ton fichier ne sait pas ce qu'est un composant, ni comment interpréter le JSX.
*
* useState  — permet à un composant de mémoriser une valeur qui peut changer. Quand la valeur change, React re-rend le composant automatiquement.
* useEffect — permet d'exécuter du code après le rendu. Utile pour tout ce qui ne peut pas tourner pendant le rendu (appels API, événements, timers...).
*
* En résumé — React c'est le moteur, useState c'est la mémoire, useEffect c'est le moment où tu agis.
*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
import React, { useEffect, useState } from "react";
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* useRouter c'est un hook (fonctionnalité spécialisée) de Next.js qui te donne un objet router pour naviguer entre les pages par du code, sans que l'utilisateur clique sur un lien <a>.
*
* Les méthodes les plus utiles
* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
* router.push("/about")      // navigue vers /about
* router.push("/")            // retourne à l'accueil
* router.back()               // page précédente (comme le bouton ← du navigateur)
* router.refresh()            // recharge la page courante
* router.replace("/login")    // navigue SANS ajouter à l'historique (l'user ne peut pas revenir en arrière)
*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
import { useRouter } from "next/navigation";
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* headlessui c'est une librairie de composants UI qui gèrent la logique et l'accessibilité, mais sans aucun style visuel.
*
* Librairie normale (ex: MUI, Bootstrap)    Headlessui
* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ━━━━━━━━━━━━━━━━━━━━━
*✅ logique (ouvert/fermé)                 ✅ logique (ouvert/fermé)
*✅ accessibilité (ARIA, clavier)          ✅ accessibilité (ARIA, clavier)
*✅ styles imposés (couleurs, bordures)    ❌ zéro style — tu fais le tien
* headlessui:
* ━━━━━━━━━━
* gère automatiquement le open/close sans que tu écrives un useState
* ferme le panneau si tu cliques en dehors
* gère les touches clavier (Escape pour fermer, Tab pour naviguer)
* ajoute les bons attributs ARIA pour l'accessibilité
*
* Popover — le conteneur parent. C'est lui qui gère l'état ouvert/fermé. Il ne rend rien de visible
* PopoverButton — le déclencheur visible. C'est le bouton cliquable qui dit au Popover "ouvre-toi" ou "ferme-toi". Sans lui, rien ne peut s'ouvrir.
* PopoverPanel — le contenu qui apparaît/disparaît. Il est automatiquement caché ou affiché selon l'état du Popover parent. C'est là que tu mets tes liens, boutons, etc.
*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"; 
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

import { useLanguage } from "../../context/LanguageContext"; // importe le hook useLanguage depuis un fichier spécifique du projet.  — importation nommée (named import). Les accolades indiquent que ce n'est pas l'export par défaut du fichier, mais un export qui porte explicitement ce nom

import Button from "../Button";
import data from "../../data/lesDeuxBlondes.json";

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* const MenuIcon = ({ open, mounted, currentTheme }) => { 
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const MenuIcon = () => {
  return (
    <img
      className="h-5 cursor-default"
      alt="menu icon"
      src="/images/menu-white.svg"
    />
  );
};

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* Déclaration du composant React HEADER avec déstructuration des props (propirétés).
*
* ({ handleAboutScroll, handlePresentationVideoScroll }) — les props que le composant reçoit de son parent, déstructurées directement.
*
* Sans déstructuration, ce serait :
*
* const Header = (props) => {
*  const handleAboutScroll = props.handleAboutScroll;
*  const handlePresentationVideoScroll = props.handlePresentationVideoScroll;
*
* => — syntaxe arrow function. Dit à JS "ce qui suit est le corps de la fonction".
*
* En résumé — ({ handleAboutScroll, handlePresentationVideoScroll }) c'est la porte d'entrée du composant : ce sont les instructions que le parent (page.JS) lui passe pour qu'il sache quoi
* faire quand on clique sur ses boutons. 
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const Header = ({ handleAboutScroll, handlePresentationVideoScroll}) => {
  
  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  * useRouter() est un hook (fonction spécialisée) de Next.js qui donne accès au routeur de navigation
  * En l'appelant, tu récupères un objet router qui permet de naviguer entre les pages sans recharger la page — comme un lien, mais contrôlé par du code.
  * Exemple:
  *  
  * <h1 onClick={() => router.push("/")}>
  *   {name}.
  * </h1>
  * 
  * Quand on clique sur le nom, ça redirige vers la page d'accueil sans rechargement.
  *
  * Les méthodes les plus courantes de router :
  * router.push("/about") ----------- Navigue vers about
  * router.back()-------------------- Retourne à la page précédente
  * router.refresh()----------------- Recharge la page courante
  * router.replace("/")-------------- Navigue sans ajouter à l'historique
  *-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  */ const router = useRouter();
  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
    
 /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * const [mounted, setMounted] = useState(false)
 * Pattern classique pour gérer l'hydratation SSR en Next.js. Un simple state booléen, initialisé à false, avec son setter.
 * Souvent utilisé pour savoir : "est-ce que le composant est déjà rendu côté client ?"
 * En Next.js, le composant est d'abord rendu côté serveur (HTML statique), puis "hydraté" côté client. Pendant ce délai, des hooks comme useTheme() ne sont pas encore disponibles
 * — resolvedTheme vaut undefined.
 * Si tu affiches quand même une icône ou une couleur basée sur le thème, tu obtiens un mismatch hydratation : le serveur rend X, le client rend Y → erreur React + flash visuel.
 * 
 * const [mounted, setMounted] = useState(false);
 * mounted → valeur actuelle setMounted ; → fonction pour changer la valeur ; false → valeur initiale
 * 
 * Ex
 * 
 * useEffect(() => {
 *    setMounted(true);
 * }, []); // se déclenche uniquement côté client, après le montage
 * 
 * if (!mounted) return null; // ou un skeleton
 * 
 * useEffect ne tourne jamais sur le serveur, donc mounted passe à true uniquement côté client, signalant que l'environnement est prêt.
 * 
 * 
 * mounted est un garde-fou qui empêche de rendre du contenu dépendant du client avant que le client soit prêt.
 *------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */ const [mounted, setMounted] = useState(false);
 /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  * Ce useEffect règle un problème précis : savoir si le composant est réellement affiché dans le navigateur.
  * () => { setMounted(true) } — la fonction exécutée après le rendu.
  * [] — tableau de dépendances vide : l'effet ne tourne qu'une seule fois, au premier rendu. Jamais après.
  * 
  * 1. React rend le composant    →  mounted = false
  * 2. L'HTML apparaît dans le DOM
  * 3. useEffect se déclenche     →  setMounted(true)
  * 4. React re-rend              →  mounted = true 
  *------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
  useEffect(() => {
    setMounted(true);
  }, []);
  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

 /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * const { lang, t, toggle } = useLanguage()
 * hook personnalisé React (fonction spécialisée). Il encapsule toute la logique liée à la langue de l'application et retourne un objet avec plusieurs propriétés.
 * 
 * lang — la langue active en ce moment (ex: "fr", "en"). C'est probablement une chaîne de caractères ou une valeur d'état (useState).
 * t    — probablement une fonction de traduction (convention très courante). On l'appelle avec une clé et elle retourne le texte dans la bonne langue : t("welcome") // → "Bienvenue" ou "Welcome" selon lang
 * toggle — une fonction pour basculer entre les langues (ex: FR ↔ EN). On l'appelle sans argument ou avec une langue cible : toggle() // passe de "fr" à "en" et vice-versa
 * 
 * Sans déstructuration, ce serait :
 * const language = useLanguage();
 * const lang   = language.lang;
 * const t      = language.t;
 * const toggle = language.toggle;
 * 
 * Avec déstructuration, en une ligne :
 * const { lang, t, toggle } = useLanguage();
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */  const { lang, t, toggle } = useLanguage();
  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
     
  const { name } = data;  
  const textColor = "#2a1020";
  const backgroundGradient = "linear-gradient(to bottom, transparent 60%, #fef2f5 100%), linear-gradient(to right, #fef2f5 0%, #f9d0de 30%, #f5b8cc 50%, #f9d0de 70%, #fef2f5 100%)";

  const nameStyleMobile = {
    color: textColor,
    fontFamily: "'Amsterdam', cursive",
    fontSize: "1rem",
    paddingLeft: "0.5rem",
  };

  const nameStyleDesktop = {
    color: textColor,
    fontFamily: "'Amsterdam', cursive",
    fontSize: "1.25rem",
    paddingLeft: "0.0rem",
  };

  // lg = 15"–22" : xl(1.87rem) * 0.70 = 1.309rem
  const nameStyleLG = {
    color: textColor,
    fontFamily: "'Amsterdam', cursive",
    fontSize: "1.309rem",
    paddingLeft: "0.0rem",
  };

  // xl = 22"+ : inchangé
  const nameStyleXL = {
    color: textColor,
    fontFamily: "'Amsterdam', cursive",
    fontSize: "1.87rem",
    paddingLeft: "0.0rem",
  };

  /*-------------------------------------------------------------------------------------------------------------------------------
  * Mémoriser la largeur de la fenêtre du navigateur en temps réel, pour pouvoir adapter l'affichage selon la taille de l'écran.
  *
  * useState c'est le hook React qui permet à un composant de mémoriser une valeur qui peut changer.
  * const [valeur, setValeur] = useState(valeurInitiale);
  * valeur         → ce qu'on lit
  * setValeur      → la fonction pour changer la valeur
  * valeurInitiale → la valeur au départ
  * 
  * On peut stocker n'importe quel type de valeur :
  * const [count, setCount]       = useState(0);           // nombre
  * const [nom, setNom]           = useState("Eric");      // string
  * const [actif, setActif]       = useState(false);       // booléen
  * const [liste, setListe]       = useState([]);          // tableau
  * const [user, setUser]         = useState({});          // objet
  * const [mounted, setMounted]   = useState(false);       // booléen — ton code
  * 
  * const [windowWidth, setWindowWidth] = useState(0);     // nombre — le nom de la fonction code qui set
  * 
  * 
  *-------------------------------------------------------------------------------------------------------------------------------*/
  const [windowWidth, setWindowWidth] = useState(0); 
   /*------------------------------------------------------------------------------------------------------------------------------
   * Définit une fonction qui mesure la largeur de la fenêtre et la mémorise.
   * useEffect : hook React qui permet d'exécuter du code après que le composant s'est affiché dans le navigateur.
   * useEffect(() => {  ← s'exécute après le rendu
   * }, []);            ← une seule fois au montage
   * 
   * useEffect                    → 📌 React
   * setWindowWidth               → 📌 React (useState)
   * window.innerWidth            → 📌 JavaScript natif
   * window.addEventListener      → 📌 JavaScript natif
   * window.removeEventListener   → 📌 JavaScript natif
   * update                       → 📌 User 
   * 
   *------------------------------------------------------------------------------------------------------------------------------*/
  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update); //chaque fois que la fenêtre est redimensionnée, appelle update". "resize" → l'événement surveillé ; update → la fonction à appeler quand ça arrive
    return () => window.removeEventListener("resize", update); // Le nettoyage — quand le composant disparaît, on arrête de surveiller le redimensionnement pour éviter les fuites mémoire.
  }, []);
/*-------------------------------------------------------------------------------------------------------------------------------*/

const getNameStyle = () => {
    if (!mounted) return nameStyleDesktop;
    if (windowWidth >= 1280) return nameStyleXL;
    if (windowWidth >= 1024) return nameStyleLG;
    return nameStyleDesktop;
  };

  return (
    <>
    {/* 📱 MOBILE */}      
      <Popover className="block tablet:hidden w-full" style={{ background: backgroundGradient }}>              
          <>
            <div className="flex items-center justify-between px-1" style={{ height: "70px" }}>
              
              {/* TEXTE: LES DEUX BLONDES DANS LE HEADER */} 
              <div className="flex items-center gap-2">
                <h1 onClick={() => router.push("/")} className="font-medium cursor-default name" style={nameStyleMobile}>
                  {name}.           
                </h1>
              </div>
            
            <div className="flex items-center gap-2">
              {/* BOUTON CHOIX LANGUE*/}  
              <Button onClick={toggle}>
                  {lang === "fr" ? "EN" : "FR"}
              </Button> 

              {/* BOUTON HAMBURGER POPOVER BUTTON*/}  
              <PopoverButton>
                <MenuIcon/>
              </PopoverButton>
            </div>    
          
          </div>

            {/* 📱 PANNEAU MENU "OUVERT" */}
            <PopoverPanel
              className="absolute right-2 z-10 w-30 p-4 rounded-md shadow-md"
              style={{
                background: backgroundGradient,
                color: textColor,
                border: "1px solid rgba(180,120,220,1)",                 
              }}
            >
              <div className="flex flex-col items-center">
                {/* PANNEAU MENU "OUVERT" - "Bouton" PRÉSENTATION VIDÉO qui dirige à la section PRÉSENTATION VIDÉO */}
                <Button onClick={handlePresentationVideoScroll}>
                  {t.header.presentation}    
                </Button>
                {/* PANNEAU MENU "OUVERT" - "Bouton" À PROPOS qui dirige à la section À PROPOS */}
                <Button onClick={handleAboutScroll}>
                  {t.header.about}  
                </Button>
                {/* PANNEAU MENU "OUVERT" - "Bouton" Contact qui ouvre un message courriel */}
                <Button onClick={() => window.open("mailto:ericbergeron2000@gmail.com")}>
                  {t.header.contact}
                </Button>
              </div>
            </PopoverPanel>
          </>        
      </Popover>
    
    {/* 💻 DESKTOP*/}
    <div className="hidden tablet:flex justify-between items-center sticky top-0 z-10 w-full px-6" style={{background: backgroundGradient,color: textColor,}}>
    
        {/* A GAUCHE: TEXTE LES DEUX BLONDES DANS LE HEADER
            lg : xl(1.17rem) * 0.70 = 0.819rem | xl(75px) * 0.70 = 53px
            xl : inchangé gap-[1.17rem], singe 75px
            2xl: inchangé singe 106px
        */}
        <div className="flex items-center gap-3 lg:gap-[0.819rem] xl:gap-[1.17rem]">
          <h1
            onClick={() => router.push("/")}
            className="font-medium cursor-default name"
            style={getNameStyle()}
          >
            {name}.
          </h1>          
        </div>
        
        {/* A DROITE: LES BOUTONS LANGUE ET MENU HAMBURGER
            lg : xl(1.17rem) * 0.70 = 0.819rem | xl(1.4rem) * 0.70 = 0.98rem
            xl : inchangé text-[1.17rem], gap-[1.4rem]
            2xl: inchangé
        */}
        <div className="flex items-center gap-3 lg:gap-[0.98rem] xl:gap-[1.4rem] 2xl:gap-[2.2rem]">

          <Button onClick={handlePresentationVideoScroll}>
            <span className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]">{t.header.presentation}</span>
          </Button>

          <Button onClick={handleAboutScroll}>
            <span className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]">{t.header.about}</span>
          </Button>

          <Button onClick={() => window.open("mailto:ericbergeron2000@gmail.com")}>
            <span className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]">{t.header.contact}</span>
          </Button>

          <Button onClick={toggle}>
            <span className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]">{lang === "fr" ? "EN" : "FR"}</span>
          </Button>        

        </div>

    </div>          


    </>
  );
};

 /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Cette ligne rend le composant disponible pour être importé ailleurs.
 *
 * export  — rend quelque chose disponible en dehors de ce fichier.
 * default — désigne cet export comme l'export principal du fichier. Un fichier ne peut avoir qu'un seul export default.
 * Header  — ce qu'on exporte, le composant qu'on a défini plus haut dans le fichier.
 * 
 * Sans cette ligne, personne ne peut utiliser le composant
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
export default Header;