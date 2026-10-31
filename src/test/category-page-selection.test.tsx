import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getCategory } from "@/lib/categories";
import { routeTree } from "@/routeTree.gen";

async function renderCategory(slug: string) {
  const category = getCategory(slug);
  if (!category) throw new Error(`Missing category ${slug}`);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [`/category/${slug}`] }),
    context: { queryClient: new QueryClient() },
  });
  await router.load();
  const result = render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { name: new RegExp(slug === "smart-locks" ? "FamiLock" : "iHOMEY", "i") }).catch(() => undefined);
  return { category, ...result };
}

describe("Category page selection", () => {
  it("keeps the smart-locks category on its own earlier page", async () => {
    const { container } = await renderCategory("smart-locks");

    expect(screen.getByText("Which FamiLock is Right For You?")).toBeInTheDocument();
    expect(screen.getByText("The eufy Solution")).toBeInTheDocument();
    expect(screen.getByText("Why Choose eufy FamiLock?")).toBeInTheDocument();
    expect(container.querySelector("[data-category-reference]")).toBeNull();
  });

  it("applies the same earlier page design to robot-vacuums with its own content", async () => {
    const { container } = await renderCategory("robot-vacuums");

    expect(screen.getByText("Why Choose eufy Robot Vacuums?")).toBeInTheDocument();
    expect(screen.getAllByText("Anker eufy Robot Vacuum Omni E35").length).toBeGreaterThan(0);
    expect(container.querySelector("[data-category-reference]")).toBeNull();
  });

  it("renders the copied reference page for another category", async () => {
    const { container } = await renderCategory("outdoor-cameras");

    const host = container.querySelector("[data-category-reference]");
    expect(host).not.toBeNull();
    expect(host?.shadowRoot?.textContent ?? "").not.toHaveLength(0);
    expect(screen.queryByText("Which FamiLock is Right For You?")).toBeNull();
  });
});
