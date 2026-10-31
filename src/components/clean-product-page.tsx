import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import parse, { domToReact, Element, type HTMLReactParserOptions } from "html-react-parser";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { StoreHeader, StoreFooter } from "@/components/store-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { products, type Product } from "@/lib/products";
import fullSource from "@/lib/clean-product-full.html?raw";
import modelSource from "@/lib/clean-product-full-template.html?raw";
import referenceCss from "@/lib/clean-product-full.css?raw";
import overrides from "@/lib/clean-product-full-overrides.css?raw";
import media from "@/lib/clean-product-full-media.json";

export function CleanProductPage({ product }: { product: Product }) {
  const host = useRef<HTMLDivElement>(null);
  const [root, setRoot] = useState<ShadowRoot | null>(null);
  const [mode, setMode] = useState("Products");
  const [image, setImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [purchase, setPurchase] = useState(false);
  const [copied, setCopied] = useState(false);
  const original = product.slug === "eufy-robot-vacuum-omni-s2";
  const gallery = original ? media.gallery : product.gallery;
  const scenes = original ? media.features : product.scenes.length ? product.scenes : gallery;
  const images = mode === "Products" ? gallery : scenes;
  const external = product.url ?? `https://www.eufy.com/search?q=${encodeURIComponent(product.name)}`;
  const related = products.filter(p => p.category === product.category);
  useEffect(() => { if (host.current) setRoot(host.current.shadowRoot ?? host.current.attachShadow({ mode: "open" })); }, []);
  const go = (id: string) => root?.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  let sectionIndex = 0;
  const options: HTMLReactParserOptions = { replace(node) {
    if (!(node instanceof Element)) return undefined;
    const slot = node.attribs["data-clean-slot"];
    if (slot === "navigation") return <header className="faithful-nav"><div><h1>{product.name}</h1><nav>{[["Select", "clean-select"], ["Overview", "clean-overview"], ["Detail", "clean-detail"], ["No reviews", "clean-reviews"]].map(([label, id]) => <Button key={label} variant="ghost" onClick={() => go(id ?? "clean-select")}>{label}</Button>)}</nav></div><div className="faithful-actions"><strong>{product.price}</strong><Button variant="outline" onClick={() => setPurchase(true)}>Add to Cart</Button><Button onClick={() => setPurchase(true)}>Buy Now</Button></div></header>;
    if (slot === "gallery") return <div className={node.attribs.class}><div className="faithful-gallery"><div className="faithful-gallery-frame"><img src={images[image]} alt={product.name} decoding="async" fetchPriority="high"/><Button className="gallery-arrow previous" variant="ghost" size="icon" aria-label="Previous image" onClick={() => setImage((image - 1 + images.length) % images.length)}><ChevronLeft/></Button><Button className="gallery-arrow next" variant="ghost" size="icon" aria-label="Next image" onClick={() => setImage((image + 1) % images.length)}><ChevronRight/></Button></div><div className="faithful-gallery-tabs">{["Products", "Key Features", "Scene"].map(label => <Button key={label} variant="ghost" aria-pressed={mode === label} onClick={() => { setMode(label); setImage(0); }}>{label}</Button>)}</div><div className="faithful-thumbnails">{images.map((src, i) => <Button key={`${src}-${i}`} variant="ghost" aria-label={`Image ${i + 1}`} aria-pressed={image === i} onClick={() => setImage(i)}><img src={src} alt="" loading="lazy"/></Button>)}</div></div></div>;
    if (slot === "order") return <section className="faithful-order"><h2>{product.name} is Ready<br/>Add to Your Cart Now.</h2><div><span>{product.name} ×{quantity}</span><strong>{product.price}</strong><Button variant="outline" onClick={() => setPurchase(true)}>Add to Cart</Button><Button onClick={() => setPurchase(true)}>Buy Now</Button></div></section>;
    if (slot === "skip") return <></>;
    if (slot === "benefits") return <div className="faithful-benefits"><h2>Your Benefits</h2><p>{product.price}</p>{product.saved && <p>Saved {product.saved}</p>}<details><summary>Shipping Info</summary><a href="https://www.eufy.com/policies/shipping-policy" target="_blank" rel="noreferrer">Shipping policy</a></details><details><summary>Warranty &amp; Returns</summary><a href="https://www.eufy.com/policies/refund-policy" target="_blank" rel="noreferrer">Warranty &amp; Returns</a></details></div>;
    if (slot === "highlights") return <div className="faithful-highlights"><h2>Highlights</h2><Button variant="link" onClick={() => go("clean-detail")}>View Details</Button><ul>{product.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>;
    if (slot === "choices") return <div className="faithful-choices"><h2>Choice</h2>{related.map(p => <Link key={p.slug} to="/products/$product" params={{product:p.slug}} aria-current={p.slug === product.slug ? "page" : undefined}><img src={p.image} alt=""/><span>{p.name}<br/><strong>{p.price}</strong></span></Link>)}<div className="faithful-quantity"><span>Quantity</span><div><Button variant="ghost" size="icon" aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}><Minus/></Button><span aria-live="polite">{quantity}</span><Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Plus/></Button></div></div></div>;
    if (slot === "protection") return <div className="faithful-benefits"><h2>Warranty &amp; Returns</h2><a href="https://www.eufy.com/policies/refund-policy" target="_blank" rel="noreferrer">View Details</a></div>;
    if (slot === "model-section") {
      const index = sectionIndex++;
      // Preserve every original section wrapper without attributing S2 claims to another model.
      const headings = ["Feature Overview", ...product.details, "Detail", "Specs"];
      if (index >= headings.length) return <></>;
      return <section className="faithful-model-section" id={index === 1 ? "clean-detail" : undefined}><h2>{headings[index]}</h2>{index === headings.length - 1 ? <dl>{product.specs.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : <><img src={scenes[index % scenes.length]} alt={product.name} loading="lazy"/><p>{product.description}</p></>}</section>;
    }
    if (slot === "reviews") return <section className="faithful-model-section" id="clean-reviews"><h2>Customer Reviews</h2><p>No reviews</p><Button variant="outline" onClick={() => setPurchase(true)}>Write a review</Button></section>;
    const text = node.children.map(child => child.type === "text" ? child.data : "").join(" ").trim();
    if (node.name === "button" || (node.name === "a" && text === "Copy Code")) {
      const label = node.attribs["aria-label"] ?? text;
      return <Button className={node.attribs.class} variant="ghost" aria-label={label || "View Details"} onClick={async () => {
        if (label === "Copy Code") { try { await navigator.clipboard.writeText("WS24T2081T291P2"); setCopied(true); } catch { setCopied(false); } }
        else if (label === "View Details" || label === "View More") go("clean-overview");
        else setPurchase(true);
      }}>{label === "Copy Code" && copied ? "Copied" : domToReact(node.children as Parameters<typeof domToReact>[0], options)}</Button>;
    }
    if (node.name === "a" && node.attribs.href?.startsWith("/products/")) return <a href={`https://www.eufy.com${node.attribs.href}`} target="_blank" rel="noreferrer" className={node.attribs.class}>{domToReact(node.children as Parameters<typeof domToReact>[0], options)}</a>;
    return undefined;
  }};
  return <><StoreHeader/><div ref={host}/>{root && createPortal(<><style>{referenceCss}{overrides}</style>{parse(original ? fullSource : modelSource, options)}</>, root)}<StoreFooter/><Dialog open={purchase} onOpenChange={setPurchase}><DialogContent><DialogTitle>Continue with eufy</DialogTitle><DialogDescription>Purchases and services are completed on the official eufy store. No order has been placed here.</DialogDescription><p>{product.name} · Quantity: {quantity}</p><Button asChild><a href={external} target="_blank" rel="noreferrer">Continue to eufy</a></Button></DialogContent></Dialog></>;
}