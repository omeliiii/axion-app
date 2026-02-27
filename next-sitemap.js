/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://axionleagues.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
