import { connectHighlight } from "react-instantsearch-dom";

const CustomHighlight = ({ highlight, attribute, hit }: any) => {
  const parsedHit = highlight({
    highlightProperty: "_highlightResult",
    attribute,
    hit,
  });

  return (
    <span className="block truncate md:w-80 w-40">
      {parsedHit.map((part: any, index: number) =>
        part.isHighlighted ? (
          // can be added mark to add hightlight
          <span key={index} className="truncate">
            {part.value}
          </span>
        ) : (
          <span key={index} className="truncate">
            {part.value}
          </span>
        )
      )}
    </span>
  );
};

const Highlight = connectHighlight(CustomHighlight);

export default Highlight;
