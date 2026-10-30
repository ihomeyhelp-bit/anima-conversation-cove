import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import parse, { domToReact, Element, type HTMLReactParserOptions } from "html-react-parser";
import source from "@/lib/original-product.html?raw";
import sourceCss from "@/lib/original-product.css?raw";
import media from "@/lib/original-product-media.json";
import { ProductGallery } from "@/components/product-gallery";
import { StoreHeader, StoreFooter } from "@/components/store-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Product } from "@/lib/products";

export function OriginalProductPage({product}:{product:Product}) {
 const host=useRef<HTMLDivElement>(null);const [root,setRoot]=useState<ShadowRoot|null>(null);const [purchase,setPurchase]=useState(false);const [copied,setCopied]=useState(false);
 useEffect(()=>{if(host.current)setRoot(host.current.shadowRoot ?? host.current.attachShadow({mode:"open"}));},[]);
 const options:HTMLReactParserOptions={replace:(node)=>{
  if(!(node instanceof Element))return;
  if(node.attribs['data-original-gallery']) return <div className="original-gallery-column"><div className="original-gallery-slot"><ProductGallery product={{...product,gallery:media.gallery,scenes:media.scenes}} /></div></div>;
  const action=node.attribs['data-original-action'];
  if(action) return <Button className={node.attribs.class} variant={action==='Copy Code' ? 'link' : action==='Add to Cart' ? 'outline' : 'default'} onClick={async()=>{if(action==='Copy Code'){try{await navigator.clipboard.writeText('WS24E85V0JY1');setCopied(true);}catch{setCopied(false);}}else setPurchase(true);}}>{action==='Copy Code' && copied ? 'Copied' : action}</Button>;
  if(node.name==='button') return <Button className={node.attribs.class} variant="ghost" aria-label={node.attribs['aria-label']}>{domToReact(node.children as Parameters<typeof domToReact>[0],options)}</Button>;
 }};
 return <><StoreHeader /><div ref={host} />{root && createPortal(<><style>{sourceCss}</style>{parse(source,options)}</>,root)}<StoreFooter /><Dialog open={purchase} onOpenChange={setPurchase}><DialogContent><DialogTitle>Continue with eufy</DialogTitle><DialogDescription>Purchases are completed on the official eufy store. No order has been placed here.</DialogDescription><Button asChild><a href="https://www.eufy.com/products/e85v0jy1" target="_blank" rel="noreferrer">Continue to eufy</a></Button></DialogContent></Dialog></>;
}
