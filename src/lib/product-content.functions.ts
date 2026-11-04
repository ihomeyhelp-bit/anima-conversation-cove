import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type ProductBundle = { name: string; price: string; note: string; image: string };
export type ProductContent = { name: string; price_cents: number; gallery: string[]; scenes: string[]; details: string[]; bundles: ProductBundle[] };

export const getProductContent = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => ({ slug: String(input.slug) }))
  .handler(async ({ data }): Promise<ProductContent | null> => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const sb = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization"); h.set("apikey", key); return fetch(input, { ...init, headers: h }); } },
    });
    const { data: row, error } = await sb.from("products").select("name, price_cents, gallery, scenes, details, bundles, custom_page").eq("slug", data.slug).eq("active", true).maybeSingle();
    if (error) { console.error("product content", error.message); return null; }
    if (!row || !row.custom_page) return null;
    const bundles = (Array.isArray(row.bundles) ? row.bundles : []) as unknown as ProductBundle[];
    return { name: row.name, price_cents: row.price_cents, gallery: row.gallery, scenes: row.scenes, details: row.details.filter(Boolean), bundles: bundles.filter((b) => b && b.name) };
  });
