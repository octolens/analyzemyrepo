import { createRouter } from "./context";
import { z } from "zod";

const commitsRegExp = /&page=(\d+)>; rel="last"/;

const checkHeaders = (headers: Headers, default_value: number = 0): number => {
  const link = headers.get("Link") as string;
  if (link) {
    const matches = link.match(commitsRegExp);
    if (matches) {
      return parseInt(matches?.[1] as string);
    } else {
      return default_value;
    }
  } else {
    return default_value;
  }
};

export const githubRouter = createRouter()
  .query("get_github_repo", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_2,
          },
        }
      );

      return response.json();
    },
  })
  .query("get_github_commits", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/commits?per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_2,
          },
        }
      );

      return { commits: checkHeaders(response.headers) };
    },
  })
  .query("get_github_open_prs", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/pulls?per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_2,
          },
        }
      );

      return { open_prs: checkHeaders(response.headers, 1) };
    },
  })
  .query("get_github_branches", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/branches?per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_2,
          },
        }
      );

      return { branches: checkHeaders(response.headers, 1) };
    },
  })
  .query("get_github_repo_contributors", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/contributors?per_page=100`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_2,
          },
        }
      );

      return response.json();
    },
  })
  .query("get_contributions_count", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response_all_commits = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/commits?per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_2,
          },
        }
      );

      const response_gh_pages_commits = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/commits?sha=gh-pages&per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_2,
          },
        }
      );

      const response_all_pulls = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/pulls?state=all&per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_2,
          },
        }
      );

      const response_all_issues = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/issues?state=all&per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_2,
          },
        }
      );

      const all_commits = checkHeaders(response_all_commits.headers, 1);
      const gh_pages_commits = checkHeaders(
        response_gh_pages_commits.headers,
        0
      );
      const all_pulls = checkHeaders(response_all_pulls.headers, 0);
      const all_issues = checkHeaders(response_all_issues.headers, 0);

      return {
        total_contributions:
          all_commits + gh_pages_commits + all_pulls + all_issues,
      };
    },
  });

// commits to main + all issues + all prs + all commits to gh-pages
