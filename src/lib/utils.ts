import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const replacements: Record<string, string> = {
  " ": "-",
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ý: "y",
  č: "c",
  ď: "d",
  ě: "e",
  ň: "n",
  ř: "r",
  š: "s",
  ť: "t",
  ů: "u",
  ž: "z",
};
export const cleanString = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9-]/g, (char) => replacements[char] || "");

export const padAndCut = (id: string) => id.padStart(15, "0").substring(0, 15);

export const toggleSet =
  <A>(item: A) =>
  (prev: Set<A>) => {
    const newSet = new Set(prev);
    if (prev.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    return newSet;
  };

const W = 210; // A4 width (mm)
const H = 297; // A4 height (mm)
/** Number of square images => number of columns needed to fit them on an A4 while keeping them as spacious as possible */
export const calculateColumns = (nOfImages: number) =>
  Math.ceil((Math.sqrt(nOfImages) * W) / H);
