import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";}

function Home() {
  return (
    <div className="flex flex-col gap-16 w-full max-w-lg">
      <div className="flex flex-col gap-1.5">
        <Label for="id">Zadejte adresu a připojte se jako divák</Label>
        <form className="flex gap-2">
          <Input
            type="text"
            name="id"
            className="w-full"
            placeholder="Adresa chatu"
            // value={$form.id}
          />

          <Button type="submit">
            <LogIn className="mr-3"></LogIn> Vstoupit
          </Button>
        </form>
        {/* {#if $errors.id}
			<p className="text-destructive">{$errors.id}</p>
		{/if} */}
      </div>

      <Separator className="w-full"></Separator>

      <Button variant="ghost" href="/create">
        <Plus className="mr-3"></Plus> Vytvořit Chat
      </Button>
    </div>
  );
}

export default Home;
