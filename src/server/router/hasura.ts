import { createRouter } from "./context";
import { z } from "zod";
import path from "path";
import { promises as fs } from "fs";

export const hasuraRouter = createRouter()
  .query("get_repo_rank", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `${process.env.HASURA_URL as string}/api/rest/get_repo_rank`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_SECRET as string,
          },
          body: JSON.stringify({
            full_name: `${input.owner}/${input.repo}`,
          }),
        }
      );

      return response.json();
    },
  })
  .query("get_repo_contributors_countries", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `${
          process.env.HASURA_URL as string
        }/api/rest/get_repo_contributors_countries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_SECRET as string,
          },
          body: JSON.stringify({
            full_name: `${input.owner}/${input.repo}`,
          }),
        }
      );

      // in case of repo is not found, this endpoint will return
      //     {
      //     "github_repos_contributors_countries": []
      //     }

      return response.json();
    },
  })
  .query("get_static_json", {
    async resolve() {
      const jsonDirectory = path.join(process.cwd(), path.join("src", "json"));
      //Read the json data file data.json
      const fileContents = await fs.readFile(
        jsonDirectory + "/data.json",
        "utf8"
      );
      //Return the content of the data file in json format
      return JSON.parse(fileContents);
    },
  })
  .query("get_serious_contributors", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ ctx, input }) {
      const client = ctx.prisma;
      const data = await client.github_repos_serious_contributors.findFirst({
        where: { full_name: `${input.owner}/${input.repo}` },
      });

      return {
        serious_commiters: Number(data?.serious_commiters),
        total_commiters: Number(data?.total_commiters),
      };
    },
  });
