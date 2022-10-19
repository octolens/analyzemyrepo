import { count_true } from "./common";
import { inferQueryOutput } from "./trpc";

export const checks_texts: Record<string, any> = {
  forks: {
    good: "More than 100 forks",
    bad: "Less than 100 forks",
  },
  stars: {
    good: "More than 1000 stars",
    bad: "Less than 1000 stars",
  },
  issues: {
    good: "More than 50 open issues (active usage of the product)",
    bad: "Less than 50 open issues",
  },
  rating: {
    good: "The repo is in top 10,000 by stars",
    bad: "Repo is not in top 10,000 by stars",
  },
  default: "Not enough data to run this check",
};

const check_forks = (data: Record<string, any>) => {
  if (data.forks_count > 100) {
    return true;
  }
  return false;
};

const check_stars = (data: Record<string, any>) => {
  if (data.stargazers_count >= 1000) {
    return true;
  }
  return false;
};

const check_rating = (data: Record<string, any> | null) => {
  if (!data) {
    return null;
  }
  if (data.rank <= 10000) {
    return true;
  }
  return false;
};

const check_issues = (data: Record<string, any>) => {
  if (data.open_issues >= 50) {
    return true;
  }
  return false;
};

export const calculate_adoption_verdict = ({
  rank_data,
  repo_data,
}: {
  rank_data: inferQueryOutput<"postgres.get_repo_rank"> | null | undefined;
  repo_data: inferQueryOutput<"github.get_github_repo">;
}) => {
  const forks = check_forks(repo_data);
  const stars = check_stars(repo_data);
  const issues = check_issues(repo_data);

  let rating: boolean | null = false;
  if (rank_data) {
    rating = check_rating(rank_data);
  }

  const score = count_true([forks, stars, rating, issues]);
  return {
    verdict: score > 2,
    score: score,
    results: { forks, stars, issues, rating },
  };
};
