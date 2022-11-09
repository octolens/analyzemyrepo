import { createRouter } from "./context";
import { z } from "zod";

// Radar;
// StarChart;
// ForksChart;
// ContributorsChart;
// BusFactorChart;
// SeriousFactorChart;
// GeoDistributionChart;
// CompanyDistributionChart;
// CommunityGuidelinesChart;

export const dataURLRouter = createRouter()
  .mutation("upsert", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
      type: z.enum([
        "Radar",
        "StarChart",
        "ForksChart",
        "ContributorsChart",
        "BusFactorChart",
        "SeriousFactorChart",
        "GeoDistributionChart",
        "CompanyDistributionChart",
        "CommunityGuidelinesChart",
      ]),
      data_url: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { owner, repo, type, data_url } = input;
      const client = ctx.prisma;
      const data = await client.data_url_for_sharing.upsert({
        where: {
          full_name_type: {
            full_name: `${owner}/${repo}`,
            type: type,
          },
        },
        create: {
          full_name: `${owner}/${repo}`,
          type: type,
          data_url: data_url,
        },
        update: {
          data_url: data_url,
        },
      });
      return data;
    },
  })
  .query("get", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
      type: z.enum([
        "Radar",
        "StarChart",
        "ForksChart",
        "ContributorsChart",
        "BusFactorChart",
        "SeriousFactorChart",
        "GeoDistributionChart",
        "CompanyDistributionChart",
        "CommunityGuidelinesChart",
      ]),
    }),
    async resolve({ input, ctx }) {
      const { owner, repo, type } = input;
      const client = ctx.prisma;
      const data = await client.data_url_for_sharing.findUnique({
        where: {
          full_name_type: {
            full_name: `${owner}/${repo}`,
            type,
          },
        },
      });
      return data;
    },
  });
