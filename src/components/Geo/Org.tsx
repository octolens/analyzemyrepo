import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { inferQueryOutput, trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

const cook_org_data = (
  data: inferQueryOutput<"postgres.get_repo_contributors_companies">
) => {
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["company_name"] != null);

  if (sorted[0] == undefined) {
    return false;
  }
};

const OrgChart = () => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;
  const data = trpc.useQuery([
    "postgres.get_repo_contributors_companies",
    {
      owner: org_name as string,
      repo: repo_name as string,
    },
  ]);

  if (data.isLoading) {
    return null;
  }

  return (
    <ResponsiveCirclePacking
      data={{
        company_name: "All",
        children: data.data?.filter((value) => value["company_name"] != null),
      }}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      id="company_name"
      value="commits_count"
      colors={{ scheme: "oranges" }}
      padding={4}
      enableLabels={true}
      labelsFilter={function (n) {
        return 1 === n.node.depth;
      }}
      labelsSkipRadius={22}
      borderWidth={1}
    />
  );
};

export default OrgChart;
