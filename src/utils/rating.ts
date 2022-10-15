import {
  check_forks,
  check_stars,
  check_rating,
  check_issues,
  calculate_adoption_verdict,
} from "./adoption";

import {
  check_serious_contributors,
  check_bus_factor,
  check_contributors_count,
} from "./contributions";

export const checks = {
  adoption: {
    forks: { check: check_forks },
    stars: { check: check_stars },
    rating: { check: check_rating },
    issues: { check: check_issues },
    calculate_verdict: calculate_adoption_verdict,
  },
  contribution: {
    bus_factor: { check: check_bus_factor },
    serious_contributors: { check: check_serious_contributors },
    contributors_count: { check: check_contributors_count },
  },
  diversity: {
    geo_dominance: {},
    geo_density: {},
    org_dominance: {},
  },
  community: {
    description: {},
    website: {},
    code_of_conduct: {},
    contributing_md: {},
    issue_template: {},
    pr_template: {},
    license: {},
    readme: {},
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
