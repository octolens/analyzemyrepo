import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Headers/NewHeader";
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

      <div className="min-h-screen flex flex-col bg-neutral">
        <Header />

        <main className="container mx-auto flex flex-col items-center p-12 flex-grow max-w-screen-xl">
          <h1 className="text-[1.5rem] md:text-[3rem] leading-normal font-extrabold text-black text-center">
            <span className="text-primary">Community insights</span> for Github
            repos
          </h1>
          <h2 className="text-[1rem] md:text-[2rem] leading-normal text-black py-3 text-center">
            A free tool to understand &amp; grow your open-source project
          </h2>
          <div className="flex w-full">
            <div className="mx-auto pt-36 flex flex-col w-1/2">
              <SearchBar />
              <p className="text-center pt-2 text-gray-500">
                For repos with less than 1000 stars, please insert the name in
                the format <b>organization/repo</b>
              </p>
            </div>
          </div>
        </main>

        <footer className="flex justify-center mb-2">
          powered by&nbsp;
          <a href="https://crowd.dev" className="text-primary">
            crowd.dev
          </a>
          &nbsp;&mdash;&nbsp;the community-led developer growth engine
        </footer>
      </div>
    </>
  );
};

export default Home;
