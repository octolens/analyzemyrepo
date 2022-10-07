import Tooltip from "../Tooltip/Tooltip";

const SmallCardTooltip = ({
  text,
  tip,
  width = "w-36",
  height = "h-8",
}: {
  text: string;
  width?: string;
  height?: string;
  tip: React.ReactElement;
}) => {
  return (
    <div
      className={`rounded-lg ${width} ${height} bg-white border boder-solid border-black px-2 grid grid-cols-[1fr_auto] items-center`}
    >
      <p className="align-middle">{text}</p>
      <div className="flex items-center">
        <Tooltip tip={tip} position_priority={"right"} />
      </div>
    </div>
  );
};

export default SmallCardTooltip;
