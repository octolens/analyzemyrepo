import { ResponsiveRadar } from "@nivo/radar";

const normalize = (value: number, relative: number, absolute = 8) => {
  return value * (absolute / relative);
};

const RadarChart = ({
  score_data,
}: {
  score_data: Record<string, number> | undefined;
}) => {
  if (!score_data) {
    return null;
  }
  return (
    <ResponsiveRadar
      data={[
        {
          metric: "Adoption",
          repo: normalize(score_data?.adoption_score ?? 0, 4),
        },
        {
          metric: "Diversity",
          repo: normalize(score_data?.diversity_score ?? 0, 4),
        },
        {
          metric: "Community",
          repo: normalize(score_data?.community_score ?? 0, 8),
        },
        {
          metric: "Contribution",
          repo: normalize(score_data?.contribution_score ?? 0, 3),
        },
      ]}
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
