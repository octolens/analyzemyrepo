import { createRouter } from "./context";
import { z } from "zod";

export const githubRouter = createRouter().query("get_github_repo", {
  input: z.object({
    owner: z.string(),
    repo: z.string(),
  }),
  async resolve({ input }) {
    const data = await fetch(
      `https://api.github.com/repos/${input.owner}/${input.repo}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_2,
        },
      }
    );

    return data.json();
  },
});
