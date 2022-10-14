// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { protectedExampleRouter } from "./protected-example-router";
import { githubRouter } from "./github";
import { postgresRouter } from "./postgres";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", protectedExampleRouter)
  .merge("github.", githubRouter)
  .merge("postgres.", postgresRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
