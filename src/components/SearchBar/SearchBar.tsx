import { InstantSearch } from "react-instantsearch-dom";
import searchClient from "./searchclient";
import SearchBox from "./SearchBox";
import Hits from "./Hits";

const SearchBar = () => {
  return (
    <InstantSearch indexName="repos_1k_plus" searchClient={searchClient}>
      <SearchBox />
      <Hits />
    </InstantSearch>
  );
};

export default SearchBar;
