import { connectHits } from "react-instantsearch-dom";
import Link from "next/link";
import Highlight from "./Highlight";

const CustomHits = ({ hits }: any) => (
  <ul className="mx-auto">
    {hits.map((hit: any) => (
      <li
        key={hit.objectID}
        className="card w-40 md:w-56 lg:w-72 xl:w-96 bg-base-200 py-2 my-2 first:border-solid first:border-2 first:border-black"
      >
        <Link className="cursor-pointer" href={`/analyze/${hit.full_name}`}>
          <a className="mx-auto">
            <Highlight attribute="full_name" hit={hit} />
          </a>
        </Link>
      </li>
    ))}
  </ul>
);

const Hits = connectHits(CustomHits);

export default Hits;
