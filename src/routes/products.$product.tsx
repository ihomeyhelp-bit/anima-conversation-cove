import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductPage } from "@/components/product-page";
import { getProduct } from "@/lib/products";
export const Route = createFileRoute("/products/$product")({
 loader: ({params})=> {const product=getProduct(params.product);if(!product)throw notFound();return product;},
 head: ({loaderData})=> {const title=loaderData ? `${loaderData.name} | eufy` : "Product unavailable | eufy";const description=loaderData?.description ?? "Discover eufy smart home products.";return {meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]};},
 component: ProductRoute,
});
function ProductRoute(){const product=Route.useLoaderData();return <ProductPage key={product.slug} product={product} />;}
