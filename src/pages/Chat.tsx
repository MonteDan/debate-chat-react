import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import pb from "@/lib/pb";
import { padAndCut } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1),
});

async function Chat(props: { match: { params: { chat_id: string } } }) {
  const chat_id = padAndCut(props.match.params.chat_id);

  const getChatTitle = pipe(
    TE.tryCatch(
      () => pb.collection("chats").getOne(chat_id, { fields: "title" }),
      E.toError
    ),
    TE.map((chat) => chat.title),
    TE.fold(
      () => "", // return empty string in case of failure
      (title) => title || "" // return title or empty string if title is null or undefined
    )
  );

  const title = await getChatTitle();

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = (values: z.infer<typeof messageSchema>) => {
    pipe(
      values.content,
      TE.tryCatchK(
        (content) => pb.collection("messages").create({ content }),
        () =>
          messageForm.setError("content", {
            type: "custom",
            message: "Nepodařilo se odeslat zprávu",
          })
      ),
      TE.chain(
        TE.tryCatchK(
          (record) =>
            pb.collection("chats").update(chat_id, { "messages+": record.id }),
          () =>
            messageForm.setError("content", {
              type: "custom",
              message: "Chat již neexistuje.",
            })
        )
      )
    );
  };

  return (
    <div className="w-full max-w-lg flex flex-col gap-1.5">
      <Form {...messageForm}>
        <form
          onSubmit={messageForm.handleSubmit(onSubmit)}
          className="flex items-end gap-2"
        >
          <FormField
            control={messageForm.control}
            name="content"
            render={({ field }) => (
              <FormItem className="space-y-0 w-full">
                <FormLabel htmlFor="content">
                  Zadejte svoji otázku nebo připomínku
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Otázka/připomínka"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit">
            Odeslat <SendHorizontal className="ml-3" />
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Chat;
