import { FC } from "react";
import * as QR from "react-qrbtf";

interface Props {
  value: string;
  title?: string;
  className?: string;
}

const QRCode: FC<Props> = ({ value, title, className }) => {
  return (
    <QR.QRFunc
      className={className}
      value={value}
      posType="roundRect"
      type="round"
      title={title}
      icon="https://debatnichat.online/favicon.svg"
      iconScale={0.25}
      posColor="hsl(var(--foreground))"
    />
  );
};

export default QRCode;
