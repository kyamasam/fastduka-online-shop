import { serverQueryContent } from "#content/server";
import { SitemapStream, streamToPromise } from "sitemap";

export default defineEventHandler(async (event) => {
  // Set proper content type for XML
  setHeader(event, "content-type", "application/xml");

  // Get domain with fallback
  const domain = process.env.DOMAIN ;

  // Fetch all documents
  const docs = await serverQueryContent(event).find();
  const sitemap = new SitemapStream({
    hostname: `https://${domain}`,
  });

  // Add static routes
  sitemap.write({
    url: "/",
    changefreq: "weekly",
    priority: 1.0,
  });

  // Add dynamic content routes
  for (const doc of docs) {
    sitemap.write({
      url: doc._path,
      changefreq: "monthly",
      priority: 0.8,
    });
  }

  sitemap.end();

  return streamToPromise(sitemap);
});
