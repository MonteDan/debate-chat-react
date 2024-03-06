import { FC } from "react";
import * as QR from "react-qrbtf";

interface Props {
  value: string;
  title?: string;
  className?: string;
}

const QRCode: FC<Props> = ({ value, className }) => {
  return (
    <div className="flex items-center justify-center overflow-hidden h-full w-full">
      <QR.QRFunc
        className={"object-cover object-center scale-125 " + className}
        value={value}
        posType="roundRect"
        type="round"
        icon="https://debatnichat.online/favicon.svg"
        iconScale={0.25}
        posColor="hsl(var(--foreground))"
      />
    </div>
  );
};

export default QRCode;
