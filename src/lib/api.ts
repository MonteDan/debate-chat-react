import * as TE from "fp-ts/TaskEither";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "s://idk-the-adress-yet"
    : "://localhost:8080";

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

export const createChatTE = (title: string, chatID: string) =>
  TE.tryCatchK(
    () =>
      fetch(`http${API_URL}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, id: chatID }),
      }).then((res) =>
        res.ok ? (res.json() as Promise<Chat>) : Promise.reject("")
      ),
    (reason) => reason
  )();

export const getChatTE = (chatID: string) =>
  TE.tryCatchK(
    () =>
      fetch(`http${API_URL}/chats/${chatID}`).then((res) =>
        res.ok ? (res.json() as Promise<Chat>) : Promise.reject("")
      ),
    (reason) => reason
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
    (reason) => reason
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
    (reason) => reason
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
