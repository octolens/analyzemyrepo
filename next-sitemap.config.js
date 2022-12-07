/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://analyzemyrepo.com",
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml"], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://analyzemyrepo.com/server-sitemap.xml", // <==== Add here
    ],
  },
};
