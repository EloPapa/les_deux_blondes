"use client";
import React from "react";
import Button from "../Button";
import { FaGithub, FaYoutube, FaLinkedin, FaFacebook } from "react-icons/fa";
import yourData from "../../data/lesDeuxBlondes.json";

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* Couleurs officielles de chaque réseau social.
* ICON_MAP retourne maintenant une fonction qui accepte une taille,
* pour pouvoir passer size et color à chaque icône.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const ICON_MAP = {
  github:   (size) => <FaGithub   size={size} color="#333333" />,
  youtube:  (size) => <FaYoutube  size={size} color="#FF0000" />,
  linkedin: (size) => <FaLinkedin size={size} color="#0A66C2" />,
  facebook: (size) => <FaFacebook size={size} color="#1877F2" />,
};

const ICON_SIZE = 64; // taille de base doublée (16 → 32)

const Socials = ({ className }) => {
  return (
    <div className={`${className} flex flex-wrap mob:flex-nowrap link`}>
      {yourData.socials.map((social, index) => {

        const iconFn = ICON_MAP[social.title.toLowerCase()];

        return (
          <Button key={index} onClick={() => window.open(social.link)}>
            {iconFn ? iconFn(ICON_SIZE) : social.title}
          </Button>
        );
      })}
    </div>
  );
};

export default Socials;