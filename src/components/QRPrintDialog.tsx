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
import { Label } from "@/components/ui/label";
import { getSizeInMm, round } from "@/lib/utils";
import { flow } from "fp-ts/lib/function";
import { Printer } from "lucide-react";
import { FC, useEffect, useState } from "react";
import FormHelp from "./FormHelp";

type Props = {
  onPrint?: (imagesPerA4: number) => void;
  chatID: string;
};

const amountOptions = [1, 2, 6, 12, 15, 20];
const sizeOptions = amountOptions.map(
  flow(getSizeInMm, round(0), (n) => n / 10)
);

const QRPrintDialog: FC<Props> = ({ chatID }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imagesPerA4, setImagesPerA4] = useState(1);

  useEffect(
    () => setImagesPerA4(amountOptions[selectedIndex]),
    [selectedIndex]
  );

  const getClass = (i: number) => (selectedIndex === i ? "bg-accent" : "");

  // const dispatchPrint = () => {
  //   onPrint(imagesPerA4);
  // };

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
          <AlertDialogDescription className="pb-2">
            Zvolte, kolik QR kódů chcete vytisknout na jednu stránku formátu A4.
            Před tiskem se ujistěte, že tisknete na A4 a že máte vyplé okraje a
            odsazení.
          </AlertDialogDescription>
          <Label className="flex gap-2">
            Počet QR kódů na A4
            <FormHelp>
              Zvolte, kolik QR kódů chcete vytisknout na jednu stránku formátu
              A4. Navrhované možnosti kromě "1" jsou vybrány ekologicky pro
              efektivní spotřebu papíru. 
            </FormHelp>
          </Label>
          <div className="flex gap-2">
            {amountOptions.map((n, i) => (
              <Button
                onClick={() => setSelectedIndex(i)}
                variant="ghost"
                className={getClass(i)}
              >
                {n}
              </Button>
            ))}
          </div>
          <Label>Velikost jednotlivých QR kódů (cm)</Label>
          <div className="flex gap-2">
            {sizeOptions.map((n, i) => (
              <Button
                onClick={() => setSelectedIndex(i)}
                variant="ghost"
                className={getClass(i)}
              >
                {n}
              </Button>
            ))}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zrušit</AlertDialogCancel>
          <a target="_blank" href={`/print/${chatID}/${imagesPerA4}`}>
            <AlertDialogAction>Tisknout</AlertDialogAction>
          </a>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QRPrintDialog;
