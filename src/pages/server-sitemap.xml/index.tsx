// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap } from "next-sitemap";
import { GetServerSideProps } from "next";
import { prisma } from "../../server/db/client";

const WEBSITE_URL = "https://analyzemyrepo.com";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to source urls from cms
  const repos = await prisma.github_clean_repos.findMany({
    select: {
      full_name: true,
      updated_at: true,
    },
  });

  const fields = repos.map((repo) => {
    return {
      loc: `${WEBSITE_URL}/analyze/${repo.full_name}`,
      lastmod: repo.updated_at?.toISOString(),
      priority: 0.7,
    };
  });

  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
