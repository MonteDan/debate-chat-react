import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import pb from "@/lib/pb";
import { isAdmin, padAndCut } from "@/lib/utils";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { Pin, Trash, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Message = {
  id: string;
  content: string;
};

async function Admin(props: { match: { params: { chat_id: string } } }) {
  const navigate = useNavigate();
  const chat_id = padAndCut(props.match.params.chat_id);

  if (!(await isAdmin(chat_id))) {
    navigate("/", { replace: true });
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [pinnedMessageIds, setPinnedMessageIds] = useState<
    Record<string, boolean>
  >([]);
  const [deleteModeStore, setDeleteModeStore] = useState<
    Record<string, boolean>
  >({});

  const pinnedMessages = useMemo(
    () => messages.filter((m) => pinnedMessageIds[m.id]),
    [messages, pinnedMessageIds]
  );
  const unpinnedMessages = useMemo(
    () => messages.filter((m) => !pinnedMessageIds[m.id]),
    [messages, pinnedMessageIds]
  );

  await pb
    .collection("chats")
    .subscribe(
      chat_id,
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

  const toggleDeleteMode = (id: string) => {
    setDeleteModeStore((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteMessage = async (messageId: string) => {
    pb.collection("chats").update(chat_id, {
      "messages-": messageId,
    });
  };

  const handleToggle = (messageId: string) => {
    setPinnedMessageIds((prev) => ({
      ...prev,
      [messageId]: !pinnedMessageIds[messageId],
    }));
  };

  return (
    <>
      {pinnedMessages.concat(unpinnedMessages).map((message) => (
        <Card className={`p-0.5 flex gap-1 items-center max-w-lg ${pinnedMessageIds[message.id] && "border-primary"}`}>
          <span>{message.content}</span>
          <span className='flex flex-col justify-between item-center'>
            <Button
              onClick={() =>
                deleteModeStore[message.id]
                  ? deleteMessage(message.id)
                  : toggleDeleteMode(message.id)
              }
              size="sm"
            >
              <Trash size={16}></Trash>
            </Button>
            {deleteModeStore[message.id] ? (
              <Button
                onClick={() => toggleDeleteMode(message.id)}
                variant="ghost"
                size="sm"
              >
                <X size={16}></X>
              </Button>
            ) : (
              <Toggle
                size="sm"
                onPressedChange={() => handleToggle(message.id)}
              >
                <Pin size={16}></Pin>
              </Toggle>
            )}
          </span>
        </Card>
      ))}
    </>
  );
}

export default Admin;
