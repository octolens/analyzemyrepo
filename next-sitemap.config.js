/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://analyzemyrepo.com",
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ["/api/*", "/auth/*", "/dashboard"],
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    // use `prisma` in your application to read and write data in your DB
    const repos = await prisma.github_clean_repos.findMany({
      select: {
        full_name: true,
      },
      orderBy: {
        stargazers_count: "desc",
      },
    });
    return repos.map((repo) => ({
      loc: `https://analyzemyrepo.com/analyze/${repo.full_name}`,
      lastmod: new Date().toISOString(),
    }));
  },
};
