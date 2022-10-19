import { calculate_adoption_verdict } from "./adoption";
import { calculate_contribution_verdict } from "./contributions";
import { calculate_diversity_verdict } from "./diversity";
import { calculate_community_verdict } from "./community";

export const checks = {
  adoption: {
    calculate_verdict: calculate_adoption_verdict,
  },
  contribution: {
    calculate_verdict: calculate_contribution_verdict,
  },
  diversity: {
    calculate_verdict: calculate_diversity_verdict,
  },
  community: {
    calclulate_verdict: calculate_community_verdict,
  },
  // growth: {
  //   issues_delta: {},
  //   stars_delta: {},
  //   forks_delta: {},
  //   commits_activity: {},
  // },
};

// python script
// from itertools import product
// words = ['adoption', 'contribution', 'diversity', "community", "growth"]
// signs = ['+', '-']
// d = dict()
// template_string = '{}'.join(words)
// template_string += '{}"
// for i in (product(signs, repeat=5)):
//   d[template_string.format(*i)] = ""
// print(d)
