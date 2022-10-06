import { MdSentimentNeutral, MdCancel, MdCheckCircle } from "react-icons/md";

const InsightCard = ({
  color,
  text,
  width = "w-64",
  height = "h-8",
  size = 20,
}: {
  color: "positive" | "negative" | "neutral";
  text: string;
  width?: string;
  height?: string;
  size?: number;
}) => {
  const color_dict = {
    positive: "bg-green-200",
    negative: "bg-red-200",
    neutral: "bg-gray-200",
  };
  return (
    <div
      className={`rounded-lg ${width} ${height} border boder-solid border-black px-2 flex flex-row items-center ${color_dict[color]} justify-evenly gap-2`}
    >
      <p className="align-middle text-center">{text}</p>
      <div className="flex">
        {color == "negative" ? (
          <MdCancel color="red" size={size} />
        ) : color == "positive" ? (
          <MdCheckCircle color="green" size={size} />
        ) : (
          <MdSentimentNeutral size={size} />
        )}
      </div>
    </div>
  );
};

export default InsightCard;
