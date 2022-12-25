import { createRouter } from "./context";
import { z } from "zod";

export const embeddingsRouter = createRouter().query("search", {
  input: z.object({
    query: z.string().max(255),
    limit: z.number().min(1).max(100).default(10),
  }),
  async resolve({ input, ctx }) {
    const url = process.env.EMBEDDINGS_URL as string;
    const request = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.EMBEDDINGS_TOKEN,
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
});
