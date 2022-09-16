import { createRouter } from "./context";
import { z } from "zod";

const commitsRegExp = /&page=(\d+)>; rel="last"/;

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

      const headers = response.headers;
      const link = headers.get("Link") as string;
      const matches = link.match(commitsRegExp);
      return { commits: matches?.[1] };
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

      const headers = response.headers;
      const link = headers.get("Link") as string;
      if (link) {
        const matches = link.match(commitsRegExp);
        if (matches) {
          return { open_prs: matches?.[1] };
        } else {
          return { open_prs: 1 };
        }
      } else {
        return { open_prs: 1 };
      }
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

      const headers = response.headers;
      const link = headers.get("Link") as string;
      const matches = link.match(commitsRegExp);

      return { branches: matches?.[1] };
    },
  });
