import QRCode from "@/components/QRCode";
import QRPrintDialog from "@/components/QRPrintDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { toPng } from "html-to-image";
import { Download, QrCode } from "lucide-react";
import { FC } from "react";

type Props = {
  chatID: string;
};

const getScaleToWidth = <T extends HTMLElement>(
  element: T,
  targetWidth: number
) => targetWidth / element.getBoundingClientRect().width;
const toHighResImage = <T extends HTMLElement>(image: T) =>
  toPng(image, {
    style: { transform: `scale(${getScaleToWidth(image, 2000)})` },
  });

const QRDialog: FC<Props> = ({ chatID }) => {

  const downloadQrCode = () =>
    pipe(
      document.querySelector("#qrcode"),
      O.fromNullable,
      O.fold(
        () => TE.left(new Error("No QR code found")),
        (qr) =>
          TE.tryCatch(
            () => toHighResImage(qr as HTMLElement),
            () => new Error("Conversion to PNG format failed.")
          )
      ),
      TE.chain((dataUrl) =>
        TE.tryCatch(
          () => {
            const link = document.createElement("a");
            link.download = `QR-debatnichat-${chatID}.png`;
            link.href = dataUrl;
            link.click();
            return Promise.resolve();
          },
          () => new Error("Failed to download QR code PNG")
        )
      ),
      TE.fold(
        (error) => T.fromIO(() => console.log(error.message)),
        () => T.fromIO(() => undefined)
      )
    );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-auto h-auto p-2">
          <QrCode size={40} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vmin] max-h-[90vmin] flex flex-col items-center">
        <div id="qrcode" className="text-center ">
          <QRCode
            value={"debatnichat.online/chat/" + chatID}
            title={"debatnichat.online/chat/" + chatID}
            className=""
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={downloadQrCode} variant="outline" type="submit">
            <Download></Download>
          </Button>
          <QRPrintDialog
          chatID={chatID}
            // onPrint={(imagesPerA4) =>
            //   navigate(`/print/${chatID}/${imagesPerA4}`, {replace:false})
            // }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRDialog;
