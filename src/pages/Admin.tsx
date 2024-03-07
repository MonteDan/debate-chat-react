import QRDialog from "@/components/QRDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  adminGetChatTE,
  createAdminWebSocket,
  deleteMessageTE,
  type Message,
} from "@/lib/api";
import { toggleSet } from "@/lib/utils";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import Cookies from "js-cookie";
import { Copy, Link, Pin, Trash, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const chatID = useParams().chat_id || "";

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

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Zkopírováno" });
  };

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
    <div className="flex flex-col items-center gap-24 max-w-lg overflow-hidden overflow-ellipsis">
      {loading ? (
        <p>Načítání...</p>
      ) : (
        <>
          <div className="flex flex-col gap-4 max-w-full">
            <h2 className="whitespace-nowrap overflow-hidden overflow-ellipsis">
              {chatTitle}artartartar
            </h2>
            <p className="flex gap-1 items-center">
              Kód: {chatID}
              <Button
                variant="ghost"
                className="p-1.5 h-auto"
                onClick={() => copy(chatID)}
              >
                <Copy size={16}></Copy>
              </Button>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="px-2 flex gap-2"
                onClick={() =>
                  copy(`https://debatnichat.online/chat/${chatID}`)
                }
              >
                Zkopírovat adresu
                <Link></Link>
              </Button>

              <QRDialog chatID={chatID} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {pinnedMessages.length + unpinnedMessages.length == 0 ? (
              <p>Zatím nepřišly žádné zprávy</p>
            ) : (
              <div className="flex gap-16">
                {pinnedMessages.concat(unpinnedMessages).map((message) => (
                  <Card
                    className={`p-1 pl-3 flex gap-1 justify-between items-center w-full ${
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
                          deleteModeStore.has(message.id)
                            ? "destructive"
                            : "ghost"
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
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;
