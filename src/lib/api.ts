import * as TE from "fp-ts/TaskEither";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "s://idk-the-adress-yet"
    : "://localhost:8080";

// export const createChat = async (title: string, id: string) => {
//   const response = await fetch(`http${API_URL}/chats`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ title, id }),
//   });

//   if (!response.ok) {
//     return Promise.reject("Chat with ID already exists");
//   }
//   return await response.json();
// };

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

export const createChatTE = (title: string, id: string) =>
  TE.tryCatchK(
    () =>
      fetch(`http${API_URL}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, id }),
      }).then((res) =>
        res.ok ? (res.json() as Promise<Chat>) : Promise.reject("")
      ),
    (reason) => reason
  )();
