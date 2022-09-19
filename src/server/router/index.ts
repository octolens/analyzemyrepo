// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { protectedExampleRouter } from "./protected-example-router";
import { githubRouter } from "./github";
import { hasuraRouter } from "./hasura";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", protectedExampleRouter)
  .merge("github.", githubRouter)
  .merge("hasura.", hasuraRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
