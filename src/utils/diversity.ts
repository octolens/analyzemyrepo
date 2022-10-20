import { count_true } from "./common";
import { inferQueryOutput } from "./trpc";

export const checks_texts: Record<string, any> = {
  geo_diversity: {
    good: "None of the countries have more than 50% commits to the repo",
    bad: "More than 50% of commits from one country",
  },
  geo_density: {
    good: "More than 3 countries have more than 3% of commits",
    bad: "Less than 3 countries have more than 3% of commits",
  },
  org_diversity: {
    good: "None of the organizations have more than 50% commits to the repo",
    bad: "More than 50% of commits from one organization",
  },
  org_density: {
    good: "None of the organizations have more than 3% of commits",
    bad: "Less than 3 organizations have more than 3% of commits",
  },
  default: "Not enough data to run this check",
};

const check_geo_diversity = (
  data: inferQueryOutput<"postgres.get_repo_contributors_countries"> | undefined
) => {
  if (!data || data.length == 0) {
    return null;
  }
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["country"] != null);

  if (sorted[0] == undefined) {
    return false;
  }

  return sorted[0].commits_perc < 0.5;
};

const check_geo_density = (
  data: inferQueryOutput<"postgres.get_repo_contributors_countries"> | undefined
) => {
  if (!data || data.length == 0) {
    return null;
  }
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["country"] != null);

  if (sorted[0] == undefined) {
    return null;
  }

  const count_more_3 = sorted.filter((x) => x["commits_perc"] >= 0.03).length;

  return count_more_3 > 2;
};

const check_company_diversity = (
  data: inferQueryOutput<"postgres.get_repo_contributors_companies"> | undefined
) => {
  if (!data || data.length == 0) {
    return null;
  }
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["company_name"] != null);

  if (sorted[0] == undefined) {
    return null;
  }

  return sorted[0].commits_perc < 0.5;
};

const check_company_density = (
  data: inferQueryOutput<"postgres.get_repo_contributors_companies"> | undefined
) => {
  if (!data || data.length == 0) {
    return null;
  }
  const sorted = data
    .sort((a, b) => (a["commits_perc"] < b["commits_perc"] ? 1 : -1))
    .filter((value) => value["company_name"] != null);

  if (sorted[0] == undefined) {
    return null;
  }

  const count_more_3 = sorted.filter((x) => x["commits_perc"] >= 0.03).length;

  return count_more_3 > 2;
};

export const calculate_diversity_verdict = ({
  geo_data,
  org_data,
}: {
  geo_data:
    | inferQueryOutput<"postgres.get_repo_contributors_countries">
    | undefined;
  org_data:
    | inferQueryOutput<"postgres.get_repo_contributors_companies">
    | undefined;
}) => {
  const geo_diversity = check_geo_diversity(geo_data);
  const geo_density = check_geo_density(geo_data);
  const org_diversity = check_company_diversity(org_data);
  const org_density = check_company_density(org_data);

  const score = count_true([
    geo_diversity,
    geo_density,
    org_diversity,
    org_density,
  ]);

  return {
    verdict: score > 2,
    score,
    results: { geo_diversity, geo_density, org_diversity, org_density },
  };
};
