import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { ResponsiveChoropleth } from "@nivo/geo";
import { useState } from "react";

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
    <div className="flex mx-auto">
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
}) => (
  <ResponsiveChoropleth
    data={data}
    features={features}
    value={value} // value accessor
    margin={{ top: 50, right: 0, bottom: 50, left: 0 }}
    colors="oranges"
    domain={[0, calculate_color_max({ data: data, key: value })]}
    unknownColor="#ffffff"
    label="properties.name"
    valueFormat=".2s"
    projectionTranslation={[0.5, 0.5]}
    projectionRotation={[0, 0, 0]}
    enableGraticule={true}
    graticuleLineColor="#dddddd"
    borderWidth={0.5}
    borderColor="#152538"
    legends={[
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
    ]}
  />
);

const calculate_color_max = ({
  data,
  key,
}: {
  data: Record<string, any>[];
  key: string;
}) => {
  return Math.max(...data.map((o) => o[key]));
};

const GeoSection = ({ section_id = "Geo Map" }: { section_id: string }) => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const [geoCalcType, setGeoCalcType] = useState<
    "commits_count" | "contributors_count"
  >("commits_count");

  // dynamically computer min and max

  const geo_query = trpc.useQuery([
    "hasura.get_repo_contributors_countries",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const json_query = trpc.useQuery(["hasura.get_static_json"]);

  // here might be a case when I don't have info about this repo - what to do?
  // I can try to fetch that data in real-time or say sorry, no data for this repo (or better not to show this section at all)
  // real time is unlikely, because I need to do so many requests - would take minutes.\
  // another variant is to ask people to signup - might work well

  return (
    <section className="flex flex-col gap-3" id={section_id}>
      <h2 className="text-center font-extrabold text-3xl py-2">Geo Map</h2>
      <RadioHorizontal
        radio_names={["commits_count", "contributors_count"]}
        active_radio_name={geoCalcType}
        setRadioName={setGeoCalcType}
      />
      {json_query.isLoading || geo_query.isLoading ? (
        <div className="w-[700px] h-80 mx-auto animate-pulse bg-gray-200 rounded-lg"></div>
      ) : (
        <div className="w-[700px] h-80 mx-auto">
          <GeoChart
            features={json_query.data["features"]}
            data={geo_query.data["github_repos_contributors_countries"]}
            value={geoCalcType}
          />
        </div>
      )}
    </section>
  );
};

export default GeoSection;
