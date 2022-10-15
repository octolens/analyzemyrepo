import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar/SideBar";
import Image from "next/image";
import { trpc } from "../../../utils/trpc";
import OverViewSection from "../../../components/Overview/Overview";
import HeaderSecondary from "../../../components/Headers/NewHeaderSecondary";
import GeoSection from "../../../components/Geo/Geo";
import { GoLinkExternal, GoGraph, GoGlobe } from "react-icons/go";
import { GrOverview } from "react-icons/gr";
import { MdInsights, MdChecklist } from "react-icons/md";
import ContributionSection from "../../../components/Contribution/Contribution";
import CompletenessSection from "../../../components/Completeness/Completeness";
import ErrorBoundary from "../../../components/Errors/ErrorBoundary";
import NewOverviewSection from "../../../components/Overview/NewOverview";

const RepoPage = () => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const full_name = org_name + "/" + repo_name;

  const data = trpc.useQuery([
    "github.get_github_repo",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const commits = trpc.useQuery([
    "github.get_github_commits",
    {
      owner: org_name as string,
      repo: repo_name as string,
    },
  ]);

  const open_prs = trpc.useQuery([
    "github.get_github_open_prs",
    {
      owner: org_name as string,
      repo: repo_name as string,
    },
  ]);

  const branches = trpc.useQuery([
    "github.get_github_branches",
    {
      owner: org_name as string,
      repo: repo_name as string,
    },
  ]);

  const repo_rank = trpc.useQuery([
    "postgres.get_repo_rank",
    {
      owner: org_name as string,
      repo: repo_name as string,
    },
  ]);

  return (
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
                    {
                      section_name: "Contributions",
                      logo: <GoGraph />,
                    },
                    {
                      section_name: "Geo Map",
                      logo: <GoGlobe />,
                    },
                    {
                      section_name: "Repo Checklist",
                      logo: <MdChecklist />,
                    },
                    { section_name: "More Insights", logo: <MdInsights /> },
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
                  <div>
                    <Image
                      src={`https://github.com/${org_name}.png`}
                      width="30"
                      height="30"
                      alt={full_name}
                      priority={true}
                    />
                  </div>
                  <div className="text-xl text-gray-900 truncate max-w-sm">
                    {full_name}
                  </div>
                  <GoLinkExternal className="mt-1 hover:fill-primary" />
                </a>
                <div
                  id="sections"
                  className="container mx-auto flex flex-col gap-2"
                >
                  <NewOverviewSection />
                  <OverViewSection
                    section_id="Overview"
                    response={data}
                    commits_response={commits}
                    open_prs_response={open_prs}
                    branches_response={branches}
                    repo_rank_response={repo_rank}
                  />
                  <ContributionSection section_id="Contributions" />
                  <GeoSection section_id="Geo Map" />
                  <CompletenessSection />
                </div>
              </div>
            </div>
          </div>
          <div id="modal"></div>
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default RepoPage;
