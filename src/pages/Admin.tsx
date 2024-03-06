import QRCode from "@/components/QRCode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  adminGetChatTE,
  createAdminWebSocket,
  deleteMessageTE,
  type Message,
} from "@/lib/api";
import { H, W, calculateColumns, toggleSet } from "@/lib/utils";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { toPng } from "html-to-image";
import Cookies from "js-cookie";
import { Download, Pin, Printer, QrCode, Trash, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { chat_id } = useParams();
  const chatID = chat_id || "";

  const [loading, setLoading] = useState(true);
  const [chatTitle, setChatTitle] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [pinnedMessageIds, setPinnedMessageIds] = useState<Set<string>>(
    new Set()
  );
  const [deleteModeStore, setDeleteModeStore] = useState<Set<string>>(
    new Set()
  );

  const pinnedMessages = useMemo(
    () => messages.filter((m) => pinnedMessageIds.has(m.id)),
    [messages, pinnedMessageIds]
  );
  const unpinnedMessages = useMemo(
    () => messages.filter((m) => !pinnedMessageIds.has(m.id)),
    [messages, pinnedMessageIds]
  );

  const deleteMessage = async (messageID: string) =>
    pipe(
      deleteMessageTE(messageID, Cookies.get("adminToken") ?? ""),
      TE.matchW(
        () => toast({ description: "Nepodařilo se smazat zprávu" }),
        () => {
          toggleDeleteMode(messageID);
          setMessages((prevMessages) =>
            prevMessages.filter((m) => m.id !== messageID)
          );
        }
      )
    )();

  const toggleDeleteMode = (messageId: string) => {
    setDeleteModeStore(toggleSet(messageId));
  };
  const handleToggle = (messageId: string) => {
    setPinnedMessageIds(toggleSet(messageId));
  };

  const toHighResImage = <T extends HTMLElement>(image: T) => toPng(image);

  const downloadQrCode = () =>
    pipe(
      document.querySelector("#qrcode"),
      O.fromNullable,
      O.fold(
        () => TE.left(new Error("No QR code found")),
        (qr) =>
          TE.tryCatch(
            () => toHighResImage(qr as HTMLElement),
            () => new Error("Conversion to PNG format failed.")
          )
      ),
      TE.chain((dataUrl) =>
        TE.tryCatch(
          () => {
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
    );

  const printQrCode = (numPerA4: number = 1) =>
    pipe(
      document.querySelector("#qrcode"),
      O.fromNullable,
      O.foldW(
        () => toast({ description: "No QR code found" }),
        (qr) =>
          toHighResImage(qr as HTMLElement)
            .then((dataUrl) => {
              const printingWindow = window.open("", "_blank");

              const columns = calculateColumns(numPerA4);

              printingWindow?.document.write(`
                <html>
                  <head>
                    <style>
                      body {
                        margin: 0;
                      }
                    </style>
                  </head>
                  <body>
                    <div style="display: grid; grid-template-columns: ${"1fr ".repeat(
                      columns
                    )}">
              `);

              const sizeInMm = Math.min((H * columns) / numPerA4, W / columns);
              for (let n = 0; n < numPerA4; n++) {
                printingWindow?.document.write(
                  `<img style="width: ${sizeInMm}mm; height: ${sizeInMm}mm" src="${dataUrl}">`
                );
              }

              printingWindow?.document.write("</div>");
              printingWindow?.document.write("</body></html>");
              printingWindow?.document.close();
              printingWindow?.print();
            })
            .catch((error) => {
              console.error("Error converting QR code to PNG", error);
            })
      )
    );

  useEffect(() => {
    if (chatID && navigate) {
      // Fetch messages
      pipe(
        adminGetChatTE(chatID, Cookies.get("adminToken") || ""),
        TE.matchW(
          () => navigate("/", { replace: true }),
          (chat) => {
            setMessages(chat.messages);
            setChatTitle(chat.title);
            setLoading(false);
          }
        )
      )();

      // Subscribe to messages
      const websocket = createAdminWebSocket(
        chatID,
        Cookies.get("adminToken") || "",
        (event) => {
          const message = JSON.parse(event.data) as Message;
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      );

      return () => {
        websocket.close();
      };
    }
  }, [chatID, navigate]);

  return (
    <div className="flex flex-col items-center gap-8">
      {loading ? (
        <p>Načítání...</p>
      ) : pinnedMessages.length + unpinnedMessages.length == 0 ? (
        <p>Zatím nepřišly žádné zprávy</p>
      ) : (
        <>
          <div className="flex items-center">
            <h3>{chatTitle}</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-auto h-auto p-2">
                  <QrCode size={40} />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vmin] max-h-[90vmin] flex flex-col items-center">
                <div id="qrcode" className="text-center ">
                  <QRCode
                    value={"debatnichat.online/chat/" + chatID}
                    title={"debatnichat.online/chat/" + chatID}
                    className=""
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={downloadQrCode}>
                    <Download></Download>
                  </Button>
                  <Button onClick={() => printQrCode(2)}>
                    <Printer></Printer>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {pinnedMessages.concat(unpinnedMessages).map((message) => (
            <div className="flex flex-col gap-4 max-w-lg">
              <Card
                className={`p-0.5 pl-3 flex gap-1 items-center w-full ${
                  pinnedMessageIds.has(message.id) && "border-primary"
                }`}
              >
                <div>{message.content}</div>
                <div className="flex flex-col justify-between item-center">
                  <Button
                    onClick={() =>
                      deleteModeStore.has(message.id)
                        ? deleteMessage(message.id)
                        : toggleDeleteMode(message.id)
                    }
                    variant={
                      deleteModeStore.has(message.id) ? "destructive" : "ghost"
                    }
                    size="sm"
                  >
                    <Trash
                      size={16}
                      className={
                        !deleteModeStore.has(message.id) ? "opacity-50" : ""
                      }
                    />
                  </Button>
                  {deleteModeStore.has(message.id) ? (
                    <Button
                      onClick={() => toggleDeleteMode(message.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <X size={16} />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={
                        pinnedMessageIds.has(message.id) ? "bg-muted" : ""
                      }
                      onClick={() => handleToggle(message.id)}
                    >
                      <Pin size={16} className="opacity-50" />
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Admin;
