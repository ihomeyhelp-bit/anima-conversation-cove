import { createFileRoute, notFound } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";
import { getCategory } from "@/lib/categories";

export const Route = createFileRoute("/category/$category")({
 loader: ({ params }) => { const category = getCategory(params.category); if (!category) throw notFound(); return category; },
 head: ({ loaderData }) => {
  const title = loaderData ? `${loaderData.name} | eufy` : "Category unavailable | eufy";
  const description = loaderData ? `Discover ${loaderData.name.toLowerCase()} from eufy. ${loaderData.subtitle}.` : "Explore eufy smart home products.";
  return { meta: [{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}] };
 },
 component: CategoryRoute,
});
function CategoryRoute() { return <CategoryPage key={Route.useLoaderData().slug} category={Route.useLoaderData()} />; }
