import { inferQueryOutput } from "./trpc";

export const checks_texts: Record<string, any> = {
  description: { good: "Repo has description", bad: "Repo has no description" },
  documentation: {
    good: "Repo has a link to a website",
    bad: "Repo has no link to a website",
  },
  code_of_conduct: {
    good: "Repo has Code of Conduct",
    bad: "Repo has no Code of Conduct",
  },
  contributing: {
    good: "Repo has Contributing.md file",
    bad: "Repo has no Contributing.md file",
  },
  issue_template: {
    good: "Repo has issue template",
    bad: "Repo has no issue template",
  },
  pull_request_template: {
    good: "Repo has pull request template",
    bad: "Repo has no pull request template",
  },
  license: { good: "Repo has license", bad: "Repo has no license" },
  readme: { good: "Repo has README", bad: "Repo has no README" },
  default: "Not enough data to run this check",
};

export const count_community_score = (
  data: inferQueryOutput<"github.get_community_health">
) => {
  const one_if_not_null = (value: any) => (value !== null ? 1 : 0) as number;

  const score = [
    data.description,
    data.documentation,
    data.files.code_of_conduct,
    data.files.contributing,
    data.files.issue_template,
    data.files.pull_request_template,
    data.files.license,
    data.files.readme,
  ]
    .map(one_if_not_null)
    .reduce((prev, curr) => prev + curr);

  return score;
};

export const calculate_community_verdict = (
  data: inferQueryOutput<"github.get_community_health">
) => {
  const score = count_community_score(data);
  const true_if_not_null = (value: any) =>
    (value !== null ? true : false) as boolean;
  return {
    verdict: score > 2,
    score,
    results: {
      description: true_if_not_null(data.description),
      documentation: true_if_not_null(data.documentation),
      code_of_conduct: true_if_not_null(data.files.code_of_conduct),
      contributing: true_if_not_null(data.files.contributing),
      issue_template: true_if_not_null(data.files.issue_template),
      pull_request_template: true_if_not_null(data.files.pull_request_template),
      license: true_if_not_null(data.files.license),
      readme: true_if_not_null(data.files.readme),
    },
  };
};
