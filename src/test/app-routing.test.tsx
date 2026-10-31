import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { categories, getCategory, categorySlug } from "@/lib/categories";
import { products, getProduct, effectivePrice } from "@/lib/products";
import { usesCleanProductLayout } from "@/lib/product-layout";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("uses the new reference only for robot vacuums and baby cameras", () => {
    expect(usesCleanProductLayout({category:"robot-vacuums"})).toBe(true);
    expect(usesCleanProductLayout({category:"baby-monitors"})).toBe(true);
    for (const category of ["smart-locks", "outdoor-cameras", "indoor-cameras", "breast-pumps", "video-doorbells", "poe-nvr-system"]) {
      expect(usesCleanProductLayout({category})).toBe(false);
    }
  });
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it.each(categories)("matches the $name category page", (category) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(`/category/${category.slug}`).at(-1)?.routeId).toBe("/category/$category");
    expect(getCategory(categorySlug(category.name))?.slug).toBe(category.slug);
  });
  it("does not resolve an unknown category", () => {
    expect(getCategory("not-a-category")).toBeUndefined();
  });
  it.each(products)("matches the $name product page", (product) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(`/products/${product.slug}`).at(-1)?.routeId).toBe("/products/$product");
    expect(getProduct(product.slug)?.name).toBe(product.name);
  });
  it("uses the reference S3 Max price and coupon", () => {
    const product = getProduct("eufy-familock-s3-max");
    expect(product).toBeDefined();
    if (!product) throw new Error("Missing product");
    expect(effectivePrice(product, false)).toBe(399.99);
    expect(effectivePrice(product, true)).toBeCloseTo(299.99, 2);
  });
});
