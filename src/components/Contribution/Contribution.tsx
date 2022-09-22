interface ContributionSectionProps {
  section_id: string;
}
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { ResponsivePie } from "@nivo/pie";

const CONTRIBUTORS_COUNT = 10;

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
    end: number = 3
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
      <h2 className="text-center font-extrabold text-3xl">Contributions</h2>
      {response.isLoading && response_2.isLoading ? (
        ""
      ) : (
        // <PieChart
        //   width={700}
        //   height={500}
        //   data={prepareData(
        //     response.data,
        //     response_2.data?.total_contributions as number,
        //     CONTRIBUTORS_COUNT < response.data.length
        //       ? CONTRIBUTORS_COUNT
        //       : response.data.lenght + 1
        //   )}
        //   data_display_name="login"
        //   data_number_name="contributions"
        // />
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
            margin={{ top: 40, right: 20, bottom: 20, left: 20 }}
            arcLinkLabelsSkipAngle={3}
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

          {/* {JSON.stringify(response_2.data)} */}
        </div>
      )}
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

export default ContributionSection;
