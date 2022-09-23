interface ContributionSectionProps {
  section_id: string;
}
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { ResponsivePie } from "@nivo/pie";
import { UseQueryResult } from "react-query";
import { ResponsiveBullet } from "@nivo/bullet";
import Tooltip from "../Tooltip/Tooltip";

const CONTRIBUTORS_COUNT = 10;

interface BusFactor {
  bus_factor: number | string;
  share: number;
}

const calculate_bus_factor = (
  data: Record<string, any>[],
  total_contributions: number
): BusFactor => {
  // calculate number of contributors who consist more than 50% of commits
  if (data.length == 1) {
    return {
      bus_factor: 1,
      share: 100,
    };
  }
  const half = total_contributions / 2;
  let sum = 0;
  let i;
  for (i = 0; i < data.length; i++) {
    sum += (data[i] as any)["contributions"];
    if (sum >= half) {
      return {
        bus_factor: i + 1,
        share: Math.round((sum / total_contributions) * 100),
      };
    }
  }

  // at this point we understand that 100 people (or all people in the repo, which is strange) represent less 50% of commits

  return {
    bus_factor: 100,
    share: Math.round((sum / total_contributions) * 100),
  };
};

const ContributionSection = ({ section_id }: ContributionSectionProps) => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;
  const response = trpc.useQuery([
    "github.get_github_repo_contributors",
    { owner: org_name as string, repo: repo_name as string },
  ]);
  const response_2 = trpc.useQuery([
    "github.get_contributions_count",
    { owner: org_name as string, repo: repo_name as string },
  ]);

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
  return (
    <section
      className="container py-4 flex flex-col items-center"
      id={section_id}
    >
      <h2 className="text-center font-extrabold text-3xl py-2">
        Contributions
      </h2>
      <p className="text-center pt-1 text-gray-500">Distribution of commits</p>
      {response.isLoading && response_2.isLoading ? (
        <div className="h-96 w-64 md:w-full bg-gray-200 animate-pulse"></div>
      ) : (
        // chart
        <div className="h-96 w-64 md:w-full">
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
      <div className="pt-2 h-24 w-64 md:w-full flex">
        <div className="flex flex-col gap-2 mx-auto">
          <div className="flex flex-row gap-2 items-center">
            <CardSmall>
              <>
                Bus Factor
                <div className="mt-1">
                  <Tooltip tip={<BusFactorCard />} />
                </div>
              </>
            </CardSmall>
            {response.isLoading && response_2.isLoading ? (
              <TemplateCard />
            ) : (
              // <Card
              //   data={`${
              //     calculate_bus_factor(
              //       response.data,
              //       response_2.data?.total_contributions as number
              //     ).bus_factor
              //   }`}
              // />
              <div className="h-20 w-72">
                <ResponsiveBullet
                  data={[
                    {
                      id: "Data",
                      ranges: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50],
                      title: `${
                        calculate_bus_factor(
                          response.data,
                          response_2.data?.total_contributions as number
                        ).bus_factor
                      }`,
                      measures: [
                        calculate_bus_factor(
                          response.data,
                          response_2.data?.total_contributions as number
                        ).bus_factor as number,
                      ],
                      markers: [
                        calculate_bus_factor(
                          response.data,
                          response_2.data?.total_contributions as number
                        ).bus_factor as number,
                      ],
                    },
                  ]}
                  maxValue={20}
                  minValue={1}
                  spacing={46}
                  titleAlign="start"
                  measureSize={0.1}
                  titleOffsetX={10}
                  animate={true}
                  margin={{ right: 30, bottom: 20, left: 10, top: 20 }}
                  markerSize={1.3}
                  rangeColors="red_yellow_green"
                  measureColors="black"
                  markerColors="black"
                  titlePosition="after"
                />
              </div>
            )}
          </div>
          {/* <div className="flex flex-row gap-2">
            <CardSmall>Coverage Ratio</CardSmall>
          </div>
          <div className="flex flex-row gap-2">
            <CardSmall>Serious Ratio</CardSmall>
          </div> */}
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

// always static content
const CardSmall = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-32 rounded-lg bg-white h-6 border boder-solid border-black px-2 flex flex-row items-center justify-start gap-2">
      {children}
    </div>
  );
};

const Card = ({ response, data, response_data_name }: CardProps) => {
  if (response) {
    return (
      <>
        {response.isLoading ? (
          <TemplateCard />
        ) : (
          <div className="rounded-lg w-44 bg-white h-6 border boder-solid border-black px-2 flex flex-row justify-end items-center">
            {response_data_name
              ? (response.data[response_data_name] as number).toLocaleString()
              : response.data}
          </div>
        )}
      </>
    );
  }
  if (data) {
    return (
      <div className="rounded-lg w-44 bg-white h-6 border boder-solid border-black px-2 flex flex-row justify-end items-center">
        {data}
      </div>
    );
  }

  return (
    <div className="rounded-lg w-44 bg-white h-6 border boder-solid border-black px-2 flex flex-row justify-end items-center">
      There was a problem loading data
    </div>
  );
};

const TemplateCard = () => {
  return <div className="rounded-lg w-44 h-6 bg-gray-200 animate-pulse"></div>;
};

interface CardProps {
  response?: UseQueryResult<any>;
  response_data_name?: string;
  data?: string | number;
}

const BusFactorCard = () => {
  return (
    <>
      <div className="z-10 w-72 text-sm font-light text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Bus Factor
          </h3>
          <p>
            Bus Factor shows the number of contributors who authored more than
            50% of all commits. For instance, Bus Factor of one means that one
            person wrote more than 50% of all code in the repo. A low Bus Factor
            usually indicates that repo is heavily dependent on a small number
            of people, which could become a big problem if one of the
            maintainers leaves.
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Calculation
          </h3>
          <p>
            We analyze top 100 contributors of the repo and calculate their
            commits to the repo. Then we calculate a total number of commits to
            the repo. Finally, we sort top contributors in an descending order
            by number of commits and add up these numbers until we get more that
            50% of all commits.
          </p>
          <a href="#" className="flex items-center font-medium text-primary">
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
          </a>
        </div>
      </div>
    </>
  );
};

export default ContributionSection;
