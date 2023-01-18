import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar/SideBar";
import Image from "next/image";
import HeaderSecondary from "../../../components/Headers/NewHeaderSecondary";
import GeoSection from "../../../components/Geo/Geo";
import {
  GoLinkExternal,
  GoGraph,
  GoGlobe,
  GoRocket,
  GoLaw,
  GoKeyboard,
} from "react-icons/go";
import { GrOverview } from "react-icons/gr";
import { MdChecklist } from "react-icons/md";
import ContributionSection from "../../../components/Contribution/Contribution";
import CompletenessSection from "../../../components/Completeness/Completeness";
import ErrorBoundary from "../../../components/Errors/ErrorBoundary";
import OverviewSection from "../../../components/Overview/NewOverview";
import AdoptionSection from "../../../components/Adoption/Adoption";
import { createSSGHelpers } from "@trpc/react/ssg";
import {
  GetStaticPropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import { appRouter } from "../../../server/router";
import superjson from "superjson";
import { createContextInner } from "../../../server/router/context";
import Head from "next/head";
import { useEffect, useState } from "react";
import { RadarSkeleton } from "../../../components/Overview/RadarChart";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";

export async function getStaticProps(
  context: GetStaticPropsContext<{ org_name: string; repo_name: string }>
) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });
  const org_name = context.params?.org_name as string;
  const repo_name = context.params?.repo_name as string;

  await ssg.prefetchQuery("postgres.get_repo_rank", {
    owner: org_name as string,
    repo: repo_name as string,
  });

  await ssg.prefetchQuery("github.get_github_repo", {
    owner: org_name as string,
    repo: repo_name as string,
  });

  await ssg.prefetchQuery("github.get_github_repo_contributors", {
    owner: org_name as string,
    repo: repo_name as string,
  });

  await ssg.prefetchQuery("postgres.get_serious_contributors", {
    owner: org_name as string,
    repo: repo_name as string,
  });

  await ssg.prefetchQuery("github.get_contributions_count", {
    owner: org_name as string,
    repo: repo_name as string,
  });

  await ssg.prefetchQuery("postgres.get_repo_contributors_countries", {
    owner: org_name as string,
    repo: repo_name as string,
  });

  await ssg.prefetchQuery("postgres.get_repo_contributors_companies", {
    owner: org_name as string,
    repo: repo_name as string,
  });

  await ssg.prefetchQuery("github.get_community_health", {
    owner: org_name as string,
    repo: repo_name as string,
  });

  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      org_name,
      repo_name,
    },
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true };
};

const RepoPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const repo = trpc.useQuery([
    "github.get_github_repo",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const full_name = org_name + "/" + repo_name;
  const host = process.env.NEXT_PUBLIC_VERCEL_URL
    ? "https://" + process.env.NEXT_PUBLIC_GLOBAL_URL
    : "http://localhost:3000";

  const [isLoading, setIsLoading] = useState(false);
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
        <title>
          {org_name} Insights | Analyze the GitHub repository{" "}
          {`${org_name}/${repo_name}`}
        </title>
        <meta
          name="title"
          content={`${org_name} Insights | Analyze the GitHub repository ${org_name}/${repo_name}`}
        />
        <meta
          name="description"
          content={`Insights and analytics about the GitHub repository ${org_name}/${repo_name}. ${
            repo?.data?.description || ""
          }`}
        />
        <meta
          name="og:url"
          content={`${host}/analyze/${org_name}${repo_name}`}
        />
        <meta name="og:type" content="website" />
        <meta
          name="og:title"
          content={`${org_name} Insights | Analyze the GitHub repository ${org_name}/${repo_name}`}
        />
        <meta
          name="og:description"
          content={`Insights and analytics about the GitHub repository ${org_name}/${repo_name}. ${
            repo?.data?.description || ""
          }`}
        />
        <meta
          name="og:image"
          content={`${host}/api/og_whole_page?org_name=${org_name}&repo_name=${repo_name}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CrowdDotDev" />
        <meta
          name="twitter:title"
          content={`${org_name} Insights | Analyze the GitHub repository ${org_name}/${repo_name}`}
        />
        <meta
          name="twitter:description"
          content={`Insights and analytics about the GitHub repository ${org_name}/${repo_name}. ${
            repo?.data?.description || ""
          }`}
        />
        <meta
          name="twitter:image"
          content={`${host}/api/og_whole_page?org_name=${org_name}&repo_name=${repo_name}`}
        />
      </Head>
      <div className="min-h-screen flex flex-col bg-neutral">
        <HeaderSecondary />
        <ErrorBoundary>
          <main className="container mx-auto p-4 flex max-w-screen-xl">
            <div className="container mx-auto flex flex-col">
              <div className="flex flex-col lg:grid lg:grid-cols-[256px_auto] lg:grid-rows-[256px-auto] lg:gap-y-4">
                <div className="hidden lg:block lg:row-start-2">
                  <Sidebar
                    sections={[
                      { section_name: "Overview", logo: <GrOverview /> },
                      { section_name: "Adoption", logo: <GoRocket /> },
                      {
                        section_name: "Contribution",
                        logo: <GoGraph />,
                      },
                      {
                        section_name: "Diversity",
                        logo: <GoGlobe />,
                      },
                      {
                        section_name: "Governance",
                        logo: <MdChecklist />,
                      },
                      // { section_name: "More Insights", logo: <MdInsights /> },
                    ]}
                  />
                </div>
                <div className="lg:row-start-1 lg:row-span-1 lg:col-start-2 lg:col-span-1 container w-full mx-auto px-4 flex flex-col gap-4 pb-2 pt-3">
                  <h1 className="self-center text-xl lg:text-2xl font-semibold text-center">
                    Analyze{" "}
                    <Link
                      href={`https://github.com/${full_name}`}
                      rel="noopener"
                      target="_blank"
                      className="underline underline-offset-4 hover:text-primary inline-flex items-center gap-2"
                    >
                      <span className="truncate max-w-xs lg:max-w-md">
                        {full_name}
                      </span>
                      <GoLinkExternal className="mt-2 hover:fill-primary" />
                    </Link>
                  </h1>
                  <RepoDescription full_name={full_name} />
                </div>
                <div className="container w-full mx-auto px-4 row-start-2">
                  <div
                    id="sections"
                    className="container mx-auto flex flex-col gap-2"
                  >
                    <OverviewSection />
                    <AdoptionSection />
                    <ContributionSection section_id="Contribution" />
                    <GeoSection section_id="Diversity" />
                    <CompletenessSection section_id="Governance" />
                    <footer className="flex justify-center my-4">
                      powered by&nbsp;
                      <a href="https://crowd.dev" className="text-primary">
                        crowd.dev
                      </a>
                      <span className="hidden md:block">
                        &nbsp;&mdash;&nbsp;the community-led growth platform for
                        devtools 🚀
                      </span>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
            <div id="modal"></div>
          </main>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default RepoPage;

const RepoDescription = ({ full_name }: { full_name: string }) => {
  const org_name = full_name.split("/")[0];
  const repo_name = full_name.split("/")[1];
  const repo = trpc.useQuery([
    "github.get_github_repo",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  if (repo.isLoading) {
    return (
      <div className="w-full h-28 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  return (
    <section className="lg:h-fit" id="repo-description">
      <div className="flex flex-col md:grid md:grid-cols-2 gap-2 max-w-full px-4 py-5 bg-white rounded-lg shadow mx-auto mt-4">
        <div className="flex flex-col self-center">
          <div className="flex flex-row items-center gap-2">
            <span className="flex items-center">
              <Image
                src={`https://github.com/${org_name}.png`}
                width="50"
                height="50"
                alt={full_name}
                priority={true}
                className="rounded-full"
              />
            </span>
            <span className="text-lg font-bold truncate max-w-[250px] lg:max-w-md">
              {repo_name}
            </span>
          </div>
          <span className="text-gray-700 max-w-[250px] lg:max-w-[400px] mt-2 break-words">
            {repo.data?.description || "No description"}
          </span>
        </div>
        <div>
          <div className="flex">
            <div className="flex flex-col gap-2">
              <div className="text-gray-700 max-w-xs lg:max-w-[400px] flex flex-wrap gap-2">
                {repo.data?.topics?.length > 0
                  ? repo.data?.topics?.slice(0, 10).map((topic: string) => (
                      <Link href={`/topics/${topic}`}>
                        <span
                          className="px-2 bg-primary/10 rounded-lg max-w-xs lg:max-w-[400px] break-words hover:underline"
                          key={`${full_name}-${topic}`}
                        >
                          {topic}
                        </span>
                      </Link>
                    ))
                  : "No topics"}
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-row gap-2">
                  <span className="text-gray-900 self-center">
                    <GoKeyboard size={20} />
                  </span>
                  <span className="text-gray-700">
                    {repo.data?.language || "N/A"}
                  </span>
                </div>

                <div className="flex flex-row gap-2">
                  <span className="text-gray-900">
                    <GoLaw size={20} />
                  </span>
                  <span className="text-gray-700">
                    {repo.data?.license?.name || "No license"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
