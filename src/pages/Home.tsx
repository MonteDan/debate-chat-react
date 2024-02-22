import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {Link} from 'react-router-dom';

const joinSchema = z.object({
  id: z.string().min(1),
});

function Home() {
  const joinForm = useForm<z.infer<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
  });

  const onSubmit = (values: z.infer<typeof joinSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col gap-16 w-full max-w-lg">
      <div className="flex flex-col gap-1.5">
        <Form {...joinForm}>
          <form
            onSubmit={joinForm.handleSubmit(onSubmit)}
            className="flex items-end gap-2"
          >
            <FormField
              control={joinForm.control}
              name="id"
              render={({ field }) => (
                <FormItem className='space-y-0 w-full'>
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
                </FormItem>
              )}
            />

            <Button type="submit">
              <LogIn className="mr-3" /> Vstoupit
            </Button>
          </form>
        </Form>
        {/* {#if $errors.id}
			<p className="text-destructive">{$errors.id}</p>
		{/if} */}
      </div>

      <Separator className="w-full"></Separator>

      <Link to="/create" className={buttonVariants({ variant: "ghost" })}>
        <Plus className="mr-3"></Plus> Vytvořit Chat
      </Link>
    </div>
  );
}

export default Home;
