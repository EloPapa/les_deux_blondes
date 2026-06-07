"use client";

import React, { useState } from "react";
import { Nunito_Sans } from "next/font/google";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-nunito",
  axes: ["wdth"],
});

const YOUTUBE_URL = "https://www.youtube.com/@HappyEloiseB";

const TRANSLATIONS = {
  fr: {
    title: "MÉDIA",
    topQuote: "QUI GARDE SON ÂME D'ENFANT",
    bottomQuote: "NE VEILLIT JAMAIS",
    author: "",
    alt: {
      imageContent1: "imageContenu1",
      imageContent2: "imageContenu2",
      imageContent3: "imageContenu3",
      imageContent4: "imageContenu4",
      heroVideo: "Vidéo Les Deux Blondes",
    },
    ariaLink: "Voir la chaîne YouTube Les Deux Blondes",
  },
  en: {
    title: "MEDIA",
    topQuote: "HE WHO KEEPS HIS CHILDLIKE SPIRIT",
    bottomQuote: "NEVER GROWS OLD",
    author: "",
    alt: {
      imageContent1: "imageContent1",
      imageContent2: "imageContent2",
      imageContent3: "imageContent3",
      imageContent4: "imageContent4",
      heroVideo: "Les Deux Blondes video",
    },
    ariaLink: "Watch 2 Chicks YouTube channel",
  },
};

/* ─────────────────────────────────────────────
   ICÔNE YOUTUBE
───────────────────────────────────────────── */
function YouTubeIcon({ size = 36 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        fill="#FF0000"
        d="M23.498 6.186a2.997 2.997 0 0 0-2.112-2.12C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.386.566A2.997 2.997 0 0 0 .502 6.186C0 8.06 0 12 0 12s0 3.94.502 5.814a2.997 2.997 0 0 0 2.112 2.12C4.48 20.5 12 20.5 12 20.5s7.52 0 9.386-.566a2.997 2.997 0 0 0 2.112-2.12C24 15.94 24 12 24 12s0-3.94-.502-5.814z"
      />
      <path fill="#FFFFFF" d="M9.75 15.568V8.432L15.818 12 9.75 15.568z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   HERO VIDEO — responsive toutes tailles
   Mobile  < 480px  → ratio 9/16 (portrait)
   Tablette 480–768 → ratio 4/3
   Desktop  > 768px → ratio 16/9
───────────────────────────────────────────── */
function HeroVideo({ alt }) {
  return (
    <>
      <style>{`
        .hero-video-wrapper {
          width: 100%;
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          background: #1a1a1a;
          aspect-ratio: 16 / 9;
          line-height: 0;
        }

        @media (max-width: 767px) {
          .hero-video-wrapper {
            aspect-ratio: 4 / 3;
          }
        }

        @media (max-width: 479px) {
          .hero-video-wrapper {
            aspect-ratio: 9 / 16;
            max-height: 70vh;
          }
        }

        .hero-video-wrapper video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>

      <div className="hero-video-wrapper">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={alt}
        >
          <source src="/images/contenu/lesDeuxBlondesVideo.mp4" type="video/mp4" />
        </video>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   HOVER HELPERS
───────────────────────────────────────────── */
const hoverEnter = (e, selector) => {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.25)";
  const el = e.currentTarget.querySelector(selector);
  if (el) {
    el.style.transform = "scale(1.06)";
    el.style.filter = "brightness(0.85)";
  }
};

const hoverLeave = (e, selector) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "none";
  const el = e.currentTarget.querySelector(selector);
  if (el) {
    el.style.transform = "scale(1)";
    el.style.filter = "brightness(1)";
  }
};

/* ─────────────────────────────────────────────
   STYLES PARTAGÉS
───────────────────────────────────────────── */
const cardBaseStyle = {
  position: "relative",
  display: "block",
  overflow: "hidden",
  borderRadius: "4px",
  cursor: "pointer",
  textDecoration: "none",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  outline: "none",
};

const mediaStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transition: "transform 0.3s ease, filter 0.3s ease",
};

/* ─────────────────────────────────────────────
   CONTENT CARD
───────────────────────────────────────────── */
function ContentCard({
  src,
  alt,
  ariaLabel,
  href,
  external = true,
  cardStyle = {},
  showYoutubeBadge = false,
  badgeSize = 36,
  onClick,
  imgStyle = {},
}) {
  const handleClick = onClick
    ? (e) => { e.preventDefault(); onClick(); }
    : undefined;

  return (
    <a
      href={href}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      style={{ ...cardBaseStyle, ...cardStyle }}
      onClick={handleClick}
      onMouseEnter={(e) => hoverEnter(e, "img")}
      onMouseLeave={(e) => hoverLeave(e, "img")}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ ...mediaStyle, ...imgStyle }}
        />
      </div>

      {/* Bouton play si la carte ouvre une vidéo */}
      {onClick && (
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}

      {/* Badge YouTube optionnel */}
      {showYoutubeBadge && (
        <span
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            width: `${badgeSize}px`,
            height: `${badgeSize}px`,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <YouTubeIcon size={badgeSize} />
        </span>
      )}
    </a>
  );
}

/* ─────────────────────────────────────────────
   POPUP VIDÉO — agrandi pour afficher tout le contenu
───────────────────────────────────────────── */
function VideoPopup({ src, alt, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(90vw, 480px)",
          maxHeight: "90vh",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#000",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
            background: "rgba(0,0,0,0.6)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
        <video
          autoPlay
          muted
          loop
          playsInline
          controls
          aria-label={alt}
          style={{
            width: "100%",
            display: "block",
            maxHeight: "90vh",
            objectFit: "contain",
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────────── */
export default function Content({ lang = "fr" }) {
  const t = TRANSLATIONS[lang] ?? TRANSLATIONS.fr;
  const [showVideoPopup, setShowVideoPopup] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "1rem 0",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          background: "#fffef5",
          fontFamily: nunitoSans.style.fontFamily,
          color: "#2b2b2b",
          boxSizing: "border-box",
        }}
      >
        {/* ── HERO VIDEO ─────────────────────────── */}
        <HeroVideo alt={t.alt.heroVideo} />

        {/* ── LIGNE DE SÉPARATION ────────────────── */}
        <div
          style={{
            height: "3px",
            width: "100%",
            background: "#a07a3a",
            marginBottom: "1.25rem",
            marginTop: "0",
          }}
        />

        {/* ── TITRE MÉDIA ────────────────────────── */}
        <h2
          style={{
            fontFamily: nunitoSans.style.fontFamily,
            fontWeight: 900,
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            color: "#a07a3a",
            letterSpacing: "0.02em",
            lineHeight: 1,
            margin: "0 0 0.5rem 0",
          }}
        >
          {t.title}
        </h2>

        {/* ── CITATION HAUTE ─────────────────────── */}
        <p
          style={{
            fontSize: "clamp(0.85rem, 2.2vw, 1.1rem)",
            letterSpacing: "0.08em",
            color: "#7a5a2a",
            margin: "0 0 1.25rem 0",
            fontWeight: 700,
            fontFamily: nunitoSans.style.fontFamily,
            fontStretch: "expanded",
          }}
        >
          {t.topQuote}
        </p>

        {/* ── GRILLE 2 COLONNES ──────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "16px",
            alignItems: "start",
          }}
        >
          {/* COLONNE GAUCHE */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "22px",
              alignItems: "stretch",
            }}
          >
            {/* Baby Sitting — ouvre popup vidéo */}
            <ContentCard
                src="/images/contenu/babySitting.png"
                alt={t.alt.imageContent1}
                ariaLabel={t.ariaLink}
                href="#"
                external={false}
                cardStyle={{ width: "100%", aspectRatio: "9 / 16" }}  {/* ← ratio ajusté */}
                imgStyle={{ objectFit: "contain" }}                    {/* ← ajout */}
                onClick={() => setShowVideoPopup(true)}
              />

            {/* Tablette + logo YouTube */}
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <ContentCard
                src="/images/contenu/tablet.png"
                alt={t.alt.imageContent4}
                ariaLabel={t.ariaLink}
                href={YOUTUBE_URL}
                external={false}
                cardStyle={{ width: "100%", aspectRatio: "2 / 2.7" }}
              />
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.ariaLink}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: "6px",
                  paddingLeft: "2px",
                }}
              >
                <YouTubeIcon size={84} />
              </a>
            </div>
          </div>

          {/* COLONNE DROITE */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "22px",
              alignItems: "stretch",
            }}
          >
            {/* Chat */}
            <ContentCard
              src="/images/contenu/cat.png"
              alt={t.alt.imageContent3}
              ariaLabel={t.ariaLink}
              href={YOUTUBE_URL}
              external={true}
              cardStyle={{ width: "100%", aspectRatio: "4 / 4" }}
            />

            {/* Bar à jus — objectFit "contain" pour ne pas rogner */}
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <ContentCard
                src="/images/contenu/barJus.png"
                alt={t.alt.imageContent2}
                ariaLabel={t.ariaLink}
                href={YOUTUBE_URL}
                external={true}
                cardStyle={{ width: "100%", aspectRatio: "2 / 3", marginLeft: "-8px" }}
                imgStyle={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        {/* ── CITATION BASSE ─────────────────────── */}
        <div style={{ marginTop: "1.25rem", paddingTop: "0.25rem" }}>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "clamp(0.95rem, 2.2vw, 1.2rem)",
              letterSpacing: "0.08em",
              color: "#7a5a2a",
              fontWeight: 700,
              fontFamily: nunitoSans.style.fontFamily,
              fontStretch: "expanded",
              margin: 0,
            }}
          >
            {t.bottomQuote}
            <span
              style={{
                flex: 1,
                height: "2px",
                background: "#a07a3a",
                display: "inline-block",
              }}
            />
          </p>
          <p
            style={{
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              color: "#7a5a2a",
              margin: "0.25rem 0 0 0",
              fontStyle: "italic",
            }}
          >
            {t.author}
          </p>
        </div>
      </div>

      {/* ── POPUP VIDÉO ────────────────────────── */}
      {showVideoPopup && (
        <VideoPopup
          src="/images/contenu/babySitting.mp4"
          alt={t.alt.imageContent1}
          onClose={() => setShowVideoPopup(false)}
        />
      )}
    </div>
  );
}