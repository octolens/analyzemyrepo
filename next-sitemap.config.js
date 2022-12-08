import { prisma } from "./src/server/db/client";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://analyzemyrepo.com",
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    // get all repos from database
    const repos = await prisma.github_clean_repos.findMany({
      select: {
        full_name: true,
      },
    });

    return repos.map((repo) => ({
      loc: `https://analyzemyrepo.com/analyze/${repo.full_name}`,
      lastmod: new Date().toISOString(),
    }));
  },
};
