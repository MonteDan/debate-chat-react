import { FC } from "react";
import * as QR from "react-qrbtf";

interface Props {
  value: string;
}

const QRCode: FC<Props> = ({ value }) => {
  return (
    <div className="flex items-center justify-center overflow-hidden h-full w-full">
      <QR.QRFunc
        className=" object-cover object-center scale-[1.3] "
        value={value}
        posType="roundRect"
        type="round"
        icon="https://debatnichat.online/favicon.svg"
        iconScale={0.25}
      />
    </div>
  );
};

export default QRCode;
