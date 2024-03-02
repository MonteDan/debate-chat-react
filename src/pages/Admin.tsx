import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import pb from "@/lib/pb";
import {
  checkAdmin as kickIfNotAdmin,
  padAndCut,
  toggleSet,
} from "@/lib/utils";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { Pin, Trash, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Message = {
  id: string;
  content: string;
};

function Admin() {
  const { chat_id } = useParams();
  const navigate = useNavigate();
  const chatRecordID = padAndCut(chat_id || "");

  useEffect(() => {
    kickIfNotAdmin(chatRecordID, navigate);
  }, [chatRecordID, navigate]);

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

  const deleteMessage = async (messageId: string) =>
    pb
      .collection("chats")
      .update(chatRecordID, {
        "messages-": messageId,
      })
      .then(() => {
        toggleDeleteMode(messageId);
        setMessages((prevMessages) =>
          prevMessages.filter((m) => m.id !== messageId)
        );
      });

  const toggleDeleteMode = (messageId: string) => {
    setDeleteModeStore(toggleSet(messageId));
  };
  const handleToggle = (messageId: string) => {
    setPinnedMessageIds(toggleSet(messageId));
  };

  // Fetch messages and subscribe to the chat
  pb.collection("chats")
    .getOne(chatRecordID, { expand: "messages" })
    .then((record) => {
      setLoading(false);
      pipe(
        record.expand?.messages as Message[],
        O.fromNullable,
        O.map(setMessages)
      );
    });
  pb.collection("chats").subscribe(
    chatRecordID,
    async ({ record }) =>
      pipe(
        record.expand?.messages as Message[],
        O.fromNullable,
        O.map(setMessages)
      ),
    {
      expand: "messages",
    }
  );

  return (
    <div className='flex flex-col items-end gap-4'>
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
                  variant='ghost'
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
