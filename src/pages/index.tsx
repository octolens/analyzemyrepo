import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Community Insights for GitHub repos</title>
        <meta
          name="description"
          content="Discover usefull insights about your repo"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto flex flex-col items-center p-4">
        <h1 className="text-[3rem] leading-normal font-extrabold text-neutral">
          Community Insights for <span className="text-primary">GitHub</span>{" "}
          repos
        </h1>
        <h2 className="text-[2rem] leading-normal text-neutral py-2.5">
          Free tool to grow your open-source project
        </h2>
        <div className="flex w-full">
          <div className="mx-auto pt-36 flex items-center justify-center flex-col">
            <SearchBar />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
