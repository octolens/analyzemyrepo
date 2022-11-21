import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { UseQueryResult } from "react-query";
import { ResponsiveChoropleth } from "@nivo/geo";
import Tooltip from "../Tooltip/Tooltip";
import SimpleTable from "../Table/Table";
import GeoToolTip from "./GeoTootip";
import InsightCard from "../Cards/InsightCard";
import TemplateCard from "../Cards/TemplateCard";
import TeaseCard from "../Cards/TeaseCard";
import { signIn } from "next-auth/react";
import OrgSubSection from "./Org";
import RadioHorizontal from "../Radio/RadioHorizontal";
import { MdShare } from "react-icons/md";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import ShareCard from "../Social/all";

const GeoChart = ({
  data,
  features,
  value,
}: {
  data: Record<string, any>[];
  features: any[];
  value: string;
}) => {
  const [projectionScale, setProjectionScale] = useState(100);
  const [projectionTranslation, setProjectionTranslation] = useState<
    [number, number]
  >([0.5, 0.5]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setProjectionScale(50);
      setProjectionTranslation([0.3, 0.5]);
    } else if (window.innerWidth < 1024) {
      setProjectionScale(90);
      setProjectionTranslation([0.4, 0.6]);
    } else {
      setProjectionScale(100);
      setProjectionTranslation([0.5, 0.5]);
    }
  }, []);

  return (
    <ResponsiveChoropleth
      data={data.map((value) => ({ ...value, id: value["country"] }))}
      features={features}
      value={value} // value accessor
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      colors="oranges"
      domain={[0, calculate_color_max({ data: data, key: value })]}
      unknownColor="#ffffff"
      label="properties.name"
      valueFormat=".0f"
      projectionScale={projectionScale}
      projectionTranslation={projectionTranslation}
      projectionRotation={[0, 0, 0]}
      enableGraticule={true}
      graticuleLineColor="#dddddd"
      borderWidth={0.5}
      borderColor="#152538"
      legends={
        data.length > 0
          ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: "#444444",
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000000",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : []
      }
    />
  );
};

const calculate_color_max = ({
  data,
  key,
}: {
  data: Record<string, any>[];
  key: string;
}) => {
  return Math.max(
    ...data.filter((value) => value["country"] != null).map((o) => o[key])
  );
};

const cook_data_for_the_table = ({
  data,
  key,
}: {
  data: Record<string, any>[];
  key: string;
}) => {
  if (data.length == 0) {
    return [{ country: "NO DATA FOR THIS REPO", key: "" }];
  }
  const new_data = data
    .sort((a, b) => (a[key] < b[key] ? 1 : -1))
    .slice(0, 5 + 1)
    .filter((value) => value["country"] != null);

  if (key.includes("perc")) {
    const new_data_2 = new_data.map((value) => {
      return {
        ...value,
        [key]:
          (value[key] * 100).toLocaleString("en-US", {
            maximumFractionDigits: 1,
            maximumSignificantDigits: 2,
            minimumFractionDigits: 0,
            minimumSignificantDigits: 2,
          }) + "%",
      };
    });
    return new_data_2;
  }

  return new_data;
};

const mapping = {
  contributors_count: "contributors_perc",
  commits_count: "commits_perc",
};

const GeoSection = ({ section_id = "Geo Map" }: { section_id: string }) => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const [geoCalcType, setGeoCalcType] = useState<
    "commits_count" | "contributors_count"
  >("commits_count");

  const [isOpenShare, setIsOpenShare] = useState(false);

  const geo_query = trpc.useQuery([
    "postgres.get_repo_contributors_countries",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const json_query = trpc.useQuery(["postgres.get_static_json"]);

  const saveDataURL = trpc.useMutation("dataURL.upsert");

  const save_data_url = async (chartId = "geodistribution-chart") => {
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
        geoCalcType == "commits_count"
          ? "GeoChartCommits"
          : "GeoChartContributors",
    });
  };

  if (!geo_query.isLoading && geo_query.data?.length == 0) {
    return (
      <section
        className="container p-4 flex flex-col items-center border border-black rounded-md mt-4"
        id={section_id}
      >
        <h2 className="font-extrabold text-3xl py-2 text-center text-primary">
          Diversity
        </h2>
        <div className="pt-2 flex flex-col">
          <TeaseCard />
          <div className="pt-2 mx-auto flex">
            <LoginButton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="container p-4 flex flex-col items-center border border-black rounded-md mt-4"
      id={section_id}
    >
      <h2 className="font-extrabold text-3xl py-2 text-center text-primary">
        Diversity
      </h2>
      <div className="flex flex-row items-center gap-2">
        <h3 className="font-extrabold text-2xl pb-2 pt-2">Geo Distribution</h3>
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
                geoCalcType == "commits_count"
                  ? "GeoChartCommits"
                  : "GeoChartContributors"
              }
            />
          }
        />
      </div>
      <p className="text-center text-gray-500 mb-5">
        Top locations by number of contributors and commits{" "}
        <div className="inline align-middle">
          <Tooltip tip={<GeoToolTip />} position_priority={"right"} />
        </div>
      </p>
      <RadioHorizontal
        radio_names={["commits_count", "contributors_count"]}
        active_radio_name={geoCalcType}
        setRadioName={setGeoCalcType}
        id_modifier="geo"
      />
      {json_query.isLoading || geo_query.isLoading ? (
        // skeleton
        <div className="container h-80 mx-auto animate-pulse bg-gray-200 rounded-lg mt-4"></div>
      ) : (
        <div className="flex flex-col lg:flex-row mt-4 mx-auto">
          <div
            className="container w-72 h-64 md:h-96 md:w-full mx-auto pb-4 md:pb-0"
            id="geodistribution-chart"
          >
            <GeoChart
              features={json_query.data["features"]}
              data={geo_query.data as Record<string, any>[]}
              value={geoCalcType}
            />
          </div>
          <div className="mx-auto">
            <SimpleTable
              column_name="Top 5 Countries"
              rows={TableRowsArray({
                data: geo_query.data as Record<string, any>[],
                key: mapping[geoCalcType],
              })}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3 pt-4 items-center justify-center">
        <InsightCountryCard geo_query={geo_query} />
        <InsightShareCard geo_query={geo_query} />
      </div>
      <OrgSubSection />
    </section>
  );
};

const TableRowsArray = ({
  data,
  key,
}: {
  data: Record<string, any>[];
  key: string;
}): JSX.Element[] => {
  return cook_data_for_the_table({
    data: data,
    key: key,
  }).map((value: Record<string, any>) => (
    <div
      className="flex flex-row justify-around"
      key={value["country"] + value[key]}
    >
      {/* add country flags https://countryflagsapi.com/:filetype/:code */}
      <span>{value["country"]}</span>
      <span>{value[key]}</span>
    </div>
  ));
};

const InsightCountryCard = ({
  geo_query,
}: {
  geo_query: UseQueryResult<any>;
}) => {
  if (geo_query.isLoading) {
    return <TemplateCard width="w-64" height="h-8" />;
  }

  // cooking data
  const data = geo_query.data as Record<string, any>[];
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["country"] != null);

  if (sorted[0] == undefined) {
    return null;
  }

  if (sorted[0]["commits_perc"] > 0.5) {
    return (
      <InsightCard
        color="negative"
        text={`More than 50% of commits from one country (${sorted[0]["country"]})`}
        width="w-72"
        height="h-12"
        size={20}
      />
    );
  }

  return (
    <InsightCard
      color="positive"
      text={`None of the countries has more than 50% of commits`}
      width="w-72"
      height="h-12"
      size={20}
    />
  );
};

const InsightShareCard = ({
  geo_query,
}: {
  geo_query: UseQueryResult<any>;
}) => {
  if (geo_query.isLoading) {
    return <TemplateCard width="w-64" height="h-8" />;
  }

  // cooking data
  const data = geo_query.data as Record<string, any>[];
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["country"] != null);

  if (sorted[0] == undefined) {
    return null;
  }

  const count_more_3 = sorted.filter((x) => x["commits_perc"] >= 0.03).length;

  if (count_more_3 > 2) {
    return (
      <InsightCard
        color="positive"
        text={`More than 3 countries have more than 3% of commits`}
        width="w-72"
        height="h-12"
        size={20}
      />
    );
  }

  return (
    <InsightCard
      color="negative"
      text={`Less than 3 countries have more than 3% of commits`}
      width="w-72"
      height="h-12"
      size={20}
    />
  );
};

function LoginButton() {
  return (
    <button
      onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
      className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-md shadow"
    >
      Request to collect more data
    </button>
  );
}

export default GeoSection;
