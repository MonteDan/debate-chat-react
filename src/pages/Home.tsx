import Join from "@/components/Join";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col gap-16 w-full max-w-lg">
      <div className="flex flex-col gap-1.5">
        <Join />
      </div>

      <Separator className="w-full"></Separator>

      <Link to="/create" className={buttonVariants({ variant: "ghost" })}>
        <Plus className="mr-3"></Plus> Vytvořit Chat
      </Link>
    </div>
  );
}

export default Home;
