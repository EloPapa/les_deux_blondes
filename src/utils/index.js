"use client";

import { useLayoutEffect, useEffect } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ISOToDate(date) {
  if (date) {
    let convertDate = new Date(date);
    return (
      convertDate.getFullYear() +
      "-" +
      (convertDate.getMonth() + 1) +
      "-" +
      convertDate.getDate()
    );
  }
}

export function getRandomImage() {
  const randomImageUrl = [
    "https://imagesRandom1",
    "https://imagesRandom2",
    "https://imagesRandom3",
    "https://imagesRandom4",
  ];
  return randomImageUrl[Math.floor(Math.random() * randomImageUrl.length)];
}