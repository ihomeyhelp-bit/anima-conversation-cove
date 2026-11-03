import { createFileRoute, notFound } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";
import { getCategory } from "@/lib/categories";
import referenceMedia from "@/lib/category-reference-media.json";

export const Route = createFileRoute("/category/$category")({
 loader: ({ params }) => { const category = getCategory(params.category); if (!category) throw notFound(); return category; },
 head: ({ loaderData }) => {
  const title = loaderData ? `${loaderData.name} | iHOMEY` : "Category unavailable | iHOMEY";
  const description = loaderData ? `Discover ${loaderData.name.toLowerCase()} from iHOMEY. ${loaderData.subtitle}.` : "Explore iHOMEY smart home products.";
  return { meta: [{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"},...(referenceMedia.hero.startsWith("https://") ? [{property:"og:image",content:referenceMedia.hero},{name:"twitter:image",content:referenceMedia.hero}] : []),...(loaderData?[{property:"og:url",content:`https://anima-conversation-cove.lovable.app/category/${loaderData.slug}`}]:[])], links: loaderData?[{rel:"canonical",href:`https://anima-conversation-cove.lovable.app/category/${loaderData.slug}`}]:[] };
 },
 component: CategoryRoute,
});
function CategoryRoute() { return <CategoryPage key={Route.useLoaderData().slug} category={Route.useLoaderData()} />; }
