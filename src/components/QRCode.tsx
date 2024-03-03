import { FC } from "react";
import * as QR from "react-qrbtf";

interface Props {
  value: string;
}

const QRCode: FC<Props> = ({ value }) => {
  return (
    <div>
      {/* <QR.QRNormal value={value}  iconScale={0.25} posColor="hsl(var(--foreground))"  /> */}
      <QR.QRFunc
        value={value}
        posType="roundRect"
        type="round"
        icon="https://debatnichat.online/favicon.svg"
        iconScale={0.25}
        posColor="hsl(var(--foreground))"
      />
      {/* <QR.QRLine value={value} posType="roundRect" direction="h-v" icon="http://localhost:5173/favicon.svg" iconScale={0.25} posColor="hsl(var(--foreground))" />
      <QR.QRLine value={value} posType="roundRect" direction="loop" icon="http://localhost:5173/favicon.svg" iconScale={0.25} posColor="hsl(var(--foreground))" />
      <QR.QRLine value={value} posType="roundRect" direction="topLeft-bottomRight" icon="http://localhost:5173/favicon.svg" iconScale={0.25} posColor="hsl(var(--foreground))" />
      <QR.QRLine value={value} posType="roundRect" direction="topRight-bottomLeft" icon="http://localhost:5173/favicon.svg" iconScale={0.25} posColor="hsl(var(--foreground))" /> */}
    </div>
  );
};

export default QRCode;
