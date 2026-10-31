import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import parse, { domToReact, Element, type HTMLReactParserOptions } from "html-react-parser";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StoreHeader, StoreFooter } from "@/components/store-header";
import { LegacyCategoryPage } from "@/components/category-page-legacy";
import type { Category } from "@/lib/categories";
import { products } from "@/lib/products";
import source from "@/lib/category-reference.html?raw";
import sourceCss from "@/lib/category-reference.css?raw";

// Smart Locks and Robot Vacuums keep their own earlier page; every other category uses the copied reference.
export function CategoryPage({ category }: { category: Category }) {
  if (category.slug === "smart-locks" || category.slug === "robot-vacuums") return <LegacyCategoryPage category={category} />;
  return <ReferenceCategoryPage category={category} />;
}

// The same complete reference is intentionally used for every other category.
function ReferenceCategoryPage({ category }: { category: Category }) {
 const host = useRef<HTMLDivElement>(null);
 const [root, setRoot] = useState<ShadowRoot | null>(null);
 const [closedFaqs, setClosedFaqs] = useState<string[]>([]);
 useEffect(() => { if (host.current) setRoot(host.current.shadowRoot ?? host.current.attachShadow({ mode: "open" })); }, []);
 const options: HTMLReactParserOptions = { replace(node) {
  if (!(node instanceof Element)) return undefined;
  const children = () => domToReact(node.children as Parameters<typeof domToReact>[0], options);
  if (node.name === "a") {
   const href = node.attribs['href'];
   const nodeText = (child: (typeof node.children)[number]): string => "data" in child ? child.data : "children" in child ? child.children.map(nodeText).join("") : "";
   const text = node.children.map(nodeText).join("").trim();
   const product = products.find(p => p.name === text);
   if (product) return <Link className={node.attribs['class']} to="/products/$product" params={{ product: product.slug }}>{children()}</Link>;
   return <a className={node.attribs['class']} href={href} target={href?.startsWith("https://") ? "_blank" : undefined} rel="noreferrer">{children()}</a>;
  }
  const faq = node.attribs["data-reference-faq"];
  if (faq !== undefined) return <Button variant="ghost" className={`reference-control reference-faq ${node.attribs['class']}`} aria-expanded={!closedFaqs.includes(faq)} onClick={() => setClosedFaqs(list => list.includes(faq) ? list.filter(id => id !== faq) : [...list, faq])}>{children()}</Button>;
  if (node.name === "button") {
   const destination = node.attribs["data-destination"];
   const props = { className: `reference-control ${node.attribs['class']}`, "aria-label": node.attribs["aria-label"], disabled: "disabled" in node.attribs };
   if (destination && node.parent instanceof Element && node.parent.name !== "a") return <Button asChild variant="ghost" {...props}><a href={destination} target="_blank" rel="noreferrer">{children()}</a></Button>;
   return <Button variant="ghost" {...props} onClick={() => { root?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(input => { input.checked = false; }); }}>{children()}</Button>;
  }
  return undefined;
 }};
 const override = heroOverrides[category.slug];
 const html = override ? source.replace(REFERENCE_HERO, override) : source;
 return <><style>{sourceCss.match(/@font-face\{[^{}]*\}/g)?.join('\n')}</style><StoreHeader /><div ref={host} data-category-reference />{root && createPortal(<><style>{sourceCss}{`
  :host { display:block; font-family:MontForAnker, sans-serif; color:var(--foreground); }
  *, *::before, *::after { letter-spacing:0 !important; }
  .reference-shell { font-family:MontForAnker, sans-serif; font-size:14px; font-weight:600; line-height:21px; }
  .reference-control { font-family:inherit; font-size:inherit; box-shadow:none; }
  [data-slot="button"].reference-control { gap:0; white-space:normal; }
  [data-slot="button"].reference-faq { height:auto; width:100%; text-align:left; border-radius:0; padding-inline:0; }
  button[aria-expanded="false"] + div { display:none; }
  @media (prefers-reduced-motion:reduce) { *, *::before, *::after { animation:none !important; transition:none !important; } }
  `}</style><div className="reference-shell">{parse(html, options)}</div></>, root)}<StoreFooter /></>;
}
