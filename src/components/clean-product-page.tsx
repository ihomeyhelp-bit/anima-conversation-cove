import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import parse, { Element } from "html-react-parser";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { StoreHeader, StoreFooter } from "@/components/store-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProductTemplateSections } from "@/components/product-template-sections";
import { products, type Product } from "@/lib/products";
import referenceCss from "@/lib/clean-product-reference.css?raw";
import features from "@/lib/clean-product-features.html?raw";
import media from "@/lib/clean-product-media.json";

export function CleanProductPage({ product }: { product: Product }) {
  const host = useRef<HTMLDivElement>(null);
  const [root, setRoot] = useState<ShadowRoot | null>(null);
  const [mode, setMode] = useState("Products");
  const [image, setImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [purchase, setPurchase] = useState(false);
  const isS2 = product.slug === "eufy-robot-vacuum-omni-s2";
  const gallery = isS2 ? media.gallery : product.gallery;
  const scenes = product.scenes.length ? product.scenes : gallery;
  const images = mode === "Scene" ? scenes : gallery;
  const related = products.filter(p => p.category === product.category && p.slug !== product.slug);
  const external = product.url ?? `https://www.eufy.com/search?q=${encodeURIComponent(product.name)}`;
  const highlights = isS2 ? ["HydroJet™ 2.0 Self-Cleaning Roller Mop", "Electrolyzed Water", "Deep Carpet Cleaning", "AirClean Filtration", "AeroTurbo™ 2.0 Fade-Free Suction", "DuoSpiral™ Detangle Brushes", "Full Edge-to-Corner Coverage", "All-in-One Station"] : product.details;
  useEffect(() => { if (host.current) setRoot(host.current.shadowRoot ?? host.current.attachShadow({ mode: "open" })); }, []);
  const go = (id: string) => root?.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  return <><StoreHeader /><div ref={host} />{root && createPortal(<><style>{referenceCss}</style><main className="clean-page">
    <div className="clean-product-nav"><h1>{product.name}</h1><div className="clean-nav-actions"><span>{product.price}</span><Button variant="outline" onClick={() => setPurchase(true)}>Add to Cart</Button><Button onClick={() => setPurchase(true)}>Buy Now</Button></div><nav>{[["Select", "clean-select"], ["Overview", "clean-overview"], ["Detail", "clean-detail"]].map(([label, id]) => <Button key={id} variant="ghost" onClick={() => go(id ?? "clean-select")}>{label}</Button>)}</nav></div>
    <div className="clean-select" id="clean-select"><div className="clean-gallery"><div className="clean-gallery-frame"><img src={images[image]} alt={product.name} decoding="async"/><Button className="clean-prev" variant="outline" size="icon" aria-label="Previous image" onClick={() => setImage((image - 1 + images.length) % images.length)}><ChevronLeft /></Button><Button className="clean-next" variant="outline" size="icon" aria-label="Next image" onClick={() => setImage((image + 1) % images.length)}><ChevronRight /></Button><div className="clean-thumbnails">{images.map((src, i) => <Button key={src} variant="outline" aria-label={`Image ${i + 1}`} aria-pressed={image === i} onClick={() => setImage(i)}><img src={src} alt=""/></Button>)}</div></div><div className="clean-gallery-tabs">{["Products", "Key Features", "Scene"].map(m => <Button key={m} variant="ghost" aria-pressed={mode === m} onClick={() => { setMode(m); setImage(0); if (m === "Key Features") go("clean-overview"); }}>{m}</Button>)}</div></div>
    <div className="clean-details"><div className="clean-benefits"><h2>Your Benefits</h2><p>{product.price ?? product.series}</p>{product.saved && <p>Saved {product.saved}</p>}<details><summary>Shipping Info</summary><a href="https://www.eufy.com/policies/shipping-policy" target="_blank" rel="noreferrer">eufy shipping policy</a></details><details><summary>Warranty &amp; Returns</summary><a href="https://www.eufy.com/policies/refund-policy" target="_blank" rel="noreferrer">eufy return policy</a></details></div><div className="clean-highlights-heading"><h2>Highlights</h2><Button variant="link" onClick={() => go("clean-detail")}>View Details <ChevronRight /></Button></div><div className="clean-highlights">{highlights.map(h => <span key={h}>{h}</span>)}</div><h2 className="clean-choice-heading">Choice</h2><div className="clean-choices">{[product, ...related].map(p => <Link key={p.slug} to="/products/$product" params={{ product: p.slug }} aria-current={p.slug === product.slug ? "page" : undefined}><img src={p.slug === product.slug ? gallery[0] : p.image} alt=""/><span>{p.name}</span><strong>{p.price}</strong></Link>)}</div><div className="clean-quantity"><span>Quantity</span><div><Button variant="ghost" size="icon" aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}><Minus /></Button><span aria-live="polite">{quantity}</span><Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Plus /></Button></div></div></div></div>
    <section className="clean-order"><h2>{product.name} is Ready</h2><p>Add to Your Cart Now.</p><div><span>{product.name} ×{quantity}</span><strong>{product.price}</strong><Button variant="outline" onClick={() => setPurchase(true)}>Add to Cart</Button><Button onClick={() => setPurchase(true)}>Buy Now</Button></div></section>
    <div id="clean-overview">{isS2 ? <div id="clean-detail">{parse(features, { replace(node) { if (!(node instanceof Element)) return undefined; if (node.name === "button") return <Button variant="ghost" onClick={() => root?.querySelector("#clean-detail section")?.scrollIntoView({behavior:"instant"})}>View More</Button>; return undefined; } })}</div> : <><section className="clean-overview-band"><h2>Feature Overview</h2><div className="clean-feature-grid">{product.details.map((d, i) => <article key={d}><img src={product.scenes[i] ?? product.image} alt={product.name} loading="lazy"/><h3>{d}</h3></article>)}</div></section><section className="clean-model-detail" id="clean-detail"><h2>{product.name}</h2><p>{product.description}</p><img src={product.scenes[0] ?? product.image} alt={product.name} loading="lazy"/></section></>}</div>
    <section className="clean-specs"><ProductTemplateSections slot="specs" product={product} quantity={quantity} setQuantity={setQuantity} onPurchase={() => setPurchase(true)}/></section>
    <div className="clean-mobile-buy"><span>{product.price}</span><Button variant="outline" onClick={() => setPurchase(true)}>Add to Cart</Button><Button onClick={() => setPurchase(true)}>Buy Now</Button></div>
  </main></>, root)}<StoreFooter /><Dialog open={purchase} onOpenChange={setPurchase}><DialogContent><DialogTitle>Continue with eufy</DialogTitle><DialogDescription>Purchases are completed on the official eufy store. No order has been placed here.</DialogDescription><p>{product.name} · Quantity: {quantity}</p><Button asChild><a href={external} target="_blank" rel="noreferrer">Continue to eufy</a></Button></DialogContent></Dialog></>;
}