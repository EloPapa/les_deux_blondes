"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useLanguage } from "../../context/LanguageContext";

import Button from "../Button";


const Header = ({ handleAboutScroll, handlePortfolioScroll, isBlog }) => {
  const router = useRouter();

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


  const getNameStyle = () => {
    if (!mounted) return nameStyleDesktop;
    if (windowWidth >= 1280) return nameStyleXL;
    if (windowWidth >= 1024) return nameStyleLG;
    return nameStyleDesktop;
  };

  return (
    <>
      {/* 📱 MOBILE */}
      <Popover
        className="block tablet:hidden w-full"
        style={{ background: gradient }}
      >
        {({ open }) => (
          <>
            <div
              className="flex items-center justify-between px-1"
              style={{ height: "60px" }}
            >
              <div className="flex items-center gap-2">
                <h1
                  onClick={() => router.push("/")}
                  className="font-medium cursor-default name"
                  style={nameStyleMobile}
                >
                  {name}.
                </h1>
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src="/images/elo/singe.png"
                    alt="singe"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={toggle}>
                  {lang === "fr" ? "EN" : "FR"}
                </Button>
               
                <PopoverButton className="cursor-default">
                  <MenuIcon open={open} mounted={mounted} currentTheme={currentTheme} />
                </PopoverButton>
              </div>
            </div>

            <PopoverPanel
              className="absolute right-2 z-10 w-30 p-4 rounded-md shadow-md"
              style={{
                background: gradient,
                color: textColor,
                border:
                  currentTheme === "dark"
                    ? "1px solid rgba(180,120,220,0.2)"
                    : "1px solid rgba(220,120,150,0.25)",
              }}
            >
              <div className="flex flex-col items-center">
                <Button onClick={handlePortfolioScroll}>{t.nav.portfolio}</Button>
                <Button onClick={handleAboutScroll}>{t.nav.about}</Button>
                <Button onClick={() => window.open("mailto:ericbergeron2000@gmail.com")}>
                  {t.nav.contact}
                </Button>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>
      
    </>
  );
};

export default Header;