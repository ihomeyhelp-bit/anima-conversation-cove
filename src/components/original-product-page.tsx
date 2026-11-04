import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import parse, { domToReact, Element, type HTMLReactParserOptions } from "html-react-parser";
import source from "@/lib/original-product.html?raw";
import sourceCss from "@/lib/original-product.css?raw";
import media from "@/lib/original-product-media.json";
import templateCss from "@/lib/product-template.css?raw";
import { StoreHeader, StoreFooter } from "@/components/store-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Product } from "@/lib/products";
import type { ProductContent } from "@/lib/product-content.functions";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function OriginalProductPage({product,content}:{product:Product;content?:ProductContent|null}) {
 const host=useRef<HTMLDivElement>(null);const [root,setRoot]=useState<ShadowRoot|null>(null);const [purchase,setPurchase]=useState(false);const [copied,setCopied]=useState(false);
 const [image,setImage]=useState(0);const [mode,setMode]=useState("Products");
 const [quantity,setQuantity]=useState(1);const [bundle,setBundle]=useState(0);
 const original=product.slug==='eufy-familock-s3-max' || !!content;
 const gallery=content?.gallery.length ? content.gallery : media.gallery;const sceneImgs=content?.scenes.length ? content.scenes : media.scenes;const images=mode==='Scene' ? sceneImgs : gallery;
 const external=product.url ?? `https://www.eufy.com/search?q=${encodeURIComponent(product.name)}`;
 useEffect(()=>{if(host.current)setRoot(host.current.shadowRoot ?? host.current.attachShadow({mode:"open"}));},[]);
 const options:HTMLReactParserOptions={replace:(node)=>{
  if(!(node instanceof Element))return undefined;
  if(node.attribs['data-original-gallery']) return <div className="original-gallery-column"><div className="original-gallery-frame"><img src={images[image]} alt={product.name} /><span className="original-gallery-count">{image+1}/{images.length}</span><Button className="original-gallery-prev" aria-label="Previous image" onClick={()=>setImage((image-1+images.length)%images.length)}><ChevronLeft /></Button><Button className="original-gallery-next" aria-label="Next image" onClick={()=>setImage((image+1)%images.length)}><ChevronRight /></Button></div><div className="original-gallery-tabs">{['Products','Scene'].map(m=><Button key={m} variant="ghost" onClick={()=>{setMode(m);setImage(0);}}>{m}</Button>)}</div></div>;
  const edit=content ? node.attribs['data-edit'] : undefined;
   if(edit==='title') return <h1 className={node.attribs['class']}>{content!.name}</h1>;
   if(edit==='price') return <span className={node.attribs['class']}>${(content!.price_cents/100).toFixed(2)}</span>;
   if(edit==='details') return <div className={node.attribs['class']}><ul className="mb-4 pl-[15px]">{content!.details.map((d,i)=>{const k=d.indexOf(':');return <li key={i} className="mb-2">{k>0&&k<60?<><strong className="font-black">{d.slice(0,k+1)}</strong>{d.slice(k+1)}</>:d}</li>;})}</ul></div>;
   if(edit==='bundles') return <ul className="grid list-none gap-3 pl-0">{[{name:content!.name,price:(content!.price_cents/100).toFixed(2),note:'',image:gallery[0] ?? ''},...content!.bundles].map((b,i)=><li key={i}><Button variant="outline" className={`h-auto w-full justify-start gap-3 rounded-lg p-3 text-left ${bundle===i?'border-2 border-foreground':''}`} onClick={()=>setBundle(i)}>{b.image && <img src={b.image} alt="" className="h-14 w-14 object-contain" />}<span className="flex flex-col whitespace-normal"><span className="font-semibold">{b.name}</span><span>${Number(b.price||0).toFixed(2)}</span>{b.note && <span className="text-xs text-muted-foreground">{b.note}</span>}</span></Button></li>)}</ul>;
   const action=node.attribs['data-original-action'];
  if(action) return <Button className={node.attribs['class']} variant={action==='Copy Code' ? 'link' : action==='Add to Cart' ? 'outline' : 'default'} onClick={async()=>{if(action==='Copy Code'){try{await navigator.clipboard.writeText('WS24E85V0JY1');setCopied(true);}catch{setCopied(false);}}else setPurchase(true);}}>{action==='Copy Code' && copied ? 'Copied' : action}</Button>;
  if(node.name==='button') return <Button className={node.attribs['class']} variant="ghost" aria-label={node.attribs['aria-label']}>{domToReact(node.children as Parameters<typeof domToReact>[0],options)}</Button>;
  return undefined;
 }};
 return <><StoreHeader />{!original && <aside className="border-b border-border bg-muted px-6 py-3 text-sm text-foreground"><strong>{product.name}</strong> — Présentation provisoire : photos, prix et détails du FamiLock S3 Max.</aside>}<div ref={host} />{root && createPortal(<><style>{sourceCss}{templateCss}</style><main className="template-main">{parse(source,options)}</main></>,root)}<StoreFooter /><Dialog open={purchase} onOpenChange={setPurchase}><DialogContent><DialogTitle>Continue with eufy</DialogTitle><DialogDescription>Purchases are completed on the official eufy store. No order has been placed here.{!original && " The reference photos, price and specifications shown here are for FamiLock S3 Max, not the selected product. Confirm this product's details and price on the official store."}</DialogDescription><p>{content && bundle>0 ? content.bundles[bundle-1]?.name : product.name} · Quantity: {quantity}</p><Button asChild><a href={external} target="_blank" rel="noreferrer">Continue to eufy</a></Button></DialogContent></Dialog></>;
}
