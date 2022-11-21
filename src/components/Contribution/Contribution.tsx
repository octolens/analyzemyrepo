interface ContributionSectionProps {
  section_id: string;
}
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { ResponsivePie } from "@nivo/pie";
import { UseQueryResult } from "react-query";
import BulletChart from "../Charts/Bullet";
import TemplateCard from "../Cards/TemplateCard";
import SmallCardTooltip from "../Cards/SmallCard";
import { handle_data_and_calculate_factor } from "../../utils/contributions";
import { calculate_bus_factor } from "../../utils/contributions";
import { MdShare } from "react-icons/md";
import { useState } from "react";
import Modal from "../Modal/Modal";
import ShareCard from "../Social/all";
import InsightCard from "../Cards/InsightCard";

const CONTRIBUTORS_COUNT = 10;

const prepareData = (
  data: Record<string, any>[],
  total_contributions: number,
  end = 3
): Record<string, any>[] => {
  const slice = data.slice(0, end);
  const sum = slice.reduce((prev: any, curr: any) => ({
    contributions: prev["contributions"] + curr["contributions"],
  }))["contributions"];

  return [
    ...slice,
    { login: "Other", contributions: total_contributions - sum },
  ];
};

const ContributionSection = ({
  section_id = "Contributions Health",
}: ContributionSectionProps) => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const [isOpenShare, setIsOpenShare] = useState(false);
  const [chartShareType, setChartShareType] = useState<
    "ContributorsChart" | "BusFactorChart" | "SeriousFactorChart"
  >("ContributorsChart");

  const response = trpc.useQuery([
    "github.get_github_repo_contributors",
    { owner: org_name as string, repo: repo_name as string },
  ]);
  const response_2 = trpc.useQuery([
    "github.get_contributions_count",
    { owner: org_name as string, repo: repo_name as string },
  ]);
  const response_serious = trpc.useQuery([
    "postgres.get_serious_contributors",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const saveDataURL = trpc.useMutation("dataURL.upsert");

  const save_data_url = async (chartId = "contributors-chart") => {
    const node = document.getElementById(chartId);
    const svg = node?.getElementsByTagName("svg")[0];
    const imageURL =
      "data:image/svg+xml;base64," +
      Buffer.from(svg?.outerHTML as string).toString("base64");
    await saveDataURL.mutateAsync({
      data_url: imageURL,
      owner: org_name as string,
      repo: repo_name as string,
      type: chartShareType,
    });
  };

  return (
    <section
      className="container p-4 mt-4 flex flex-col items-center border border-black rounded-md"
      id={section_id}
    >
      <h2 className="font-extrabold text-3xl py-2 text-center text-primary">
        Contribution
      </h2>
      <div className="flex flex-row items-center gap-2">
        <h3 className="font-extrabold text-2xl pb-2 pt-2">Top Contributors</h3>
        <MdShare
          className="hover:text-primary text-black cursor-pointer mt-[0.3rem]"
          onClick={async () => {
            setChartShareType("ContributorsChart");
            save_data_url();
            setIsOpenShare(true);
          }}
        />
        <Modal
          isOpen={isOpenShare}
          setIsOpen={setIsOpenShare}
          content={
            <ShareCard
              org_name={org_name as string}
              repo_name={repo_name as string}
              twitter_text="Share on Twitter"
              chart_type={chartShareType}
            />
          }
        />
      </div>
      <p className="text-center pt-1 text-gray-500 text-sm">
        Top 10 contibutors to the repo and their shares
      </p>
      {response.isLoading && response_2.isLoading ? (
        <div className="h-96 container px-4 mx-auto overflow-hidden bg-gray-200 animate-pulse"></div>
      ) : (
        <div
          className="h-96 container px-4 mx-auto overflow-hidden"
          id="contributors-chart"
        >
          <ResponsivePie
            data={prepareData(
              response.data,
              response_2.data?.total_contributions as number,
              CONTRIBUTORS_COUNT < response.data.length
                ? CONTRIBUTORS_COUNT
                : response.data.length + 1
            )}
            id="login"
            value="contributions"
            colors={{ scheme: "oranges" }}
            valueFormat=" >(~f"
            arcLabelsSkipAngle={10}
            activeOuterRadiusOffset={15}
            borderWidth={1}
            borderColor={"black"}
            padAngle={2}
            cornerRadius={8}
            innerRadius={0.5}
            margin={{ top: 40, right: 20, bottom: 40, left: 20 }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabel={(d) =>
              `${d.id} (${Math.round(
                (d.value / (response_2.data?.total_contributions as number)) *
                  100
              )}%)`
            }
            layers={[
              "arcs",
              "arcLabels",
              "arcLinkLabels",
              "legends",
              CenteredMetric,
            ]}
          />
        </div>
      )}
      <h3 className="font-extrabold text-2xl pb-2">Commits Properties</h3>
      <p className="text-center pt-1 text-gray-500 text-sm pb-4 md:pb-0">
        Metrics showing quality of commits distribution
      </p>
      <div className="flex flex-col gap-2 md:mx-auto">
        <div className="flex flex-row items-center justify-center">
          <BusFactorBullet response={response} response_2={response_2} />
          <MdShare
            className="hover:text-primary text-black cursor-pointer hidden md:block"
            onClick={async () => {
              setChartShareType("BusFactorChart");
              save_data_url("busfactor-chart");
              setIsOpenShare(true);
            }}
          />
        </div>
        <div className="flex flex-row items-center pt-4 md:pt-0 md:mx-auto justify-center">
          <SeriousCountBullet response_hack={response} />
          <MdShare
            className="hover:text-primary text-black cursor-pointer hidden md:block"
            onClick={async () => {
              setChartShareType("SeriousFactorChart");
              save_data_url("seriousfactor-chart");
              setIsOpenShare(true);
            }}
          />
        </div>
        <div className="flex flex-col items-center mt-4 gap-2">
          {response.isLoading || response_2.isLoading ? (
            <TemplateCard />
          ) : (
            <InsightCard
              color={
                (calculate_bus_factor(
                  response.data,
                  response_2.data?.total_contributions as number
                ).bus_factor as number) >= 10
                  ? "positive"
                  : "negative"
              }
              text={
                (calculate_bus_factor(
                  response.data,
                  response_2.data?.total_contributions as number
                ).bus_factor as number) >= 10
                  ? "Bus factor is greater than or equal to 10"
                  : "Bus factor is less than 10"
              }
              width="w-72"
              height="h-12"
              size={20}
            />
          )}
          {response_serious.isLoading || response.isLoading ? (
            <TemplateCard />
          ) : (
            <InsightCard
              color={
                (handle_data_and_calculate_factor({
                  data_db: response_serious.data,
                  data_gh: response.data,
                  format: false,
                }) as number) >= 50
                  ? "positive"
                  : "negative"
              }
              text={
                (handle_data_and_calculate_factor({
                  data_db: response_serious.data,
                  data_gh: response.data,
                  format: false,
                }) as number) >= 50
                  ? "More than 50% of contributors are serious"
                  : "Less than 50% of contributors are serious"
              }
              width="w-72"
              height="h-12"
              size={20}
            />
          )}
        </div>
      </div>
    </section>
  );
};

const CenteredMetric = ({ dataWithArc, centerX, centerY }: any) => {
  let total = 0;
  dataWithArc.forEach((datum: any) => {
    total += datum.value;
  });

  return (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: "30px",
        fontWeight: 600,
      }}
    >
      {total}
    </text>
  );
};

const BusFactorCard = () => {
  return (
    <div className="z-10 w-72 text-sm font-light text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Bus Factor
        </h3>
        <p>
          The Bus Factor shows the number of contributors who authored more than
          50% of all commits. For instance, a Bus Factor of one means that one
          person wrote more than 50% of all the code in the repo. A low Bus
          Factor may indicate that the repo is heavily dependent on a small
          number of people, which could become a big problem if one of the
          maintainers leaves.
        </p>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Calculation
        </h3>
        <p>
          We analyze the top 100 contributors of the repo and calculate their
          commits to the repo. Then we calculate the total number of commits to
          the repo. Finally, we sort the top contributors in descending order by
          number of commits and add up the numbers until we get more that 50% of
          all commits.
        </p>
        {/* <a href="#" className="flex items-center font-medium text-primary">
          Read more{" "}
          <svg
            className="ml-1 w-4 h-4"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </a> */}
      </div>
    </div>
  );
};

const BusFactorBullet = ({
  response,
  response_2,
}: {
  response: UseQueryResult<any>;
  response_2: UseQueryResult<any>;
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
      <SmallCardTooltip text="Bus Factor" tip={<BusFactorCard />} />
      {response.isLoading && response_2.isLoading ? (
        <TemplateCard width="w-80" height="h-20" />
      ) : (
        <BulletChart
          chartId="busfactor-chart"
          className="h-20 w-64 md:w-80"
          title={
            calculate_bus_factor(
              response.data,
              response_2.data?.total_contributions as number
            ).bus_factor
          }
          ranges={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50]}
          measures={[
            calculate_bus_factor(
              response.data,
              response_2.data?.total_contributions as number
            ).bus_factor as number,
          ]}
          markers={[
            calculate_bus_factor(
              response.data,
              response_2.data?.total_contributions as number
            ).bus_factor as number,
          ]}
          maxValue={20}
          minValue={1}
          titlePosition="before"
          margin={{ left: 45, right: 10, top: 20, bottom: 20 }}
        />
      )}
    </div>
  );
};

const SeriousCountBullet = ({
  response_hack,
}: {
  response_hack: UseQueryResult<any>;
}) => {
  const router = useRouter();

  const { org_name, repo_name } = router.query;

  const response = trpc.useQuery([
    "postgres.get_serious_contributors",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  return (
    <div className="flex flex-col md:flex-row gap-2 items-center">
      <SmallCardTooltip
        text="Serious Ratio"
        tip={<SeriousFactorCard />}
      ></SmallCardTooltip>
      {response.isLoading || response_hack.isLoading ? (
        <TemplateCard width="w-80" height="h-20" />
      ) : (
        <BulletChart
          chartId="seriousfactor-chart"
          className="h-20 w-64 md:w-80"
          title={`${handle_data_and_calculate_factor({
            data_db: response.data,
            data_gh: response_hack.data,
            format: true,
          })}%`}
          ranges={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          measures={[
            handle_data_and_calculate_factor({
              data_db: response.data,
              data_gh: response_hack.data,
              format: false,
            }) as number,
          ]}
          markers={[
            handle_data_and_calculate_factor({
              data_db: response.data,
              data_gh: response_hack.data,
              format: false,
            }) as number,
          ]}
          maxValue={100}
          minValue={1}
          titlePosition="before"
          margin={{ left: 45, right: 10, top: 20, bottom: 20 }}
        />
      )}
    </div>
  );
};

const SeriousFactorCard = () => {
  return (
    <div className="z-10 w-72 text-sm font-light text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Serious Ratio
        </h3>
        <p>
          Serious ratio shows the ratio of contributors who authored more than 1
          commit to all contributors. The idea of this metric is to show
          percentage of{" "}
          <b>&quot;serious&quot; contributors VS one-off commiters.</b>
        </p>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Calculation
        </h3>
        <p>
          We analyze all commits of the repo and calculate number of commits for
          each contributor. Then we count contributors who did more than 1
          commit and divide them by all contributors.
        </p>
      </div>
    </div>
  );
};

export default ContributionSection;
