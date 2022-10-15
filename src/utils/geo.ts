import { inferQueryOutput } from "./trpc";

export const check_geo_diversity = (
  data: inferQueryOutput<"postgres.get_repo_contributors_countries">
) => {
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["country"] != null);

  if (sorted[0] == undefined) {
    return false;
  }

  return sorted[0].commits_perc < 0.5;
};

export const check_geo_density = (
  data: inferQueryOutput<"postgres.get_repo_contributors_countries">
) => {
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["country"] != null);

  if (sorted[0] == undefined) {
    return null;
  }

  const count_more_3 = sorted.filter((x) => x["commits_perc"] >= 0.03).length;

  return count_more_3 > 2;
};
