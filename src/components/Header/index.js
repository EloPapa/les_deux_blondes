/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* "use client" c'est une directive Next.js qui dit : ce composant tourne dans le navigateur, pas sur le serveur.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../Button";
import data from "../../data/lesDeuxBlondes.json";

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* MenuIcon — icône hamburger / croix selon l'état open du Popover.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const MenuIcon = ({ open }) => {
  return (
    <img
      className="h-5 cursor-default"
      alt="menu icon"
      src={open ? "/images/cancel-white.svg" : "/images/menu-white.svg"}
    />
  );
};

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* SearchIcon — loupe SVG inline, pas de dépendance externe.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const SearchIcon = ({ size = 18, color = "#664b23" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="17" y1="17" x2="22" y2="22" />
  </svg>
);

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* CloseIcon — petite croix pour fermer le champ de recherche.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const CloseIcon = ({ size = 14, color = "#664b23" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* useSearch — hook personnalisé qui encapsule toute la logique de recherche dans la page.
*
* highlight(query) — parcourt tous les nœuds texte du <main>, entoure les occurrences
*                    trouvées dans des <mark> jaunes, puis scrolle vers le premier résultat.
*
* clearHighlights() — supprime tous les <mark> injectés et remet le texte original.
*
* Pourquoi on manipule le DOM directement ?
*   React ne gère pas les nœuds texte bruts — on a besoin de TreeWalker (API DOM native)
*   pour trouver les occurrences dans n'importe quel composant enfant sans modifier leur code.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const useSearch = () => {
  /*
   * Référence vers tous les <mark> créés, pour pouvoir les supprimer proprement.
   * useRef ici parce qu'on ne veut PAS de re-rendu quand la liste change.
   */
  const marksRef = useRef([]);

  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   * clearHighlights — supprime chaque <mark> en remplaçant le nœud par son contenu texte.
   * node.parentNode.replaceChild(textNode, node) → retire le <mark> et remet le texte brut.
   * normalize() fusionne les nœuds texte adjacents (évite la fragmentation du DOM).
   *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  const clearHighlights = useCallback(() => {
    marksRef.current.forEach((mark) => {
      if (mark.parentNode) {
        const text = document.createTextNode(mark.textContent);
        mark.parentNode.replaceChild(text, mark);
        mark.parentNode.normalize();
      }
    });
    marksRef.current = [];
  }, []);

  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   * highlight — trouve et surligne toutes les occurrences de `query` dans le <main>.
   *
   * TreeWalker : API DOM qui traverse l'arbre des nœuds. On filtre sur NodeFilter.SHOW_TEXT
   * pour ne visiter que les nœuds texte (pas les balises).
   *
   * On évite de chercher dans les <mark> déjà créés (nodeName === "MARK") pour ne pas
   * créer de doublons si on relance la recherche.
   *
   * Pour chaque nœud texte qui contient la query :
   *   1. On découpe le texte autour de l'occurrence (splitText)
   *   2. On crée un <mark> avec le texte trouvé
   *   3. On insère le <mark> à la bonne position dans le DOM
   *   4. On mémorise le <mark> dans marksRef pour pouvoir le retirer plus tard
   *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  const highlight = useCallback((query) => {
    clearHighlights();
    if (!query || query.trim().length < 2) return;

    const root = document.querySelector("main");
    if (!root) return;

    const queryLower = query.toLowerCase();

    /*
     * TreeWalker — visiteur de nœuds DOM.
     * NodeFilter.SHOW_TEXT  → ne retourne que les nœuds texte.
     * Le filtre rejette les nœuds dont l'ancêtre direct est déjà un <mark>
     * et les nœuds vides (whitespace only).
     */
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (node.parentNode?.nodeName === "MARK") return NodeFilter.FILTER_REJECT;
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodesToProcess = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent.toLowerCase().includes(queryLower)) {
        nodesToProcess.push(node);
      }
    }

    /*
     * On traite les nœuds après la traversée pour ne pas perturber le TreeWalker
     * (modifier le DOM pendant la traversée peut sauter des nœuds).
     */
    nodesToProcess.forEach((node) => {
      const text = node.textContent;
      const lowerText = text.toLowerCase();
      let lastIndex = 0;
      let idx;

      /*
       * Fragment temporaire pour construire le remplacement :
       * [texte avant][<mark>occurrence</mark>][texte après][<mark>...]...
       */
      const fragment = document.createDocumentFragment();

      while ((idx = lowerText.indexOf(queryLower, lastIndex)) !== -1) {
        // texte avant l'occurrence
        if (idx > lastIndex) {
          fragment.appendChild(
            document.createTextNode(text.slice(lastIndex, idx))
          );
        }

        // le <mark> avec l'occurrence
        const mark = document.createElement("mark");
        mark.textContent = text.slice(idx, idx + query.length);
        mark.style.cssText =
          "background-color: #fdeea0; color: #664b23; border-radius: 2px; padding: 0 1px;";
        fragment.appendChild(mark);
        marksRef.current.push(mark);

        lastIndex = idx + query.length;
      }

      // texte restant après la dernière occurrence
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      node.parentNode.replaceChild(fragment, node);
    });

    // Scroll vers le premier résultat trouvé
    if (marksRef.current.length > 0) {
      marksRef.current[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [clearHighlights]);

  return { highlight, clearHighlights, count: marksRef.current.length };
};

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* SearchBar — champ de recherche animé, partagé mobile et desktop.
*
* Props :
*   isOpen        — booléen : le champ est-il visible ?
*   onClose       — ferme la barre et efface les surlignages
*   onSearch      — appelé à chaque frappe avec la valeur courante
*   inputRef      — ref passée depuis le parent pour focus automatique
*   textColor     — couleur du texte (cohérence avec le thème)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const SearchBar = ({ isOpen, onClose, onSearch, inputRef, textColor }) => {
  const [value, setValue] = useState("");

  /*
   * Quand isOpen passe à false, on vide le champ.
   * Quand isOpen passe à true, le focus est géré par le parent via inputRef.
   */
  useEffect(() => {
    if (!isOpen) setValue("");
  }, [isOpen]);

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  /*
   * Escape → ferme la barre.
   * Enter  → ne fait rien de plus (la recherche est déjà en temps réel).
   */
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="flex items-center gap-1"
      style={{
        animation: "searchFadeIn 0.18s ease",
      }}
    >
      <style>{`
        @keyframes searchFadeIn {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Rechercher…"
        className="outline-none bg-transparent border-b text-sm"
        style={{
          borderColor: textColor,
          color: textColor,
          width: "140px",
          paddingBottom: "1px",
          fontSize: "0.85rem",
        }}
        aria-label="Rechercher dans la page"
      />
      <button
        onClick={onClose}
        className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Fermer la recherche"
      >
        <CloseIcon color={textColor} />
      </button>
    </div>
  );
};

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* Header — composant principal.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const Header = ({ handleAboutScroll, handleContentScroll, handleContactScroll }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { lang, t, toggle } = useLanguage();
  const { name } = data;

  const textColor = "#664b23";
  const backgroundGradient =
    "linear-gradient(to bottom, transparent 60%, #fffef5 100%), linear-gradient(to right, #fffef5 0%, #fef4c0 30%, #fdeea0 50%, #fef4c0 70%, #fffef5 100%)";

  const nameStyleMobile = {
    color: textColor,
    fontFamily: "'Amsterdam', cursive",
    fontSize: "1.3rem",
    paddingLeft: "0.5rem",
  };

  const nameStyleDesktop = {
    color: textColor,
    fontFamily: "'Amsterdam', cursive",
    fontSize: "1.625rem",
    paddingLeft: "0.0rem",
  };

  const nameStyleLG = {
    color: textColor,
    fontFamily: "'Amsterdam', cursive",
    fontSize: "1.702rem",
    paddingLeft: "0.0rem",
  };

  const nameStyleXL = {
    color: textColor,
    fontFamily: "'Amsterdam', cursive",
    fontSize: "2.431rem",
    paddingLeft: "0.0rem",
  };

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const getNameStyle = () => {
    if (!mounted) return nameStyleDesktop;
    if (windowWidth >= 1280) return nameStyleXL;
    if (windowWidth >= 1024) return nameStyleLG;
    return nameStyleDesktop;
  };

  /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   * État de la barre de recherche — partagé entre mobile et desktop.
   * searchOpen   → true = la barre est visible
   * inputRef     → permet de donner le focus automatiquement à l'input quand on ouvre
   *------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef(null);
  const { highlight, clearHighlights } = useSearch();

  /*
   * Ouvre la barre et met le focus sur l'input au prochain tick
   * (le input n'existe dans le DOM qu'après le re-rendu).
   */
  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  /*
   * Ferme la barre et efface tous les surlignages dans la page.
   */
  const closeSearch = () => {
    setSearchOpen(false);
    clearHighlights();
  };

  /*
   * Appelé à chaque frappe — lance le surlignage en temps réel.
   */
  const handleSearch = (query) => {
    highlight(query);
  };

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📱 MOBILE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Popover
        className="relative block tablet:hidden w-full z-[9999]"
        style={{ background: backgroundGradient }}
      >
        {({ open }) => (
          <>
            <div
              className="flex items-center justify-between px-1"
              style={{ height: "70px" }}
            >
              {/* NOM */}
              <div className="flex items-center gap-2">
                <h1
                  onClick={() => router.push("/")}
                  className="font-medium cursor-default name"
                  style={nameStyleMobile}
                >
                  {name}.
                </h1>
              </div>

              <div
                className="flex items-center gap-2 mr-2"
                style={{ color: textColor }}
              >
                {/* BARRE DE RECHERCHE (mobile) — remplace les boutons quand ouverte */}
                {searchOpen ? (
                  <SearchBar
                    isOpen={searchOpen}
                    onClose={closeSearch}
                    onSearch={handleSearch}
                    inputRef={inputRef}
                    textColor={textColor}
                  />
                ) : (
                  <>
                    {/* LOUPE */}
                    <button
                      onClick={openSearch}
                      className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                      aria-label="Ouvrir la recherche"
                    >
                      <SearchIcon size={18} color={textColor} />
                    </button>

                    {/* BOUTON LANGUE */}
                    <Button onClick={toggle}>
                      {lang === "fr" ? "EN" : "FR"}
                    </Button>

                    {/* HAMBURGER */}
                    <PopoverButton>
                      <MenuIcon open={open} />
                    </PopoverButton>
                  </>
                )}
              </div>
            </div>

            {/* PANNEAU MENU OUVERT */}
            <PopoverPanel
              className="absolute right-2 top-full z-[9999] w-30 p-4 rounded-md shadow-md"
              style={{
                background: backgroundGradient,
                color: textColor,
                border: "1px solid rgba(180, 140, 0, 1)",
              }}
            >
              <div className="flex flex-col items-center">
                <Button onClick={handleContentScroll}>
                  {t.header.content}
                </Button>

                <Button onClick={handleAboutScroll}>
                  {t.header.about}
                </Button>

                <Button onClick={handleContactScroll}>
                  {t.header.contact}
                </Button>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          💻 DESKTOP
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="hidden tablet:flex justify-between items-center sticky top-0 z-10 w-full px-6"
        style={{
          background: backgroundGradient,
          color: textColor,
        }}
      >
        {/* NOM */}
        <div className="flex items-center gap-3 lg:gap-[0.819rem] xl:gap-[1.17rem]">
          <h1
            onClick={() => router.push("/")}
            className="font-medium cursor-default name"
            style={getNameStyle()}
          >
            {name}.
          </h1>
        </div>

        {/* BOUTONS + RECHERCHE */}
        <div className="flex items-center gap-3 lg:gap-[0.98rem] xl:gap-[1.4rem] 2xl:gap-[2.2rem]">

          {/* BARRE DE RECHERCHE (desktop) — apparaît à gauche du bouton langue */}
          {searchOpen && (
            <SearchBar
              isOpen={searchOpen}
              onClose={closeSearch}
              onSearch={handleSearch}
              inputRef={inputRef}
              textColor={textColor}
            />
          )}

          <Button onClick={handleContentScroll}>
            <span className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]">
              {t.header.presentation}
            </span>
          </Button>

          <Button onClick={handleAboutScroll}>
            <span className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]">
              {t.header.about}
            </span>
          </Button>

          <Button onClick={handleContactScroll}>
            <span className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]">
              {t.header.contact}
            </span>
          </Button>

          {/* LOUPE — à gauche du bouton langue */}
          <button
            onClick={searchOpen ? closeSearch : openSearch}
            className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
            aria-label={searchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
          >
            <SearchIcon
              size={windowWidth >= 1280 ? 20 : windowWidth >= 1024 ? 17 : 16}
              color={textColor}
            />
          </button>

          <Button onClick={toggle}>
            <span className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]">
              {lang === "fr" ? "EN" : "FR"}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;