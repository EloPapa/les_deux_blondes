"use client";
import React from "react";
import Button from "../Button";
import { FaGithub, FaYoutube, FaLinkedin, FaFacebook } from "react-icons/fa";
import yourData from "../../data/lesDeuxBlondes.json";

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
* Associe chaque titre de réseau social à son icône react-icons.
* On utilise un objet de correspondance (map) plutôt qu'une série de if/else.
* La clé est le titre en minuscules pour éviter les problèmes de casse (ex: "GitHub" → "github").
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
const ICON_MAP = {
  github:   <FaGithub />,
  youtube:  <FaYoutube />,
  linkedin: <FaLinkedin />,
  facebook: <FaFacebook />,
};

const Socials = ({ className }) => {
  return (
    <div className={`${className} flex flex-wrap mob:flex-nowrap link`}>
      {yourData.socials.map((social, index) => {

        // Cherche l'icône correspondant au titre (insensible à la casse)
        const icon = ICON_MAP[social.title.toLowerCase()];

        return (
          <Button key={index} onClick={() => window.open(social.link)}>
            {icon ?? social.title}
          </Button>
        );
      })}
    </div>
  );
};

export default Socials;