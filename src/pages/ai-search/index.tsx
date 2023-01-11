import { trpc } from "../../utils/trpc";
import type { EmbeddingSearchResult } from "../../server/router/embeddings";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GrStar } from "react-icons/gr";
import Header from "../../components/Headers/NewHeaderSecondary";

const RepoCard = ({ repo }: { repo: EmbeddingSearchResult }) => {
  const owner = repo.full_name.split("/")[0];
  const avatar = `https://github.com/${owner}.png`;
  return (
    <Link href={`/analyze/${repo.full_name}`}>
      <div className="flex flex-col gap-2 items-center w-80 h-48 p-4 bg-white shadow-lg rounded-sm">
        <div className="flex flex-row gap-2 items-center">
          <Image
            src={avatar}
            alt="repo"
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
          />
          <p className="text-xl text-ellipsis line-clamp-1">{repo.full_name}</p>
        </div>
        <p className="text-gray-500 text-ellipsis line-clamp-3 flex-1">
          {repo.description}
        </p>
        <div className="flex flex-row items-center">
          <GrStar size={20} />
          <p className="text-gray-500">{repo.stargazers_count}</p>
        </div>
      </div>
    </Link>
  );
};

const SearchPage = () => {
  const search = trpc.useMutation("embeddings.search");
  const [query, setQuery] = useState<string>("");

  return (
    <div className="flex flex-col justify-center align-middle">
      <Header />
      <h1 className="text-center font-extrabold text-5xl pb-4 pt-48">
        Search GitHub repos using AI
      </h1>
      <div className="flex flex-col gap-2 items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="AI powered search for GitHub repos"
          className="w-96 focus:ring-primary focus:border-primary block shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        <div className="flex flex-row gap-2">
          <button
            disabled={search.isLoading}
            onClick={async () => await search.mutateAsync({ query })}
            className="bg-primary text-black w-20 rounded-sm"
          >
            Search
          </button>
          <button
            disabled={search.isLoading}
            onClick={() => search.reset()}
            className="w-20 rounded-sm bg-black text-white"
          >
            Reset
          </button>
        </div>
        <div className="flex py-4">
          {search.isLoading && "Loading..."}
          {search.isSuccess && (
            <div className="grid grid-cols-2 gap-2">
              {search.data.map((repo) => (
                <RepoCard repo={repo} />
              ))}
            </div>
          )}
          {search.isError && search.error.message}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
