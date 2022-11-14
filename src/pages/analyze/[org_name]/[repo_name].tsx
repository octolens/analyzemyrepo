import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar/SideBar";
import Image from "next/image";
import HeaderSecondary from "../../../components/Headers/NewHeaderSecondary";
import GeoSection from "../../../components/Geo/Geo";
import { GoLinkExternal, GoGraph, GoGlobe, GoRocket } from "react-icons/go";
import { GrOverview } from "react-icons/gr";
import { MdChecklist } from "react-icons/md";
import ContributionSection from "../../../components/Contribution/Contribution";
import CompletenessSection from "../../../components/Completeness/Completeness";
import ErrorBoundary from "../../../components/Errors/ErrorBoundary";
import OverviewSection from "../../../components/Overview/NewOverview";
import AdoptionSection from "../../../components/Adoption/Adoption";
import { createSSGHelpers } from "@trpc/react/ssg";
import { GetServerSidePropsContext } from "next";
import { appRouter } from "../../../server/router";
import superjson from "superjson";
import { createContextInner } from "../../../server/router/context";
import Head from "next/head";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ org_name: string; repo_name: string }>
) {
  const ONE_DAY = 60 * 60 * 24;
  context.res.setHeader(
    "Cache-Control",
    `public, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_DAY * 7}`
  );

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
    },
  };
}

const RepoPage = () => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const full_name = org_name + "/" + repo_name;
  const host = process.env.NEXT_PUBLIC_VERCEL_URL
    ? "https://" + process.env.NEXT_PUBLIC_GLOBAL_URL
    : "http://localhost:3000";

  return (
    <>
      <Head>
        <meta
          name="og:url"
          content={`${host}/analyze/${org_name}${repo_name}`}
        />
        <meta name="og:type" content="website" />
        <meta
          name="og:title"
          content={`repoanalyzer.com | ${org_name}/${repo_name}`}
        />
        <meta
          name="og:description"
          content={`Insights and analytics into ${org_name}/${repo_name} repository`}
        />
        <meta
          name="og:image"
          content={`${host}/api/og_whole_page?org_name=${org_name}&repo_name=${repo_name}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CrowdDotDev" />
        <meta
          name="twitter:title"
          content={`repoanalyzer.com | ${org_name}/${repo_name}`}
        />
        <meta
          name="twitter:description"
          content={`Insights and analytics into ${org_name}/${repo_name} repository`}
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
              <div className="flex flex-cols">
                <div className="hidden lg:block">
                  <Sidebar
                    className="pt-24"
                    sections={[
                      { section_name: "Overview", logo: <GrOverview /> },
                      { section_name: "Adoption", logo: <GoRocket /> },
                      {
                        section_name: "Contributions Health",
                        logo: <GoGraph />,
                      },
                      {
                        section_name: "Diversity",
                        logo: <GoGlobe />,
                      },
                      {
                        section_name: "Community Guidelines",
                        logo: <MdChecklist />,
                      },
                      // { section_name: "More Insights", logo: <MdInsights /> },
                    ]}
                  />
                </div>
                <div className="container mx-auto px-4">
                  <a
                    href={`https://github.com/${full_name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="max-w-full w-fit px-4 py-5 bg-white rounded-lg shadow mx-auto flex flex-row items-center gap-2 cursor-pointer"
                  >
                    <span className="flex items-center">
                      <Image
                        src={`https://github.com/${org_name}.png`}
                        width="30"
                        height="30"
                        alt={full_name}
                        priority={true}
                      />
                    </span>
                    <span className="text-xl text-gray-900 truncate max-w-sm">
                      {full_name}
                    </span>
                    <GoLinkExternal className="mt-1 hover:fill-primary" />
                  </a>
                  <div
                    id="sections"
                    className="container mx-auto flex flex-col gap-2"
                  >
                    <OverviewSection />
                    <AdoptionSection />
                    <ContributionSection section_id="Contributions Health" />
                    <GeoSection section_id="Diversity" />
                    <CompletenessSection section_id="Community Guidelines" />
                    <footer className="flex justify-center my-4">
                      powered by&nbsp;
                      <a href="https://crowd.dev" className="text-primary">
                        crowd.dev
                      </a>
                      &nbsp;&mdash;&nbsp;the community-led developer growth
                      engine
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
