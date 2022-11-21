import { ResponsiveRadar } from "@nivo/radar";
import { type ChecksType } from "./NewOverview";

const normalize = (value: number, relative: number, absolute = 8) => {
  return value * (absolute / relative);
};

const RadarChart = ({
  score_data,
  checks,
}: {
  score_data: Record<string, number> | undefined;
  checks: ChecksType | undefined;
}) => {
  if (!score_data || !checks) {
    return null;
  }

  let data;

  if (checks.diversity.geo_diversity == null) {
    data = [
      {
        metric: "Adoption",
        repo: normalize(score_data?.adoption_score ?? 0, 4),
      },
      {
        metric: "Community",
        repo: normalize(score_data?.community_score ?? 0, 8),
      },
      {
        metric: "Contribution",
        repo: normalize(score_data?.contribution_score ?? 0, 3),
      },
    ];
  } else {
    data = [
      {
        metric: "Adoption",
        repo: normalize(score_data?.adoption_score ?? 0, 4),
      },
      {
        metric: "Diversity",
        repo: normalize(score_data?.diversity_score ?? 0, 4),
      },
      {
        metric: "Governance",
        repo: normalize(score_data?.community_score ?? 0, 8),
      },
      {
        metric: "Contribution",
        repo: normalize(score_data?.contribution_score ?? 0, 3),
      },
    ];
  }
  return (
    <ResponsiveRadar
      data={data}
      maxValue={8}
      valueFormat=">-.2f"
      indexBy="metric"
      keys={["repo"]}
      margin={{ top: 20, right: 40, bottom: 40, left: 60 }}
      gridShape="circular"
      gridLabelOffset={10}
    />
  );
};

export default RadarChart;

const RadarSkeleton = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={384}
      height={320}
      className="animate-pulse"
    >
      <rect width={384} height={320} fill="transparent" />
      <g transform="translate(60,20)">
        <g transform="translate(142, 130)">
          <circle fill="none" r={130} stroke="#dddddd" strokeWidth={1} />
          <circle fill="none" r={104} stroke="#dddddd" strokeWidth={1} />
          <circle fill="none" r={78} stroke="#dddddd" strokeWidth={1} />
          <circle fill="none" r={52} stroke="#dddddd" strokeWidth={1} />
          <circle fill="none" r={26} stroke="#dddddd" strokeWidth={1} />
        </g>
      </g>
    </svg>
  );
};

export { RadarSkeleton };
