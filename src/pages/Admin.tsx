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
import { Pin, Trash, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { chat_id } = useParams();
  const chatID = chat_id || "";

  const [loading, setLoading] = useState(true);
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
        () => toast({ title: "Nepodařilo se smazat zprávu" }),
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

  useEffect(() => {
    if (chatID && navigate) {
      // Fetch messages
      pipe(
        adminGetChatTE(chatID, Cookies.get("adminToken") || ""),
        TE.matchW(
          () => navigate("/", { replace: true }),
          (chat) => {
            setMessages(chat.messages);
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
    <div className="flex flex-col items-end gap-4">
      {loading ? (
        <p>Načítání...</p>
      ) : pinnedMessages.length + unpinnedMessages.length == 0 ? (
        <p>Zatím nepřišly žádné zprávy</p>
      ) : (
        pinnedMessages.concat(unpinnedMessages).map((message) => (
          <Card
            className={`p-0.5 pl-3 flex gap-1 items-center w-fit max-w-lg ${
              pinnedMessageIds.has(message.id) && "border-primary"
            }`}
          >
            <span>{message.content}</span>
            <span className="flex flex-col justify-between item-center">
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
                  className={pinnedMessageIds.has(message.id) ? "bg-muted" : ""}
                  onClick={() => handleToggle(message.id)}
                >
                  <Pin size={16} className="opacity-50" />
                </Button>
              )}
            </span>
          </Card>
        ))
      )}
    </div>
  );
}

export default Admin;
