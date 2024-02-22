import pb from "@/lib/pb";
import { clsx, type ClassValue } from "clsx";
import Cookies from "js-cookie";
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

export async function isAdmin(chat_id: string): Promise<boolean> {
  const chat = await pb.collection("chats").getOne(chat_id, {
    fields: "adminToken",
  });

  return chat && chat.adminToken === Cookies.get("adminToken");
}
