import Head from "next/head";
import Header from "../../components/Headers/NewHeaderSecondary";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RadarSkeleton } from "../../components/Overview/RadarChart";
import Image from "next/image";
import Link from "next/link";
import { Footer, EmailForm } from "../../components/Footer/Footer";

const Home = () => {
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

  const host = process.env.NEXT_PUBLIC_VERCEL_URL
    ? "https://" + process.env.NEXT_PUBLIC_GLOBAL_URL
    : "http://localhost:3000";

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
        <title>Collections of GitHub repos | analyzemyrepo.com</title>
        <meta name="description" content="Collections of GitHub repos" />
        <meta
          name="og:url"
          content={`${host}/collections/fastest-growing-weekly`}
        />
        <meta name="og:type" content="website" />
        <meta
          name="og:title"
          content={`Collections of GitHub repos | analyzemyrepo.com`}
        />
        <meta name="og:description" content={`Collections of GitHub repos`} />
        <meta
          name="og:image"
          content={`${host}/api/og_collections?text=${encodeURIComponent(
            `Collections of GitHub repos`
          )}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CrowdDotDev" />o
        <meta
          name="twitter:title"
          content={`Collections of GitHub repos | analyzemyrepo.com`}
        />
        <meta
          name="twitter:description"
          content={`Collections of GitHub repos`}
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-neutral">
        <Header />
        <main className="container mx-auto flex flex-col items-center p-12 pt-28 flex-grow max-w-screen-xl">
          <h1 className="text-center mb-4 text-4xl font-bold tracking-tight text-gray-900 lg:font-extrabold lg:text-6xl lg:leading-none dark:text-white lg:text-center xl:px-36 lg:mb-7">
            Collections of GitHub repos
          </h1>
          <h2 className="text-center mb-10 text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-center lg:text-xl xl:px-60 md:whitespace-nowrap">
            Amazing collections of GitHub repos grouped by topics, languages,
            technologies and more.
          </h2>
        </main>
        <EmailForm />
        <Footer />
      </div>
    </>
  );
};

export default Home;
