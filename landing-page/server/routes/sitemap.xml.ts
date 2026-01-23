import { SitemapStream, streamToPromise } from "sitemap";

export default defineEventHandler(async () => {
  const sitemap = new SitemapStream({
    hostname: "https://" + process.env.DOMAIN,
  });

  // Add static routes
  sitemap.write({
    url: "/",
    changefreq: "weekly",
    priority: 1,
  });

  // Add more static routes here as needed
  // sitemap.write({
  //   url: "/about",
  //   changefreq: "monthly",
  //   priority: 0.8,
  // });

  sitemap.end();

  return streamToPromise(sitemap);
});
