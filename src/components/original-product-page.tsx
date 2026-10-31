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
import { ChevronLeft, ChevronRight } from "lucide-react";

export function OriginalProductPage({product}:{product:Product}) {
 const host=useRef<HTMLDivElement>(null);const [root,setRoot]=useState<ShadowRoot|null>(null);const [purchase,setPurchase]=useState(false);const [copied,setCopied]=useState(false);
 const [image,setImage]=useState(0);const [mode,setMode]=useState("Products");
 const [quantity,setQuantity]=useState(1);
 const original=product.slug==='eufy-familock-s3-max';
 const images=mode==='Scene' ? media.scenes : media.gallery;
 const external=product.url ?? `https://www.eufy.com/search?q=${encodeURIComponent(product.name)}`;
 useEffect(()=>{if(host.current)setRoot(host.current.shadowRoot ?? host.current.attachShadow({mode:"open"}));},[]);
 const options:HTMLReactParserOptions={replace:(node)=>{
  if(!(node instanceof Element))return undefined;
  if(node.attribs['data-original-gallery']) return <div className="original-gallery-column"><div className="original-gallery-frame"><img src={images[image]} alt="eufy FamiLock S3 Max" /><span className="original-gallery-count">{image+1}/{images.length}</span><Button className="original-gallery-prev" aria-label="Previous image" onClick={()=>setImage((image-1+images.length)%images.length)}><ChevronLeft /></Button><Button className="original-gallery-next" aria-label="Next image" onClick={()=>setImage((image+1)%images.length)}><ChevronRight /></Button></div><div className="original-gallery-tabs">{['Products','Scene'].map(m=><Button key={m} variant="ghost" onClick={()=>{setMode(m);setImage(0);}}>{m}</Button>)}</div></div>;
  const action=node.attribs['data-original-action'];
  if(action) return <Button className={node.attribs['class']} variant={action==='Copy Code' ? 'link' : action==='Add to Cart' ? 'outline' : 'default'} onClick={async()=>{if(action==='Copy Code'){try{await navigator.clipboard.writeText('WS24E85V0JY1');setCopied(true);}catch{setCopied(false);}}else setPurchase(true);}}>{action==='Copy Code' && copied ? 'Copied' : action}</Button>;
  if(node.name==='button') return <Button className={node.attribs['class']} variant="ghost" aria-label={node.attribs['aria-label']}>{domToReact(node.children as Parameters<typeof domToReact>[0],options)}</Button>;
  return undefined;
 }};
 return <><StoreHeader />{!original && <aside className="border-b border-border bg-muted px-6 py-3 text-sm text-foreground"><strong>{product.name}</strong> — Présentation provisoire : photos, prix et détails du FamiLock S3 Max.</aside>}<div ref={host} />{root && createPortal(<><style>{sourceCss}{templateCss}</style><main className="template-main">{parse(source,options)}</main></>,root)}<StoreFooter /><Dialog open={purchase} onOpenChange={setPurchase}><DialogContent><DialogTitle>Continue with eufy</DialogTitle><DialogDescription>Purchases are completed on the official eufy store. No order has been placed here.{!original && " The reference photos, price and specifications shown here are for FamiLock S3 Max, not the selected product. Confirm this product's details and price on the official store."}</DialogDescription><p>{product.name} · Quantity: {quantity}</p><Button asChild><a href={external} target="_blank" rel="noreferrer">Continue to eufy</a></Button></DialogContent></Dialog></>;
}
