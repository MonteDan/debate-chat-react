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
import { getChatTE } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const joinSchema = z.object({
  id: z.string().min(1),
});

function Join() {
  const navigate = useNavigate();

  const joinForm = useForm<z.infer<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
  });
  const onSubmit = async (values: z.infer<typeof joinSchema>) =>
    pipe(
      values.id,
      getChatTE,
      TE.matchW(
        () => {
          joinForm.setError("id", {
            type: "custom",
            message: "Chat neexistuje",
          });
          return Promise.reject("");
        },
        (chat) => {
          navigate(`/chat/${chat.id}`);
          return Promise.resolve();
        }
      )
    )();

  return (
    <Form {...joinForm}>
      <form onSubmit={joinForm.handleSubmit(onSubmit)} className="flex max-sm:flex-col gap-2">
        <FormField
          control={joinForm.control}
          name="id"
          render={({ field }) => (
            <FormItem className="space-y-0 w-full">
              <FormLabel htmlFor="id">
                Zadejte kód a připojte se jako divák
              </FormLabel>
              <FormControl>
                <Input className="w-full" placeholder="Kód chatu" {...field} />
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

export default Join;
