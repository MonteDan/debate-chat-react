import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { adminChatLoginTE } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import Cookies from "js-cookie";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const joinSchema = z.object({
  password: z.string().min(1),
});

function ChatLogin() {
  const navigate = useNavigate();
  const { chat_id: chatID } = useParams();

  const joinForm = useForm<z.infer<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
  });
  const onSubmit = async (values: z.infer<typeof joinSchema>) =>
    pipe(
      adminChatLoginTE(chatID || "", values.password),
      TE.matchW(
        () => {
          joinForm.setError("password", {
            type: "custom",
            message: "Heslo je nesprávné",
          });
          return Promise.reject("");
        },
        (chat) => {
          Cookies.set("adminToken", chat.adminToken, { expires: 1 });
          navigate(`/admin/${chatID}`);
          return Promise.resolve();
        }
      )
    )();

  return (
    <Form {...joinForm}>
      <form
        onSubmit={joinForm.handleSubmit(onSubmit)}
        className="flex max-sm:flex-col gap-2"
      >
        <FormField
          control={joinForm.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-0 w-full">
              <FormLabel htmlFor="password">
                Zadejte heslo a připojte se jako moderátor
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="w-full"
                  placeholder="Heslo chatu"
                  {...field}
                />
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" className="sm:mt-6">
          <LogIn className="mr-3" /> Vstoupit
        </Button>
      </form>
    </Form>
  );
}

export default ChatLogin;
