import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getChatTE, sendMessageTE } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { SendHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1),
});

const Chat = () => {
  const navigate = useNavigate();
  const { chat_id: chatID = "" } = useParams();
  const { toast } = useToast();

  const [title, setTitle] = useState("Načítání chatu...");

  const [formState, setFormState] = useState<
    "success" | "loading" | "sending" | "error" | "idle"
  >("loading");

  const redirectHome = () => {
    navigate("/", { replace: true });
    return "Přesměrování...";
  };
  const getChatTitle = async () =>
    pipe(
      chatID,
      O.fromNullable,
      O.foldW(redirectHome, (chatID) =>
        pipe(
          chatID,
          getChatTE,
          TE.matchW(redirectHome, (chat) => chat.title)
        )()
      )
    );

  getChatTitle().then((result) => {
    setTitle(result);
    setFormState("idle");
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = async (values: z.infer<typeof messageSchema>) => {
    setFormState("sending");
    return pipe(
      sendMessageTE(values.content, chatID),
      TE.matchW(
        (error) => {
          messageForm.setError("content", {
            type: "custom",
            message: "Nepodařilo se odeslat zprávu",
          });
          setFormState("error");
          return error;
        },
        (response) => {
          setFormState("success");
          messageForm.reset();
          toast({ description: "Zpráva odeslána" });
          return Promise.resolve(response);
        }
      )
    )();
  };

  return (
    <div className="w-full max-w-lg flex flex-col gap-1.5">
      <h2>{title}</h2>
      <Form {...messageForm}>
        <form
          onSubmit={messageForm.handleSubmit(onSubmit)}
          className={`transition-all duration-300 flex max-sm:flex-col gap-2 ${
            (formState == "loading" || formState == "sending") &&
            "opacity-50 pointer-events-none"
          }`}
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
                    onInput={() => setFormState("idle")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="sm:mt-6">
            {formState == "sending" ? "Odesílání" : "Odeslat"}

            {formState == "error" ? (
              <X className="ml-3" />
            ) : (
              <SendHorizontal className="ml-3" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Chat;
