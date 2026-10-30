import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { categories, getCategory, categorySlug } from "@/lib/categories";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
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
});
