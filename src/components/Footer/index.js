"use client";

import { useLanguage } from "../../context/LanguageContext";
import Button from "../Button";
import Socials from "../Socials";

const Footer = () => {
  const { t } = useLanguage();
  
  const backgroundGradient = "linear-gradient(to top, transparent 60%, #fef2f5 100%), linear-gradient(to right, #fef2f5 0%, #f9d0de 30%, #f5b8cc 50%, #f9d0de 70%, #fef2f5 100%)";

  return (
    <footer className="w-full flex flex-col items-center mt-20">

      {/* SECTION CONTACT */}
      <div className="w-full px-6 flex flex-col items-center text-center mt-auto">
        <h2 className="text-3xl tablet:text-4xl laptop:text-4xl laptopl:text-4xl font-bold">
          {t.sections.collaborate1}
        </h2>
        <h2 className="text-3xl tablet:text-4xl laptop:text-4xl laptopl:text-4xl font-bold">
          {t.sections.collaborate2}
        </h2>
        <div className="mt-6">
          <Button type="primary">{t.footer.scheduleSession}</Button>
        </div>
        <div className="mt-6">
          <Socials />
        </div>
      </div>

      {/* FOOTER BAS — pleine largeur */}
      <div
        className="w-full mt-16 p-8 text-center"
        style={{ background: backgroundGradient }}
      >
        <h2 className="text-sm tablet:text-base laptop:text-base laptopl:text-base font-bold">
          {t.footer.madeWith}{" "}
          <span style={{ color: "red" }}>❤️</span>          
        </h2>
      </div>

    </footer>
  );
};

export default Footer;