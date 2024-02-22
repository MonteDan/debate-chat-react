import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

function Help() {
  return (
    <Dialog>
      <DialogTrigger>
        <HelpCircle className="text-muted-foreground"></HelpCircle>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <h2>Nápověda</h2>

        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-scroll">
          <h4>K čemu aplikace slouží</h4>
          <p className="text-foreground/80">
            Debatní chat pomáhá moderátorům rozhovorů, debat nebo podcastů
            zapojit diváky do diskuze.
          </p>
          <h4>Jak používat Debatní chat?</h4>
          <ul className="text-foreground/80">
            <li className="py-1">
              <p className="text-foreground/80">
                <strong>Divák</strong> se připojí do chatu na úvodní stránce
                zadáním adresy chatu. Alternativně může divák jít na stránku
                <code>debatnichat.online/chat/ADRESA123</code>, kde{" "}
                <code>ADRESA123</code> je adresa chatu. Dále má divák možnost
                sken QR kódu vedoucího na tuto stránku, pokud ho moderátor
                poskytl.
              </p>

              <p className="text-foreground/80">
                V průběhu akce divák zadává své názory do pole pro zprávy, které
                tlačítkem ODESLAT pošle moderátorovi.
              </p>
            </li>
            <li className="py-1">
              <p className="text-foreground/80">
                <strong>Moderátor</strong> se přihlásí ke svému účtu a na úvodní
                stránce zvolí možnost VYTVOŘIT CHAT. Při vytváření chatu může
                moderátor nastavit název chatu, a vlastní adresu. Vlastní adresa
                může být užitečná pro jednoduché sdílení odkazu na místnost,
                např. moderátor zvolí adresu jako <code>123</code>, pak bude
                chat dostupný na
                <code>debatnichat.online/chat/123</code>
              </p>

              <p className="text-foreground/80">
                V průběhu akce budou moderátorovi na obrazovce naskakovat dotazy
                a připomínky publika, které si může různě označovat a mazat.
              </p>
            </li>
          </ul>
          <h4>Moderátor - použití souborů cookies</h4>
          <span>
            <p className="text-foreground/80">
              Tato aplikace používá soubory cookies k zajištění správné
              funkčnosti přihlášení uživatele. Přihlášení je nutné pro použití
              aplikace z pozice moderátora (zakládání chatů, moderování chatů,
              atd.)
            </p>
            <p className="text-foreground/80">
              Souhlas s použitím souborů cookies je tázán při prvním přihlášení
              a je nutný pro použití aplikace z pozice moderátora. Bez cookies
              je aplikace povolena používat pouze z role diváka.
            </p>
          </span>
        </div>
        <div className="text-right">
          <DialogClose
            className={`${buttonVariants({ variant: "default" })} w-min`}
          >
            Rozumím
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Help;
