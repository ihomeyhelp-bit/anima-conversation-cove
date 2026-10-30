import { categories, lockProducts, categoryImages, type CategoryProduct } from "@/lib/categories";
import palm from "@/assets/products/509.png.asset.json";
import front from "@/assets/products/671.png.asset.json";
import scene from "@/assets/products/1083.png.asset.json";
import security from "@/assets/products/529.png.asset.json";
import hands from "@/assets/products/760.png.asset.json";
import battery from "@/assets/products/763.png.asset.json";
import power from "@/assets/products/920.png.asset.json";
import home from "@/assets/products/588.png.asset.json";
export interface Product extends CategoryProduct { slug: string; category: string; gallery: string[]; scenes: string[]; details: string[]; specs: [string,string][]; coupon?: {code:string; amount:number}; }
export function productSlug(name: string) { return name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
const extras: (CategoryProduct & {category:string})[] = [
 {name:"eufy Robot Vacuum Omni S2",image:categoryImages["robot-vacuums"] ?? "",description:"Deep Cleaning, Healthy Home.",series:"S Series",category:"robot-vacuums"},
 {name:"eufy Wearable Breast Pump S2 Pro",image:categoryImages["breast-pumps"] ?? "",description:"35% More Output, 30% Less Time",price:"$449.99",series:"S Series",category:"breast-pumps"},
 {name:"eufy PoE NVR Security System E40 - 8× 4K Bullet Cameras",image:categoryImages["poe-nvr-system"] ?? "",description:"Best Value-Per-Channel for Fixed Coverage",price:"$899.99",series:"E Series",category:"poe-nvr-system"},
];
const entries = [...categories.filter(c=>c.slug!=="smart-locks").map(c=>({...c.product,category:c.slug})),...lockProducts.map(p=>({...p,category:"smart-locks"})),...extras];
export const products: Product[] = entries.map(p=> {
 const isMax=p.name==="eufy FamiLock S3 Max";
 const cat=categories.find(c=>c.slug===p.category);
 return {...p,slug:productSlug(p.name),gallery:isMax ? [front.url,palm.url] : [p.image], scenes:isMax ? [scene.url,security.url,hands.url,battery.url] : cat?.photo ? [cat.hero] : [],
 details:isMax ? ["Palm Vein Unlocking: Unlock with advanced security and ultra-fast recognition in just 0.6 seconds. All data is securely stored locally on the lock.","This all-in-one device: A 2K HD night-vision camera, a 150° wide-angle video doorbell and a smart lock with real-time alerts.","The Rear Lock Video Screen: Check the front door without an app, with a simple design for seniors and children.","Dual Power Supply System: Two batteries provide up to 5 months of usage, plus 4 AAA backup batteries."] : [p.description],
 specs:isMax ? [["Unlock Methods","Palm Vein, App, Voice Control, Password, Keys"],["Camera Resolution","2K HDR"],["Display","4-Inch Display"],["Battery Type","15,000mAh + 4 AAA"],["Battery Life","5 Months"],["Waterproof","IP65"],["Connectivity","Built-In Wi-Fi"]] : [["Product",p.name],["Category",cat?.name ?? ""],["Series",p.series]],
 ...(isMax ? {price:"$399.99",coupon:{code:"WS24E85V0JY1",amount:100}} : {}),
 };
});
export const maxFeatureImages = [scene.url,security.url,hands.url,power.url,home.url];
export function getProduct(slug:string) { return products.find(p=>p.slug===slug); }
export function effectivePrice(product:Product, applyCoupon:boolean) { const price=Number(product.price?.replace(/[^0-9.]/g,"")); if(!product.price || !Number.isFinite(price)) return undefined; return Math.max(0,price-(applyCoupon ? product.coupon?.amount ?? 0 : 0)); }
