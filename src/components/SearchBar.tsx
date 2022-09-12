import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
} from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import Link from "next/link";

const searchClient = instantMeiliSearch(
  process.env.NEXT_PUBLIC_MEILI_URL as string,
  process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY as string,
  {
    paginationTotalHits: 5, // default: 200.
    placeholderSearch: false, // default: true.
    primaryKey: "id", // default: undefined
  }
);

const SearchBar = () => (
  <InstantSearch indexName="repos_1k_plus" searchClient={searchClient}>
    <SearchBox autoFocus />
    <Hits hitComponent={Hit} />
  </InstantSearch>
);

const Hit = ({ hit }: any) => (
  <Link className="cursor-pointer" href={`/analyze/${hit.full_name}`}>
    <a>
      <Highlight attribute="full_name" hit={hit} />
    </a>
  </Link>
);

export default SearchBar;
