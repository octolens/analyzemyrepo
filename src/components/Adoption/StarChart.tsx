import { ResponsiveLine } from "@nivo/line";
import { inferQueryOutput, trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

// map from postgres column name to github api name
const nameMap = (value: "stargazers" | "forks") => {
  if (value === "stargazers") {
    return "stargazers_count";
  } else return "forks_count";
};

const StarChart = ({ field }: { field: "stargazers" | "forks" }) => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;
  const history = trpc.useQuery([
    "postgres.get_repo_history",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const recent = trpc.useQuery([
    "github.get_github_repo",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  if (!history.data || !recent.data || history.isLoading || recent.isLoading) {
    return <div className="w-full h-full bg-gray-200 animate-pulse"></div>;
  }

  if (history.data.length === 0) {
    return null;
  }

  const get_min = (data: inferQueryOutput<"postgres.get_repo_history">) => {
    return Math.min(...data.map((value) => value[nameMap(field)] as number));
  };

  const combine_history_and_recent = () => {
    const recent_data = {
      x: new Date(recent.data["updated_at"]),
      y: recent.data[nameMap(field)],
    };
    const history_data = history.data.map((value) => ({
      x: value.updated_at,
      y: value[nameMap(field)],
    }));

    const data = [recent_data, ...history_data];
    // let's sort data by x
    data.sort((a, b) => {
      return (a.x as Date).getTime() - (b.x as Date).getTime();
    });

    return data;
  };

  return (
    <ResponsiveLine
      data={[
        {
          id: "stars-chart",
          data: combine_history_and_recent(),
        },
      ]}
      margin={{ top: 10, right: 30, bottom: 40, left: 50 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%d",
        precision: "day",
        useUTC: false,
        min: "auto",
        max: "auto",
      }}
      yScale={{
        type: "linear",
        min: get_min(history.data),
        max: "auto",
      }}
      axisBottom={{
        format: "%b %d",
        tickRotation: 45,
      }}
      enableArea={true}
      areaBaselineValue={get_min(history.data)}
      enableCrosshair={false}
    />
  );
};

export default StarChart;
