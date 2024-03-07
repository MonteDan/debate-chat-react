import QRCode from "@/components/QRCode";
import { getColumns, getSizeInMm } from "@/lib/utils";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Print = () => {
  const { chat_id, images_per_a4 } = useParams();
  const imagesPerA4 = parseInt(images_per_a4 || "");

  const columns = getColumns(imagesPerA4);
  const sizeInMm = getSizeInMm(imagesPerA4);

  useEffect(() => {
    window.print();
  }, []);

  return (
    <div
      className="grid pl-2.5"
      style={{ gridTemplateColumns: "1fr ".repeat(columns) }}
    >
      {Array.from({ length: imagesPerA4 }, () => (
        <div style={{ width: `${sizeInMm}mm`, height: `${sizeInMm}mm` }}>
          <QRCode value={`debatnichat.online/chat/${chat_id}`} />
        </div>
      ))}
    </div>
  );
};

export default Print;
