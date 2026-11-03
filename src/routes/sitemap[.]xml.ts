import { createFileRoute } from "@tanstack/react-router";
import { categories } from "@/lib/categories";
import { products } from "@/lib/products";

const SITE = "https://anima-conversation-cove.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = ["/", ...categories.map((c) => `/category/${c.slug}`), ...products.map((p) => `/products/${p.slug}`)];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${SITE}${p}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
