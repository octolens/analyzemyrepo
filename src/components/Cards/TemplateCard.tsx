const TemplateCard = ({
  width = "w-44",
  height = "h-6",
}: {
  width?: string;
  height?: string;
}) => {
  return (
    <div
      className={
        "rounded-lg bg-gray-200 animate-pulse" + " " + width + " " + height
      }
    ></div>
  );
};

export default TemplateCard;
