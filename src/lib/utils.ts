import { clsx, type ClassValue } from "clsx";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { toPng } from "html-to-image";
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

export const W = 205; // A4 width (mm), I went for 5mm less just to be sure of the compatibility with the majority of browsers and printers
export const H = 292; // A4 height (mm), I went for 5mm less just to be sure of the compatibility with the majority of browsers and printers
/** Number of square images => number of columns needed to fit them on an A4 while keeping them as spacious as possible */
export const getColumns = (nOfImages: number) =>
  Math.ceil((Math.sqrt(nOfImages) * W) / H);

export const inchesToMm = (inches: number) => inches * 25.4;

export const getSizeInMm = (imagesPerA4: number) =>
  pipe(imagesPerA4, getColumns, (columns) =>
    Math.min(H / Math.ceil(imagesPerA4 / columns), W / columns)
  );

/** Returns a fraction respresenting how much paper is covered by the QR Codes */
export const getEfficiency = (imagesPerA4: number) =>
  (getSizeInMm(imagesPerA4) ** 2 * imagesPerA4) / W / H; // AreaOfOne^2 * amount / PaperArea

export const round = (precision: number) => (n: number) =>
  Math.round(n * 10 ** precision) / 10 ** precision;

export const downloadQrCode = (chatID: string) =>
  pipe(
    document.querySelector("#qrcode") as HTMLElement,
    O.fromNullable,
    O.fold(
      () => TE.left(new Error("No QR code found")),
      TE.tryCatchK(
        (qr: HTMLElement) => toPng(qr as HTMLElement, { skipFonts: true }),
        () => new Error("Conversion to PNG format failed.")
      )
    ),
    TE.chain(
      TE.tryCatchK(
        (dataUrl: string) => {
          const link = document.createElement("a");
          link.download = `QR-debatnichat-${chatID}.png`;
          link.href = dataUrl;
          link.click();
          return Promise.resolve();
        },
        () => new Error("Failed to download QR code PNG")
      )
    ),
    TE.fold(
      (error) => T.fromIO(() => console.log(error.message)),
      () => T.fromIO(() => undefined)
    )
  )();
