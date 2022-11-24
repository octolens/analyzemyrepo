import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Headers/NewHeader";
import SearchBar from "../components/SearchBar/SearchBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RadarSkeleton } from "../components/Overview/RadarChart";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.includes("/analyze")) {
        setIsLoading(true);
      }
    };

    const handleRouteComplete = (url: string) => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="w-96 h-96 animate-bounce mx-auto">
          <RadarSkeleton />
        </div>
        <p className="text-center text-xl text-primary">
          Analyzing your repo<span className="">...</span>
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>analyzemyrepo.com | Community Insights for GitHub repos</title>
        <meta
          name="description"
          content="Discover usefull insights about your repo"
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-neutral">
        <Header />
        <main className="container mx-auto flex flex-col items-center p-12 flex-grow max-w-screen-xl">
          <h1 className="text-[1.5rem] md:text-[3rem] leading-normal font-extrabold text-black text-center">
            <span className="text-primary">Community insights</span> for GitHub
            repos
          </h1>
          <h2 className="text-[1rem] md:text-[2rem] leading-normal text-black py-3 text-center">
            A free tool to understand &amp; grow your open-source project
          </h2>
          <div className="flex w-full">
            <div className="mx-auto pt-36 flex flex-col w-4/5 md:w-1/2">
              <SearchBar />
              <p className="hidden md:block text-center pt-2 text-gray-500">
                For repos with less than 1000 stars, please insert the name in
                the format <b>organization/repo</b>
              </p>
            </div>
          </div>
        </main>
        <footer className="flex justify-center mb-2 flex-wrap">
          powered by&nbsp;
          <a href="https://crowd.dev" className="text-primary">
            crowd.dev
          </a>
          <span className="hidden md:block">
            &nbsp;&mdash;&nbsp;the community-led growth platform for devtools
          </span>
        </footer>
      </div>
    </>
  );
};

export default Home;
