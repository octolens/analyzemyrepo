import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { inferQueryOutput, trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import RadioHorizontal from "../Radio/RadioHorizontal";
import { useState } from "react";
import InsightCard from "../Cards/InsightCard";
import TemplateCard from "../Cards/TemplateCard";
import { MdShare } from "react-icons/md";
import Modal from "../Modal/Modal";
import ShareCard from "../Social/all";

const OrgChart = ({
  value,
}: {
  value: "commits_count" | "contributors_count";
}) => {
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
    return (
      <div className="container h-96 mx-auto animate-pulse bg-gray-200 rounded-lg mt-4"></div>
    );
  }

  return (
    <ResponsiveCirclePacking
      data={{
        company_name: "All",
        children: data.data
          ?.filter((value) => value["company_name"] != null)
          .sort((a, b) => (a[value] < b[value] ? 1 : -1))
          .slice(0, 50),
      }}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      id="company_name"
      valueFormat=" >-.2~f"
      value={value}
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

const OrgSubSection = () => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const [orgCalcType, setOrgCalcType] = useState<
    "commits_count" | "contributors_count"
  >("commits_count");
  const [isOpenShare, setIsOpenShare] = useState(false);

  const saveDataURL = trpc.useMutation("dataURL.upsert");
  const save_data_url = async (chartId = "org-chart") => {
    const node = document.getElementById(chartId);
    const svg = node?.getElementsByTagName("svg")[0];
    const imageURL =
      "data:image/svg+xml;base64," +
      Buffer.from(svg?.outerHTML as string).toString("base64");
    await saveDataURL.mutateAsync({
      data_url: imageURL,
      owner: org_name as string,
      repo: repo_name as string,
      type:
        orgCalcType == "commits_count"
          ? "CompanyChartCommits"
          : "CompanyChartContributors",
    });
  };

  const data = trpc.useQuery([
    "postgres.get_repo_contributors_companies",
    {
      owner: org_name as string,
      repo: repo_name as string,
    },
  ]);

  if (!data.isLoading && data.data?.length == 0) {
    return null;
  }

  return (
    <div className="container mx-auto pt-4 items-center flex flex-col">
      <div className="flex flex-row items-center gap-2">
        <h3 className="font-extrabold text-2xl pb-2 pt-2 text-center">
          Org Distribution
        </h3>
        <MdShare
          className="hover:text-primary text-black cursor-pointer mt-[0.3rem]"
          onClick={async () => {
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
              chart_type={
                orgCalcType == "commits_count"
                  ? "CompanyChartCommits"
                  : "CompanyChartContributors"
              }
            />
          }
        />
      </div>
      <p className="text-center text-gray-500 mb-4">
        Top organizations contributing to the repo
      </p>
      <RadioHorizontal
        radio_names={["commits_count", "contributors_count"]}
        active_radio_name={orgCalcType}
        setRadioName={setOrgCalcType}
        id_modifier="org"
      />
      {/* this div only for the chart - don't insert anything inside */}
      <div className="container h-96 mx-auto pt-2" id="org-chart">
        <OrgChart value={orgCalcType} />
      </div>
      <div className="flex flex-col gap-3 pt-4 items-center justify-center">
        <InsightCompanyCard />
        <InsightShareCard />
      </div>
    </div>
  );
};

const InsightShareCard = () => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;
  const org_query = trpc.useQuery([
    "postgres.get_repo_contributors_companies",
    {
      owner: org_name as string,
      repo: repo_name as string,
    },
  ]);

  if (org_query.isLoading) {
    return <TemplateCard width="w-64" height="h-8" />;
  }

  // cooking data
  const data = org_query.data as Record<string, any>[];
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["company_name"] != null);

  if (sorted[0] == undefined) {
    return null;
  }

  const count_more_3 = sorted.filter((x) => x["commits_perc"] >= 0.03).length;

  if (count_more_3 > 2) {
    return (
      <InsightCard
        color="positive"
        text={`More than 3 organizations have more than 3% of commits`}
        width="w-72"
        height="h-12"
        size={20}
      />
    );
  }

  return (
    <InsightCard
      color="negative"
      text={`Less than 3 organizations have more than 3% of commits`}
      width="w-72"
      height="h-12"
      size={20}
    />
  );
};

const InsightCompanyCard = () => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;
  const org_query = trpc.useQuery([
    "postgres.get_repo_contributors_companies",
    {
      owner: org_name as string,
      repo: repo_name as string,
    },
  ]);

  if (org_query.isLoading) {
    return <TemplateCard width="w-64" height="h-8" />;
  }

  // cooking data
  const data = org_query.data as Record<string, any>[];
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["company_name"] != null);

  if (sorted[0] == undefined) {
    return null;
  }

  if (sorted[0]["commits_perc"] > 0.5) {
    return (
      <InsightCard
        color="negative"
        text={`More than 50% of commits from one organization (${sorted[0]["company_name"]})`}
        width="w-72"
        height="h-12"
        size={20}
      />
    );
  }

  return (
    <InsightCard
      color="positive"
      text={`None of the organizations has more than 50% of commits`}
      width="w-72"
      height="h-12"
      size={20}
    />
  );
};

export default OrgSubSection;
