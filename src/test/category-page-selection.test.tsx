import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryPage } from "@/components/category-page";
import { getCategory } from "@/lib/categories";
import { routeTree } from "@/routeTree.gen";

function renderCategory(slug: string) {
  const category = getCategory(slug);
  if (!category) throw new Error(`Missing category ${slug}`);
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  return render(
    <RouterProvider router={router}>
      <CategoryPage category={category} />
    </RouterProvider>,
  );
}

describe("Category page selection", () => {
  it("keeps the smart-locks category on its own earlier page", () => {
    const { container } = renderCategory("smart-locks");

    expect(screen.getByText("Which FamiLock is Right For You?")).toBeInTheDocument();
    expect(screen.getByText("The eufy Solution")).toBeInTheDocument();
    expect(screen.getByText("Why Choose eufy FamiLock?")).toBeInTheDocument();
    expect(container.querySelector("[data-category-reference]")).toBeNull();
  });

  it("renders the copied reference page for another category", () => {
    const { container } = renderCategory("robot-vacuums");

    expect(container.querySelector("[data-category-reference]")).not.toBeNull();
    expect(screen.queryByText("Which FamiLock is Right For You?")).toBeNull();
  });
});
