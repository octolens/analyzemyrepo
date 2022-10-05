import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { ResponsiveChoropleth } from "@nivo/geo";
// import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { useState } from "react";
import Tooltip from "../Tooltip/Tooltip";
import SimpleTable from "../Table/Table";

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

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

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
    valueFormat=".0f"
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
  return data
    .sort((a, b) => (a[key] < b[key] ? 1 : -1))
    .slice(0, 5 + 1)
    .filter((value) => value["id"] != null);
};

// const OrgChart = ({
//   data,
//   features,
//   value,
// }: {
//   data: Record<string, any>[];
//   features: any[];
//   value: string;
// }) => (
//   <ResponsiveCirclePacking
//     data={data}
//     margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
//     id="name"
//     value="loc"
//     colors={{ scheme: "nivo" }}
//     childColor={{
//       from: "color",
//       modifiers: [["brighter", 0.4]],
//     }}
//     padding={4}
//     enableLabels={true}
//     labelsSkipRadius={10}
//     labelTextColor={{
//       from: "color",
//       modifiers: [["darker", 2]],
//     }}
//     borderWidth={1}
//     borderColor={{
//       from: "color",
//       modifiers: [["darker", 0.5]],
//     }}
//   />
// );

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

  // here might be a case when I don't have info about this repo - what to do?
  // I can try to fetch that data in real-time or say sorry, no data for this repo (or better not to show this section at all)
  // real time is unlikely, because I need to do so many requests - would take minutes.\
  // another variant is to ask people to signup - might work well

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
        <div className="w-[700px] h-80 mx-auto animate-pulse bg-gray-200 rounded-lg"></div>
      ) : (
        <div className="flex flex-row">
          <div className="w-[700px] h-80 mx-auto">
            <GeoChart
              features={json_query.data["features"]}
              data={geo_query.data["github_repos_contributors_countries"]}
              value={geoCalcType}
            />
          </div>
          <div>
            <SimpleTable
              column_name="Top 5 Countries"
              rows={TableRowsArray({
                data: geo_query.data["github_repos_contributors_countries"],
                key: geoCalcType,
              })}
            />
          </div>
        </div>
      )}
    </section>
  );
};

const GeoToolTip = () => {
  return (
    <>
      <div className="z-10 w-72 text-sm font-light text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            How map is calculated
          </h3>
          <p>
            We analyze all quailified commits to the repo and collect all users
            from them. Then we "parse" users location based on information in
            their public profile. Because not all users specify their location
            or sometimes specify something unindentifible, this map is only
            approximate, but still can provide some insights into geography of
            your contributors.
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Commits_count vs contributors_count
          </h3>
          <p>
            You can select how you want the map to be calculated.{" "}
            <b>Commits_count </b>
            option highlights countries by the number of commits originating
            from this country, while <b>contributors_count</b> highlight
            countries based on number of contributors coming from particular
            country.
          </p>
        </div>
      </div>
    </>
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
    <div className="flex flex-row justify-around">
      {/* add a call country flags https://countryflagsapi.com/:filetype/:code */}
      <span>{value["id"]}</span>
      <span>{value[key]}</span>
    </div>
  ));
};

export default GeoSection;
