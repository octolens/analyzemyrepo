import { trpc } from "../../utils/trpc";
import type { EmbeddingSearchResult } from "../../server/router/embeddings";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GrStar } from "react-icons/gr";
import { HiOutlineThumbUp, HiOutlineThumbDown } from "react-icons/hi";
import Header from "../../components/Headers/NewHeaderSecondary";
import { Footer, EmailForm } from "../../components/Footer/Footer";

const EXAMPLE_QUERIES = [
  "game engines written in rust",
  "python fullstack apps framework",
  "best tools for removing background from images",
  "js web frameworks",
  "low code platforms for internal tools",
  "auth for next.js",
  "tools to build Figma-like multiplayer apps",
  "community building platform",
];

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
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [showVote, setShowVote] = useState<boolean>(true);

  const save_vote = trpc.useMutation("embeddings.vote");

  const processVote = async () => {
    // vote changed, we can save the result
    if (vote == null) return;
    setShowVote(false);
    await save_vote.mutateAsync({ query, vote });
    setVote(null);
  };

  useEffect(() => {
    processVote();
  }, [vote]);

  useEffect(() => {
    if (search.isError) {
      setShowVote(false);
    } else {
      setShowVote(true);
    }
  }, [search.status]);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center">
        <div className="flex flex-col justify-center align-middle min-h-screen">
          <div className="flex-1">
            <h1 className="text-center font-extrabold text-5xl pb-4 pt-28">
              Search GitHub repos using AI
            </h1>
            <h2 className="text-center font-semibold text-3xl pb-4">
              Examples of queries
            </h2>
            <div className="text-gray-700 max-w-xs lg:max-w-[800px] flex flex-wrap justify-center gap-2 self-center pb-4">
              {EXAMPLE_QUERIES.map((query) => (
                <span
                  className="px-2 bg-primary/10 rounded-lg max-w-xs lg:max-w-[400px] break-words cursor-pointer text-center"
                  key={query}
                  onClick={() => setQuery(query)}
                >
                  {query}
                </span>
              ))}
            </div>
            <div className="flex flex-row gap-2 items-center justify-center">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="AI powered search for GitHub repos"
                className="w-52 md:w-96 focus:ring-primary focus:border-primary block shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
              <div className="flex flex-row gap-2">
                <button
                  disabled={search.isLoading}
                  onClick={async () => await search.mutateAsync({ query })}
                  className="bg-primary text-white w-20 h-9 rounded-md hover:bg-primary/75"
                >
                  Search
                </button>
                <button
                  disabled={search.isLoading}
                  onClick={() => {
                    search.reset();
                    setQuery("");
                  }}
                  className="h-9 w-fit text-black hover:text-black/75"
                >
                  x
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center mt-2">
              {search.isLoading && "Loading..."}
              {search.isError &&
                "Something went wrong. Maybe the query is too short."}
            </div>
          </div>
          <div className="flex py-4 justify-center">
            {search.isSuccess && (
              <div className="flex flex-col">
                <div
                  className={`${
                    showVote ? "" : "hidden "
                  } flex self-center gap-1 items-center transition ease-in-out delay-150 duration-500`}
                >
                  <p>Do you like the result?</p>
                  <HiOutlineThumbUp
                    size={20}
                    className={`${
                      vote == "up" ? "bg-primary " : ""
                    } cursor-pointer`}
                    onClick={() => {
                      setVote("up");
                    }}
                  />
                  <HiOutlineThumbDown
                    size={20}
                    className={`${
                      vote == "down" ? "bg-primary " : ""
                    } cursor-pointer`}
                    onClick={() => {
                      setVote("down");
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-4">
                  {search.data.map((repo) => (
                    <RepoCard repo={repo} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <EmailForm />
      <Footer />
    </>
  );
};

export default SearchPage;
