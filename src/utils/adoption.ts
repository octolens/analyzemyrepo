import { count_true } from "./common";

export const check_forks = (data: Record<string, any>) => {
  if (data.forks_count >= 30) {
    return true;
  }
  return false;
};

export const check_stars = (data: Record<string, any>) => {
  if (data.stargazers_count >= 1000) {
    return true;
  }
  return false;
};

export const check_rating = (data: Record<string, any>) => {
  if (data.rank <= 10000) {
    return true;
  }
  return false;
};

export const check_issues = (data: Record<string, any>) => {
  if (data.open_issues >= 10) {
    return true;
  }
  return false;
};

export const calculate_adoption_verdict = ({
  forks,
  stars,
  rating,
  issues,
}: {
  forks: boolean;
  stars: boolean;
  rating: boolean;
  issues: boolean;
}) => {
  const score = count_true([forks, stars, rating, issues]);
  return {
    verdict: score > 2,
    score: score,
  };
};
