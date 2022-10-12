import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { UseQueryResult } from "react-query";
import { ResponsiveChoropleth } from "@nivo/geo";
import { useState } from "react";
import Tooltip from "../Tooltip/Tooltip";
import SimpleTable from "../Table/Table";
import GeoToolTip from "./GeoTootip";
import InsightCard from "../Cards/InsightCard";
import TemplateCard from "../Cards/TemplateCard";
import TeaseCard from "../Cards/TeaseCard";
import { useSession, signIn, signOut } from "next-auth/react";

const RadioHorizontal = ({
  radio_names,
  active_radio_name,
  setRadioName,
}: {
  radio_names: string[];
  active_radio_name: string;
  setRadioName: (x: any) => any;
}) => {
  return (
    <div className="flex flex-col md:flex-row mx-auto items-center gap-2">
      {radio_names.map((value: string, index: number) => {
        return (
          <div className="flex items-center mr-4" key={index}>
            <input
              id={`inline-radio-${index}`}
              type="radio"
              name="inline-radio-group"
              checked={value == active_radio_name}
              onChange={() => setRadioName(value)}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-black"
            />
            <label
              htmlFor={`inline-radio-${index}`}
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {value}
            </label>
          </div>
        );
      })}
    </div>
  );
};

const GeoChart = ({
  data,
  features,
  value,
}: {
  data: Record<string, any>[];
  features: any[];
  value: string;
}) => {
  return (
    <ResponsiveChoropleth
      data={data}
      features={features}
      value={value} // value accessor
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      colors="oranges"
      domain={[0, calculate_color_max({ data: data, key: value })]}
      unknownColor="#ffffff"
      label="properties.name"
      valueFormat=".0f"
      projectionScale={100}
      projectionTranslation={[0.5, 0.5]}
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
    ...data.filter((value) => value["id"] != null).map((o) => o[key])
  );
};

const cook_data_for_the_table = ({
  data,
  key,
}: {
  data: Record<string, any>[];
  key: string;
}) => {
  if (!data.length) {
    return [{ id: "NO DATA FOR THIS REPO", key: "" }];
  }
  const new_data = data
    .sort((a, b) => (a[key] < b[key] ? 1 : -1))
    .slice(0, 5 + 1)
    .filter((value) => value["id"] != null);

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

  const geo_query = trpc.useQuery([
    "hasura.get_repo_contributors_countries",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const json_query = trpc.useQuery(["hasura.get_static_json"]);

  return (
    <section className="flex flex-col gap-3" id={section_id}>
      <h2 className="text-center font-extrabold text-3xl py-2">Geo Map</h2>
      <p className="text-center text-gray-500">
        Locations of contributors{" "}
        <div className="inline align-middle">
          <Tooltip tip={<GeoToolTip />} position_priority={"right"} />
        </div>
      </p>
      <RadioHorizontal
        radio_names={["commits_count", "contributors_count"]}
        active_radio_name={geoCalcType}
        setRadioName={setGeoCalcType}
      />
      {json_query.isLoading || geo_query.isLoading ? (
        // skeleton
        <div className="container h-80 mx-auto animate-pulse bg-gray-200 rounded-lg"></div>
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="container h-80 mx-auto">
            <GeoChart
              features={json_query.data["features"]}
              data={geo_query.data["github_repos_contributors_countries"]}
              value={geoCalcType}
            />
          </div>
          <div className="mx-auto">
            <SimpleTable
              column_name="Top 5 Countries"
              rows={TableRowsArray({
                data: geo_query.data["github_repos_contributors_countries"],
                key: mapping[geoCalcType],
              })}
            />
            {geo_query.data["github_repos_contributors_countries"].length ==
            0 ? (
              <div className="pt-2 flex flex-col">
                <TeaseCard />
                <div className="pt-2 mx-auto flex">
                  <LoginButton />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3 pt-2 items-center justify-center">
        <InsightCountryCard geo_query={geo_query} />
        <InsightShareCard geo_query={geo_query} />
      </div>
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
    <div className="flex flex-row justify-around" key={value["id"]}>
      {/* add country flags https://countryflagsapi.com/:filetype/:code */}
      <span>{value["id"]}</span>
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
  const data = geo_query.data["github_repos_contributors_countries"] as Record<
    string,
    any
  >[];
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["id"] != null);

  if (sorted[0] == undefined) {
    return null;
  }

  if (sorted[0]["commits_perc"] > 0.5) {
    return (
      <InsightCard
        color="negative"
        text={`More than 50% of commits from one country (${sorted[0]["id"]})`}
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
  const data = geo_query.data["github_repos_contributors_countries"] as Record<
    string,
    any
  >[];
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["id"] != null);

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
  const { data: session } = useSession();
  if (session) {
    return null;
  }
  return (
    <button
      onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
      className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-md shadow"
    >
      Sign Up
    </button>
  );
}

export default GeoSection;
