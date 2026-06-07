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
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const useSearch = () => {
  const marksRef = useRef([]);

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

  const highlight = useCallback((query) => {
    clearHighlights();
    if (!query || query.trim().length < 1) return;

    const root = document.querySelector("main");
    if (!root) return;

    const queryLower = query.toLowerCase();

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

    nodesToProcess.forEach((node) => {
      const text = node.textContent;
      const lowerText = text.toLowerCase();
      let lastIndex = 0;
      let idx;

      const fragment = document.createDocumentFragment();

      while ((idx = lowerText.indexOf(queryLower, lastIndex)) !== -1) {
        if (idx > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, idx)));
        }
        const mark = document.createElement("mark");
        mark.textContent = text.slice(idx, idx + query.length);
        mark.style.cssText =
          "background-color: #fdeea0; color: #664b23; border-radius: 2px; padding: 0 1px;";
        fragment.appendChild(mark);
        marksRef.current.push(mark);
        lastIndex = idx + query.length;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      node.parentNode.replaceChild(fragment, node);
    });

    if (marksRef.current.length > 0) {
      marksRef.current[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [clearHighlights]);

  return { highlight, clearHighlights };
};

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* SearchBar — champ de recherche. La recherche se déclenche sur Enter, se ferme sur Escape.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const SearchBar = ({ isOpen, onClose, onSearch, inputRef, textColor }) => {
  const [value, setValue] = useState("");

  // Vide le champ quand la barre se ferme
  useEffect(() => {
    if (!isOpen) setValue("");
  }, [isOpen]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  // Enter → recherche, Escape → ferme
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch(value);
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="flex items-center gap-1"
      style={{ animation: "searchFadeIn 0.18s ease" }}
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
* amsterdamStyle — style réutilisable pour tous les boutons de navigation en font Amsterdam.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const amsterdamStyle = {
  fontFamily: "'Amsterdam', cursive",
  color: "#664b23",
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

  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef(null);
  const { highlight, clearHighlights } = useSearch();

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    clearHighlights();
  };

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
                    <button
                      onClick={openSearch}
                      className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                      aria-label="Ouvrir la recherche"
                    >
                      <SearchIcon size={18} color={textColor} />
                    </button>

                    <Button onClick={toggle}>
                      <span style={amsterdamStyle}>{lang === "fr" ? "EN" : "FR"}</span>
                    </Button>

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
                  <span style={amsterdamStyle}>{t.header.content}</span>
                </Button>
                <Button onClick={handleAboutScroll}>
                  <span style={amsterdamStyle}>{t.header.about}</span>
                </Button>
                <Button onClick={handleContactScroll}>
                  <span style={amsterdamStyle}>{t.header.contact}</span>
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
        <div className="flex items-center gap-3 lg:gap-[0.819rem] xl:gap-[1.17rem] mt-4">
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
            <span
              className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]"
              style={amsterdamStyle}
            >
              {t.header.presentation}
            </span>
          </Button>

          <Button onClick={handleAboutScroll}>
            <span
              className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]"
              style={amsterdamStyle}
            >
              {t.header.about}
            </span>
          </Button>

          <Button onClick={handleContactScroll}>
            <span
              className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]"
              style={amsterdamStyle}
            >
              {t.header.contact}
            </span>
          </Button>

          {/* LOUPE */}
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
            <span
              className="lg:text-[0.819rem] xl:text-[1.17rem] 2xl:text-[1.65rem]"
              style={amsterdamStyle}
            >
              {lang === "fr" ? "EN" : "FR"}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;