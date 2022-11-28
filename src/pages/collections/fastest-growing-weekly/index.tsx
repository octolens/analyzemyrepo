import Head from "next/head";
import Header from "../../../components/Headers/NewHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RadarSkeleton } from "../../../components/Overview/RadarChart";
import { prisma } from "../../../server/db/client";
import { InferGetStaticPropsType } from "next";
import Image from "next/image";

export async function getStaticProps() {
  const data =
    await prisma.github_repos_fastest_growing_weekly_by_stars.findMany({
      orderBy: {
        weekly_star_growth_rate: "desc",
      },
      take: 100,
      select: {
        full_name: true,
        this_week_stars: true,
        last_week_stars: true,
        weekly_star_growth_rate: true,
      },
    });

  const dates =
    await prisma.github_repos_fastest_growing_weekly_by_stars.findFirst();
  const this_week = dates?.this_week_parsed_at;
  const last_week = dates?.last_week_parsed_at;
  return {
    props: {
      data: data,
      this_week: this_week?.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      }),
      last_week: last_week?.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      }),
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
}

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
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
        <title>
          analyzemyrepo.com | Fastest growing repos on GitHub last week
        </title>
        <meta
          name="description"
          content="Fastest growing repos on GitHub last week"
        />
        <meta
          name="og:url"
          content={`${host}/collections/fastest-growing-weekly`}
        />
        <meta name="og:type" content="website" />
        <meta
          name="og:title"
          content={`analyzemyrepo.com | Fastest growing repos on GitHub last week`}
        />
        <meta
          name="og:description"
          content={`Fastest growing repos on GitHub last week`}
        />
        <meta
          name="og:image"
          content={`${host}/api/og_collections?text=${encodeURIComponent(
            `Fastest growing repos on GitHub last week`
          )}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CrowdDotDev" />
        <meta
          name="twitter:title"
          content={`analyzemyrepo.com | Fastest growing repos on GitHub last week`}
        />
        <meta
          name="twitter:description"
          content={`Fastest growing repos on GitHub last week`}
        />
        <meta
          name="twitter:image"
          content={`${host}/api/og_collections?text=${encodeURIComponent(
            `Fastest growing repos on GitHub last week`
          )}`}
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-neutral">
        <Header />
        <main className="container mx-auto flex flex-col items-center p-12 pt-28 flex-grow max-w-screen-xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 lg:font-extrabold lg:text-6xl lg:leading-none dark:text-white lg:text-center xl:px-36 lg:mb-7">
            The fastest growing repos on GitHub last week
          </h1>
          <p className="mb-10 text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-center lg:text-xl xl:px-60">
            Top 100 fastest growing repos on GitHub with 1000+ stars from{" "}
            {props.last_week} to {props.this_week}. Updated every week.
          </p>
          <FastestGrowingRepos props={props} />
        </main>
        <footer className="flex justify-center mb-2 flex-wrap">
          powered by&nbsp;
          <a href="https://crowd.dev" className="text-primary">
            crowd.dev
          </a>
          <span className="hidden md:block">
            &nbsp;&mdash;&nbsp;the community-led growth platform for devtools 🚀
          </span>
        </footer>
      </div>
    </>
  );
};

export default Home;

const FastestGrowingRepos = ({
  props,
}: {
  props: InferGetStaticPropsType<typeof getStaticProps>;
}) => {
  const router = useRouter();
  return (
    <div
      className="overflow-x-auto relative shadow-md sm:rounded-lg"
      id="fastest-growing-section"
    >
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-white bg-primary/90 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6 text-lg">
              #
            </th>
            <th scope="col" className="py-3 px-6">
              Repo
            </th>
            <th scope="col" className="py-3 px-6">
              Stars
            </th>
            <th scope="col" className="py-3 px-6">
              Growth
            </th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((repo, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              key={repo.full_name}
              onClick={() => router.push(`/analyze/${repo.full_name}`)}
            >
              <td>
                <div className="flex items-center py-3 px-6">
                  <span className="font-medium">{index + 1}</span>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white"
              >
                <Image
                  className="w-10 h-10 rounded-full"
                  src={`https://github.com/${repo.full_name.split("/")[0]}.png`}
                  alt="Repo Image"
                  priority={true}
                  loading="eager"
                  width={40}
                  height={40}
                />
                <div className="pl-3">
                  <div className="text-base font-semibold">
                    {repo.full_name}
                  </div>
                </div>
              </th>
              <td className="py-4 px-6">
                {repo.this_week_stars.toLocaleString()}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center">
                  {repo.weekly_star_growth_rate.toPrecision(3)}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
