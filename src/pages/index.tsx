import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar/SearchBar";

const Home: NextPage = () => {
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

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="container mx-auto flex flex-col items-center p-4 flex-grow">
          <h1 className="text-[2rem] md:text-[3rem] leading-normal font-extrabold text-neutral text-center">
            Community Insights for <span className="text-primary">GitHub</span>{" "}
            repos
          </h1>
          <h2 className="text-[1.5rem] md:text-[2rem] leading-normal text-neutral py-2.5 text-center">
            Free tool to grow your open-source project
          </h2>
          <div className="flex w-full">
            <div className="mx-auto pt-36 flex flex-col w-1/2">
              <SearchBar />
            </div>
          </div>
        </main>

        <footer className="flex justify-center mb-2">
          powered by&nbsp;
          <a href="https://crowd.dev" className="text-primary">
            crowd.dev
          </a>
        </footer>
      </div>
    </>
  );
};

export default Home;
