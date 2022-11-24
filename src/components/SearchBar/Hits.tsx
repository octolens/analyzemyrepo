import { connectStateResults } from "react-instantsearch-dom";
import Link from "next/link";

const stringCheckerSlash = (string: string) => {
  const arr = string.split("/");
  if (arr.length === 2 && arr[0] !== "" && arr[1] !== "") {
    return true;
  }
  return false;
};

const CustomHits = ({ searchState, searchResults }: any) => {
  // add query as a hit in the beginning of the list
  let hits;
  if (
    searchResults &&
    searchResults.hits &&
    searchState.query &&
    stringCheckerSlash(searchState.query)
  ) {
    hits = [
      {
        full_name: `${searchState.query} - search`,
        objectID: searchState.query,
      },
      ...searchResults.hits,
    ];
  } else if (searchResults && searchResults.hits) {
    hits = searchResults.hits;
  } else {
    hits = [];
  }

  return (
    <div className={"dropdown" + (hits[0] ? " dropdown-open " : "")}>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 md:w-96"
        id="search-hits-ul"
      >
        {hits.map((hit: any) => (
          <li key={hit.objectID} className="search-hits first:font-extrabold">
            <Link className="cursor-pointer" href={`/analyze/${hit.full_name}`}>
              {hit.full_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Hits = connectStateResults(CustomHits);

export default Hits;
