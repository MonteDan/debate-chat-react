import FormHelp from "@/components/FormHelp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import pb from "@/lib/pb";
import { cleanString, padAndCut } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().optional(),
  id: z.string().optional(),
});

function Home() {
  const navigate = useNavigate();

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
  });

  const createChatTE = TE.tryCatchK(
    (rawId: string, title = "Chat") =>
      pb.collection("chats").create({
        adminToken: v4(),
        title: title,
        id: padAndCut(rawId),
        messages: [],
      }),
    () =>
      createForm.setError("id", {
        type: "custom",
        message: "Tato adresa chatu již existuje. Zkuste jinou.",
      })
  );

  const onSubmit = async (values: z.infer<typeof createSchema>) =>
    pipe(
      values.id,
      O.fromNullable,
      O.map(cleanString),
      O.getOrElse(v4),
      (rawId) =>
        pipe(
          createChatTE(rawId, values.title),
          TE.map(({ adminToken }) => {
            Cookies.set("adminToken", adminToken, { expires: 1 });
            navigate(`/admin/${rawId}`, { replace: true });
          })
        )
    );

  return (
    <Card className="max-w-lg w-full">
      <CardHeader>
        <CardTitle>Vytvoření chatu</CardTitle>
      </CardHeader>
      <Form {...createForm}>
        <form onSubmit={createForm.handleSubmit(onSubmit)}>
          <CardContent className="space-y-2">
            <FormField
              control={createForm.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel
                    htmlFor="title"
                    className="flex items-center gap-2"
                  >
                    Název (nepovinné)
                    <FormHelp>
                      Název, který bude reprezentovat váš chat, např. Rozhovor s
                      Janem Novotným
                    </FormHelp>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="id"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel htmlFor="id" className="flex items-center gap-2">
                    Vlastní adresa (nepovinné)
                    <FormHelp>
                      Adresa/ID chatu, kterou zadávají diváci, když se připojují
                      do chatu, např. jan-novotny. Když nezadáte, bude
                      vygenerována automaticky.
                    </FormHelp>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Vytvořit
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default Home;
