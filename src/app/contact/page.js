"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import data from "../../data/lesDeuxBlondes.json";

const BackArrowIcon = ({ size = 20, color = "#664b23" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d7fa0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d7fa0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d7fa0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const HEADER_BG = "linear-gradient(to bottom, transparent 60%, #d4f0e4 100%), linear-gradient(to right, #d4f0e4 0%, #8ecfb0 30%, #6bbf9a 50%, #8ecfb0 70%, #d4f0e4 100%)";
const BANNER_BG = "linear-gradient(to top, transparent 60%, #d4f0e4 100%), linear-gradient(to right, #d4f0e4 0%, #8ecfb0 30%, #6bbf9a 50%, #8ecfb0 70%, #d4f0e4 100%)";

const MiniHeader = () => {
  const router = useRouter();
  const { lang, toggle } = useLanguage();
  const { name } = data;

  return (
    <div
      className="sticky top-0 z-20 w-full grid px-4 sm:px-6"
      style={{
        background: HEADER_BG,
        gridTemplateColumns: "1fr auto 1fr",
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
    >
      {/* Colonne gauche - Bouton retour */}
      <div className="flex items-center">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.15)", color: "#2d7fa0", border: "1px solid #2d7fa0" }}
        >
          <BackArrowIcon size={14} color="#2d7fa0" />
          <span>{lang === "fr" ? "Retour" : "Back"}</span>
        </button>
      </div>

      {/* Colonne centre - Titre */}
      <div className="flex items-center justify-center py-2">
        <h1
          onClick={() => router.push("/")}
          className="font-medium cursor-pointer"
          style={{
            fontFamily: "'Amsterdam', cursive",
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            whiteSpace: "nowrap",
            background: "linear-gradient(to bottom, #2d7a5f 0%, #8ecfb0 50%, #d4f0e4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {name}.
        </h1>
      </div>

      {/* Colonne droite - Bouton langue */}
      <div className="flex items-center justify-end">
        <button
          onClick={toggle}
          className="text-xs sm:text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
          style={{ color: "#2d7a5f" }}
        >
          {lang === "fr" ? "EN" : "FR"}
        </button>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const router = useRouter();
  const { lang } = useLanguage();

  const [form, setForm] = useState({ prenom: "", nom: "", courriel: "", sujet: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.prenom.trim()) newErrors.prenom = true;
    if (!form.nom.trim()) newErrors.nom = true;
    if (!form.courriel.trim() || !/\S+@\S+\.\S+/.test(form.courriel)) newErrors.courriel = true;
    if (!form.message.trim()) newErrors.message = true;
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: false });
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSubmitted(true);
  };

  const textColor = "#664b23";

  const inputClass = (field) =>
    `w-full border-b bg-transparent outline-none py-1 text-sm transition-colors ${
      errors[field] ? "border-red-400" : "border-gray-300 focus:border-[#2d7fa0]"
    }`;

  return (
    <div className="relative flex flex-col min-h-screen">

      <MiniHeader />

      <main className="flex-grow" style={{ background: "#ffffff" }}>

        {/* ── BANNIÈRE ── */}
        <div
          className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden px-4 pt-10 pb-16 sm:pt-12 sm:pb-20"
          style={{
            background: BANNER_BG,
            minHeight: "260px",
          }}
        >
          <h1
            className="font-bold tracking-wide mb-4 sm:mb-6"
            style={{
              color: "#ffffff",
              fontFamily: "'Amsterdam', cursive",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
            }}
          >
            {lang === "fr" ? "Contactez-nous" : "Contact Us"}
          </h1>

          <p
            className="max-w-xs sm:max-w-md lg:max-w-lg"
            style={{ color: "rgba(255,255,255,0.88)", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}
          >
            {lang === "fr"
              ? "Vous souhaitez nous contacter\u00a0? Nous serions ravis de vous entendre."
              : "Want to get in touch? We'd love to hear from you."}
          </p>
          <p
            className="mt-1"
            style={{ color: "rgba(255,255,255,0.88)", fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)" }}
          >
            {lang === "fr" ? "Voici comment vous pouvez nous joindre." : "Here's how you can reach us."}
          </p>
        </div>

        {/* ── CARTES DE CONTACT ── */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-6 lg:px-8 -mt-10 z-10 relative max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-lg shadow-md px-6 py-5 flex flex-col items-center gap-2 w-full sm:flex-1">
            <LocationIcon />
            <p className="font-semibold text-sm text-center" style={{ color: "#2d7fa0" }}>HappyLand Canada</p>
          </div>
          <div className="bg-white rounded-lg shadow-md px-6 py-5 flex flex-col items-center gap-2 w-full sm:flex-1">
            <PhoneIcon />
            <p className="font-semibold text-sm" style={{ color: "#2d7fa0" }}>(xxx)-xxx-xxxx</p>
            <p className="text-xs text-gray-500">{lang === "fr" ? "Appelez-nous" : "Call us"}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md px-6 py-5 flex flex-col items-center gap-2 w-full sm:flex-1">
            <EmailIcon />
            <p className="font-semibold text-sm text-center break-all" style={{ color: "#2d7fa0" }}>info@lesDeuxBlondes.ca</p>
            <p className="text-xs text-gray-500">{lang === "fr" ? "Contactez-nous par email." : "Email us."}</p>
          </div>
        </div>

        {/* ── FORMULAIRE ── */}
        <div className="flex justify-center px-4 sm:px-6 mt-10 mb-16">
          <div className="w-full max-w-lg">

            <h2
              className="text-center mb-6 font-semibold"
              style={{ color: "#2d7fa0", fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
            >
              {lang === "fr" ? "Entrer en contact" : "Get in Touch"}
            </h2>

            {submitted ? (
              <div className="text-center py-10 px-6 rounded-lg" style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
                <p className="text-lg font-semibold" style={{ color: "#16a34a" }}>
                  {lang === "fr" ? "Message envoyé\u00a0!" : "Message sent!"}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {lang === "fr" ? "Nous vous répondrons dans les plus brefs délais." : "We'll get back to you as soon as possible."}
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ prenom: "", nom: "", courriel: "", sujet: "", message: "" }); }}
                  className="mt-4 text-sm underline"
                  style={{ color: "#2d7fa0" }}
                >
                  {lang === "fr" ? "Envoyer un autre message" : "Send another message"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs mb-1" style={{ color: textColor }}>
                      {lang === "fr" ? "Prénom" : "First Name"} <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="prenom"
                      value={form.prenom}
                      onChange={handleChange}
                      className={inputClass("prenom")}
                      style={{ color: textColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs mb-1" style={{ color: textColor }}>
                      {lang === "fr" ? "Nom de famille" : "Last Name"} <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="nom"
                      value={form.nom}
                      onChange={handleChange}
                      className={inputClass("nom")}
                      style={{ color: textColor }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: textColor }}>
                    {lang === "fr" ? "Adresse courriel" : "Email Address"} <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="courriel"
                    type="email"
                    value={form.courriel}
                    onChange={handleChange}
                    className={inputClass("courriel")}
                    style={{ color: textColor }}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: textColor }}>
                    {lang === "fr" ? "Sujet" : "Subject"}
                  </label>
                  <input
                    name="sujet"
                    value={form.sujet}
                    onChange={handleChange}
                    className={inputClass("sujet")}
                    style={{ color: textColor }}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: textColor }}>
                    {lang === "fr" ? "Votre message" : "Your Message"} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className={`${inputClass("message")} resize-y`}
                    style={{
                      color: textColor,
                      borderBottom: "none",
                      border: errors.message ? "1px solid #f87171" : "1px solid #d1d5db",
                      borderRadius: "4px",
                      padding: "8px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>

                <div className="flex justify-center mt-2">
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-2 rounded text-sm font-semibold tracking-wide transition-opacity hover:opacity-85"
                    style={{ background: "#2d7fa0", color: "#ffffff" }}
                  >
                    {lang === "fr" ? "SOUMETTRE" : "SUBMIT"}
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}