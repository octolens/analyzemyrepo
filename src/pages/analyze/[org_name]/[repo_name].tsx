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

const RepoPage = () => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const full_name = org_name + "/" + repo_name;

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
