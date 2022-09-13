import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

const searchClient = instantMeiliSearch(
  process.env.NEXT_PUBLIC_MEILI_URL as string,
  process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY as string,
  {
    paginationTotalHits: 5, // default: 200.
    placeholderSearch: false, // default: true.
    primaryKey: "id", // default: undefined
  }
);

export default searchClient;
