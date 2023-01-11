import { createRouter } from "./context";
import { z } from "zod";
import path from "path";
import { promises as fs } from "fs";

export const postgresRouter = createRouter()
  .query("get_repo_rank", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ ctx, input }) {
      const client = ctx.prisma;
      return client.repos_rank.findUnique({
        where: {
          full_name: `${input.owner}/${input.repo}`,
        },
      });
    },
  })
  .query("get_repo_contributors_countries", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ ctx, input }) {
      const client = ctx.prisma;
      const data = await client.github_repos_contributors_countries.findMany({
        where: {
          full_name: `${input.owner}/${input.repo}`,
        },
      });
      return data;
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
  })
  .mutation("add_parse_request", {
    input: z.object({
      full_name: z.string(),
      user_id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const client = ctx.prisma;
      const request = await client.user_parse_request.create({
        data: {
          full_name: input.full_name,
          userId: input.user_id,
        },
      });

      return request.request_id;
    },
  })
  .query("get_repo_contributors_companies", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ ctx, input }) {
      const client = ctx.prisma;
      const data = client.github_repos_contributors_companies.findMany({
        where: {
          full_name: `${input.owner}/${input.repo}`,
        },
      });

      return data;
    },
  })
  .query("get_repo_history", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ ctx, input }) {
      const client = ctx.prisma;
      const data = client.github_raw_repos.findMany({
        where: {
          full_name: `${input.owner}/${input.repo}`,
        },
        orderBy: [
          {
            updated_at: "desc",
          },
        ],
        take: 10,
      });

      return data;
    },
  })
  .mutation("subscribe_to_newsletter", {
    input: z.object({
      email: z.string(),
      consent: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      const client = ctx.prisma;
      const request = await client.newsletter_subscriptions.create({
        data: {
          email: input.email,
          consent: input.consent,
          email_type: "monthly_newsletter",
        },
      });

      return request;
    },
  });
