import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import pb from "@/lib/pb";
import { padAndCut } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const onSubmit = async (values: z.infer<typeof joinSchema>) => {
    try {
      await pb.collection("chats")
        .getOne(padAndCut(values.id), { fields: "id" })
        .then(() => {
          navigate(`/chat/${values.id}`);
        });
    } catch (e) {
      joinForm.setError("id", {
        type: "manual",
        message: "Chat neexistuje",
      });
    }
  };

  return (
    <Form {...joinForm}>
      <form
        onSubmit={joinForm.handleSubmit(onSubmit)}
        className="flex gap-2"
      >
        <FormField
          control={joinForm.control}
          name="id"
          render={({ field }) => (
            <FormItem className="space-y-0 w-full">
              <FormLabel htmlFor="id">
                Zadejte adresu a připojte se jako divák
              </FormLabel>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="Adresa chatu"
                  {...field}
                />
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" className='mt-6'>
          <LogIn className="mr-3" /> Vstoupit
        </Button>
      </form>
    </Form>
  );
}

export default Join;
