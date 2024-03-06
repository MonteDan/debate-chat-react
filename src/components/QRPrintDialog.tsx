import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer } from "lucide-react";
import { useState } from "react";

const QRPrintDialog = () => {
  const [imagesPerA4, setImagesPerA4] = useState(1);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Printer></Printer>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Jak tisknout?</AlertDialogTitle>
          <AlertDialogDescription>
            Kliknutím vyberte, kolik QR kódů byste chtěl/a vytisknout na jednu
            A4. V tiskovém okně na následující straně se ujistěte, že máte vyplé
            odsazení a okraje – toto nastavení prohlížeče schovávají pod skupinu
            "Další nastavení". Tisknuta by měla být jen jedna strana, počet
            požadovaných kusů je nastavitelný v poli "Kopie".
          </AlertDialogDescription>
          {imagesPerA4}
          <Input
            type="number"
            onChange={(e) => console.log(e.target.value)}
          ></Input>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QRPrintDialog;
