import * as TE from "fp-ts/TaskEither";
import { identity } from "fp-ts/lib/function";
import { hashPassword } from "./utils";

const API_URL = import.meta.env.VITE_APP_API_URL;

export type Message = {
  content: string;
  id: string;
};
export type Chat = {
  title: string;
  id: string;
  adminToken: string;
  messages: Message[];
};

export const createChatTE = (title: string, chatID: string, password: string) =>
  TE.tryCatchK(
    () =>
      fetch(`http${API_URL}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          id: chatID,
          password: hashPassword(password, chatID),
        }),
      }).then((res) =>
        res.ok ? (res.json() as Promise<Chat>) : Promise.reject("")
      ),
    identity
  )();

export const getChatTE = (chatID: string) =>
  TE.tryCatchK(
    () =>
      fetch(`http${API_URL}/chats/${chatID}`).then((res) =>
        res.ok ? (res.json() as Promise<Chat>) : Promise.reject("")
      ),
    identity
  )();

export const sendMessageTE = (content: string, chatID: string) =>
  TE.tryCatchK(
    () =>
      fetch(`http${API_URL}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, chatId: chatID }),
      }).then((res) => (res.ok ? res.text() : Promise.reject(""))),
    identity
  )();

export const adminGetChatTE = (chatID: string, adminToken: string) =>
  TE.tryCatchK(
    () =>
      fetch(`http${API_URL}/chats/${chatID}/admin`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      }).then((res) =>
        res.ok
          ? (res.json() as Promise<Chat>)
          : Promise.reject("Insufficient permissions")
      ),
    identity
  )();

export const adminChatLoginTE = (chatID: string, password: string) =>
  TE.tryCatchK(
    () =>
      fetch(`http${API_URL}/chats/${chatID}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: hashPassword(password, chatID),
          id: chatID,
        }),
      }).then((res) =>
        res.ok
          ? (res.json() as Promise<Chat>)
          : Promise.reject("Insufficient permissions")
      ),
    identity
  )();

export const createAdminWebSocket = (
  chatID: string,
  adminToken: string,
  onMessage: WebSocket["onmessage"]
) => {
  const websocket = new WebSocket(
    `ws${API_URL}/ws?adminToken=${adminToken}&chatId=${chatID}`
  );
  websocket.onmessage = onMessage;

  return websocket;
};

export const deleteMessageTE = (messageID: string, adminToken: string) =>
  TE.tryCatchK(
    () =>
      fetch(`http${API_URL}/message/${messageID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }).then((res) =>
        res.ok ? res.text() : Promise.reject("Insufficient permissions")
      ),
    identity
  )();
