import { createRouter } from "./context";
import { z } from "zod";

export type EmbeddingSearchResult = {
  id: string;
  score: number;
  full_name: string;
  description: string;
  topics: string[];
  stargazers_count: number;
};

export const embeddingsRouter = createRouter()
  .mutation("search", {
    input: z.object({
      query: z.string().max(255),
      limit: z.number().min(1).max(100).default(10),
    }),
    async resolve({ input, ctx }): Promise<EmbeddingSearchResult[]> {
      const url = process.env.EMBEDDINGS_URL as string;
      const request = await fetch(`${url}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ("Bearer " + process.env.EMBEDDINGS_TOKEN) as string,
        },
        body: JSON.stringify({
          query: input.query,
          limit: input.limit,
        }),
      });

      const data = await request.json();
      return data.map((item: any) => {
        return {
          id: item.id as string,
          score: item.score as number,
          full_name: item.payload.full_name as string,
          description: item.payload.description as string,
          topics: (item.payload.topics as string).split("|"),
          stargazers_count: item.payload.stargazers_count as number,
        };
      });
    },
  })
  .mutation("vote", {
    input: z.object({
      query: z.string(),
      vote: z.enum(["up", "down"]),
    }),
    async resolve({ input, ctx }): Promise<void> {
      await ctx.prisma.ai_search_feedback.create({
        data: {
          query: input.query,
          vote: input.vote == "up" ? true : false,
        },
      });
    },
  });
