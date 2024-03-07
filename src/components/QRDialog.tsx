import QRCode from "@/components/QRCode";
import QRPrintDialog from "@/components/QRPrintDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { downloadQrCode } from "@/lib/utils";
import { Download, QrCode } from "lucide-react";
import { FC } from "react";

type Props = {
  chatID: string;
};

const QRDialog: FC<Props> = ({ chatID }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" className="w-auto h-auto p-2 ">
        <QrCode size={24} />
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-[90vmin] max-h-[90vmin] flex flex-col items-center">
      <div id="qrcode" className="text-center bg-white rounded-2xl">
        <QRCode value={"debatnichat.online/chat/" + chatID} />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => downloadQrCode(chatID)}
          variant="outline"
          type="submit"
        >
          <Download></Download>
        </Button>
        <QRPrintDialog chatID={chatID} />
      </div>
    </DialogContent>
  </Dialog>
);

export default QRDialog;
