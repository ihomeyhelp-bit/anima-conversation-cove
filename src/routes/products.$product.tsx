import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProduct } from "@/lib/products";
import { getProductContent } from "@/lib/product-content.functions";
import { OriginalProductPage } from "@/components/original-product-page";
export const Route = createFileRoute("/products/$product")({
 loader: async ({params})=> {const base=getProduct(params.product);if(!base)throw notFound();const content=await getProductContent({data:{slug:base.slug}}).catch(()=>null);return {...base,...(content?{name:content.name,price:`$${(content.price_cents/100).toFixed(2)}`}:{}),content};},
 head: ({loaderData})=> {const title=loaderData ? `${loaderData.name} | iHOMEY` : "Product unavailable | iHOMEY";const description=loaderData?.description ?? "Discover iHOMEY smart home products.";return {meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"product"},{name:"twitter:card",content:"summary_large_image"},...(loaderData?[{property:"og:url",content:`https://anima-conversation-cove.lovable.app/products/${loaderData.slug}`}]:[])],links:loaderData?[{rel:"canonical",href:`https://anima-conversation-cove.lovable.app/products/${loaderData.slug}`}]:[],scripts:loaderData?[{type:"application/ld+json",children:JSON.stringify({"@context":"https://schema.org","@type":"Product",name:loaderData.name,description:loaderData.description,brand:{"@type":"Brand",name:"iHOMEY"},offers:{"@type":"Offer",priceCurrency:"USD",price:(loaderData.price ?? "").replace(/[^0-9.]/g,""),availability:"https://schema.org/InStock",url:`https://anima-conversation-cove.lovable.app/products/${loaderData.slug}`}})}]:[]};},
 component: ProductRoute,
});
function ProductRoute(){const product=Route.useLoaderData();return <OriginalProductPage key={product.slug} product={product} content={product.content} />;}
