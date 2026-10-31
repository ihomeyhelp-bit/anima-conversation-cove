import { createFileRoute, Link } from "@tanstack/react-router";
import { categorySlug } from "@/lib/categories";
import { productSlug } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { StoreHeader } from "@/components/store-header";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import livingRoomSmall from "@/assets/home/living-room-768.webp.asset.json";
import livingRoomMedium from "@/assets/home/living-room-1280.webp.asset.json";
import livingRoomLarge from "@/assets/home/living-room-1920.webp.asset.json"; import logoLightAsset from "@/assets/brand/ihomey-logo-light.png.asset.json";
import solarCamAsset from "@/assets/home/e-series-camera.webp.asset.json";
import cSeriesCameraAsset from "@/assets/home/indoor-security-camera.webp.asset.json";
import sSeriesCameraAsset from "@/assets/home/s-series-camera.webp.asset.json";
import smartLockAsset from "@/assets/home/smart-safe.png.asset.json";
import outdoorCameraAsset from "@/assets/home/outdoor-camera.png.asset.json";
import babyMonitorAsset from "@/assets/home/baby-monitor.png.asset.json";
import videoDoorbellAsset from "@/assets/home/video-doorbell.png.asset.json";

const CDN = "https://cdn.shopify.com/s/files/1/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iHOMEY | Smart Home Security & Cleaning Devices" },
      { name: "description", content: "Security cameras, robot vacuums, smart locks and baby tech from iHOMEY." },
      { property: "og:title", content: "iHOMEY | Smart Home Security & Cleaning" },
      { property: "og:description", content: "Security cameras, robot vacuums, smart locks and baby tech from iHOMEY." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: CDN + "0521/9411/5753/files/1920_720_2_3840x.png?v=1790042462" },
      { name: "twitter:image", content: CDN + "0521/9411/5753/files/1920_720_2_3840x.png?v=1790042462" },
    ],
  }),
  component: Index,
});

const heroes = [
  { img: CDN + "0521/9411/5753/files/1920_720_2_3840x.png?v=1790042462", eyebrow: "New Arrivals", title: "Own Your Yard", sub: "Proactive Detection Beyond the Door", dark: false },
  { img: CDN + "0504/7094/4954/files/PC-1920_930-15_3840x.png?v=1793187286", eyebrow: "Protect your home with up to 60% off", title: "Treats for Your Home", sub: "", dark: true },
];

const care = [
  { img: livingRoomLarge.url, srcSet: `${livingRoomSmall.url} 768w, ${livingRoomMedium.url} 1280w, ${livingRoomLarge.url} 1920w`, alt: "Salon ensoleillé avec aspirateur robot iHomey et sa station", t: "Anker eufy Robot Vacuum Omni E35", s: "35000 Pa | Baby-Grade Cleaning. Carefree Crawling.", cta: "Save $300 Now" },
  { img: CDN + "0504/7094/4954/files/20261019-165156_3840x.png?v=1792400919", t: "eufy Wearable Breast Pump S1 Pro", s: "30% More Output with 300 mmHg Strong Suction", cta: "Save $90 Now" },
  { img: CDN + "0504/7094/4954/files/824_640-12_3840x.png?v=1793157664", t: "eufy Video Doorbell S4", s: "The World's First VR Doorbell with Immersive AI Tracking", cta: "Shop Now" },
  { img: CDN + "0504/7094/4954/files/T8172_1648_480_1_3840x.png?v=1788272062", t: "eufyCam S4", s: "The Perfect Harmony of Bullet and PTZ Cameras", cta: "Save $400 Now" },
  { img: CDN + "0504/7094/4954/files/omnis2bann_v2_1648_1280_3840x.jpg?v=1791283224", t: "eufy Robot Vacuum Omni S2", s: "Deep Cleaning, Healthy Home.", cta: "Buy Now" },
];

const cats: [string, string][] = [
  ["PoE NVR System", "0504/7094/4954/files/9ed65272-8552-4690-a4da-ef58ca749a34_ae_a_a_a_292_3840x.png?v=1756976365"],
  ["Outdoor Cameras", outdoorCameraAsset.url],
  ["Robot Vacuums", "0504/7094/4954/files/Frame_2121236208_4c45a479-2f7e-4818-bae2-8be5b96ef10b_3840x.png?v=1784704932"],
  ["Smart Locks", smartLockAsset.url],
  ["Breast Pumps", "0504/7094/4954/files/1-T600P_S2___1500x1500_7a53c066-e520-4cca-827f-67174007a17e.png?v=1790061158"],
  ["Video Doorbells", videoDoorbellAsset.url],
  ["Indoor Cameras", "0557/0933/5761/files/ce554e73-26d0-40fc-8178-becdedb0bca6_Y1811-c_a_a_1_2-1_3840x.png?v=1750150793"],
  ["Baby Monitors", babyMonitorAsset.url],
];

const systems = [
  { img: CDN + "0504/7094/4954/files/1088_1280-7_3840x.png?v=1783914069", t: "LocalSecure™ System", s: "Take Control of Your Home Security with eufy LocalSecure™ System" },
  { img: CDN + "0504/7094/4954/files/1088_1280-6_3840x.png?v=1783913642", t: "ProSecure™ System", s: "Professional 24/7 Security System Powered by a Local AI Agent" },
  { img: CDN + "0504/7094/4954/files/0d387078-6f9a-4961-bb78-a08fb5ad3bd2_DTC_KV_544x640PX-2.png?v=1766579956", t: "ExpertSecure™ System", s: "The Best 24/7 Local Video Alarm System with Expert Monitoring", light: true },
];

const series = [
  { img: sSeriesCameraAsset.url, t: "S Series", s: "Ultimate Imaging, Full Control", light: true },
  { img: solarCamAsset.url, t: "E Series", s: "Reliable Security, Always On" },
  { img: cSeriesCameraAsset.url, t: "C Series", s: "Auto Tracking, Indoors or Outdoors" },
];

const tech = [
  { img: CDN + "0504/7094/4954/files/76b5af4f-b552-4c5c-8507-daf33d2c9035_Frame_2121235968_3840x.jpg?v=1750986178", t: "HydroJet™ Deep Cleaning System", s: "Available on eufy Omni S2, E35, E28, E25 and C28" },
  { img: CDN + "0504/7094/4954/files/01cb63fa-f45c-4efc-8e10-334e88914509_Frame_1973772031_3840x.jpg?v=1751020630", t: "eufy’s Privacy Commitment", s: "Your Privacy is Our Priority" },
  { img: CDN + "0504/7094/4954/files/f8558600-1622-40b2-ae46-ebc93cb08d3c_Frame_2121235252_3840x.jpg?v=1751020664", t: "eufy Security", s: "Local Security*, No Monthly Fee" },
  { img: CDN + "0504/7094/4954/files/b98297a3-47ad-4a18-8079-212629cff9ab_Frame_2121235258_3840x.jpg?v=1751020701", t: "SolarPlus™ Revolutionizes Security", s: "Advanced Solar Technology for Non-Stop Security" },
];

const products = [
  { img: CDN + "0504/7094/4954/files/Group2121234924_2_3840x.png?v=1751452080", tag: "$400 OFF", t: "eufy PoE NVR Security System E40 - 8× 4K Bullet Cameras", s: "Best Value-Per-Channel for Fixed Coverage", p: "$899.99", saved: "Saved $400.00" },
  { img: CDN + "0504/7094/4954/files/E15_78053c62-b8cf-4de7-859c-021f244ffd6a_3840x.png?v=1788431014", tag: "$700 OFF", t: "eufy Robot Lawn Mower E15", s: "0.2 acres max mapping area, for flat lawns", p: "$1,099.99", saved: "Saved $700.00" },
  { img: CDN + "0504/7094/4954/files/1-T600P_S2___1500x1500_abbef2f6-7c43-497f-8e19-42d01e6183ba.png?v=1788418942", tag: "HSA/FSA", t: "eufy Wearable Breast Pump S2 Pro", s: "35% More Output, 30% Less Time", p: "$449.99", saved: "" },
];

function Index() {
  const [h, setH] = useState(0);
  const [c, setC] = useState(0);
  const [tab, setTab] = useState("Best Seller");
  const catRef = useRef<HTMLDivElement>(null);
  const [catCanLeft, setCatCanLeft] = useState(false);
  const [catCanRight, setCatCanRight] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setH((x) => (x + 1) % heroes.length), 6000);
    return () => clearInterval(id);
  }, []);
  const updateCatArrows = () => {
    const el = catRef.current;
    if (!el) return;
    setCatCanLeft(el.scrollLeft > 4);
    setCatCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  const scrollCats = (dir: number) => {
    const el = catRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 16 : el.clientWidth / 3;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };
  const hero = heroes[h] ?? heroes[0];
  const item = care[c] ?? care[0];
  if (!hero || !item) return null;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <StoreHeader />

      <section className="relative h-[680px] overflow-hidden">
        <img src={hero.img} alt={hero.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className={`relative mx-auto flex h-full max-w-[1664px] flex-col justify-center px-10 ${hero.dark ? "text-primary-foreground" : ""}`}>
          <p className="text-lg font-semibold">{hero.eyebrow}</p>
          <h1 className="mt-1 text-6xl font-bold tracking-tight">{hero.title}</h1>
          {hero.sub && <p className="mt-6 text-lg font-semibold">{hero.sub}</p>}
          <a href="#" className={`mt-10 w-fit rounded-full px-7 py-3 font-semibold ${hero.dark ? "bg-background text-foreground" : "bg-primary text-primary-foreground"}`}>Shop Now</a>
        </div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {heroes.map((_, i) => (
            <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setH(i)} className={`h-1 rounded-full transition-all ${i === h ? "w-10 bg-primary" : "w-5 bg-muted-foreground/40"}`} />
          ))}
        </div>
      </section>

      <Section title="Built with Care">
        <div className="relative overflow-hidden rounded-2xl">
          <img src={item.img} srcSet={item.srcSet} sizes="(min-width: 1664px) 1584px, calc(100vw - 80px)" alt={item.alt ?? item.t} width={1920} height={739} loading="lazy" decoding="async" className="h-[520px] w-full object-cover object-center" />
          <div className="absolute bottom-8 left-5 right-5 max-w-md md:bottom-12 md:left-12 md:right-auto">
            <h3 className="text-2xl font-bold md:text-3xl">{item.t}</h3>
            <p className="mt-3 text-base md:text-lg">{item.s}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-full border-foreground"><Link to="/products/$product" params={{product:productSlug(item.t)}}>Learn More</Link></Button>
              <Button asChild className="rounded-full"><Link to="/products/$product" params={{product:productSlug(item.t)}}>{item.cta}</Link></Button>
            </div>
          </div>
          <button aria-label="Previous" onClick={() => setC((c - 1 + care.length) % care.length)} className="absolute left-4 top-1/2 rounded-full bg-background/80 p-2"><ChevronLeft /></button>
          <button aria-label="Next" onClick={() => setC((c + 1) % care.length)} className="absolute right-4 top-1/2 rounded-full bg-background/80 p-2"><ChevronRight /></button>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {care.map((x, i) => <button key={x.t} aria-label={x.t} onClick={() => setC(i)} className={`h-1 rounded-full ${i === c ? "w-10 bg-primary" : "w-5 bg-border"}`} />)}
        </div>
      </Section>

      <Section title="Explore Top Choices by Category">
        <div className="relative">
          <div ref={catRef} onScroll={updateCatArrows} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cats.map(([n, src]) => (
              <Link key={n} to="/category/$category" params={{category: categorySlug(n)}} className="group w-[38%] shrink-0 snap-start rounded-2xl bg-muted p-4 text-center sm:w-[29%] md:w-[21.5%] lg:w-[15.5%]">
                <img src={src.startsWith("/") ? src : CDN + src} alt={n} className="mx-auto aspect-square w-full object-contain transition-transform group-hover:scale-105" />
                <p className="mt-2 text-sm font-semibold">{n}</p>
              </Link>
            ))}
          </div>
          {catCanLeft && (
            <button aria-label="Catégories précédentes" onClick={() => scrollCats(-1)} className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-background p-2 shadow-md ring-1 ring-border"><ChevronLeft /></button>
          )}
          {catCanRight && (
            <button aria-label="Catégories suivantes" onClick={() => scrollCats(1)} className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-background p-2 shadow-md ring-1 ring-border"><ChevronRight /></button>
          )}
        </div>
      </Section>

      <Section title="Choose the Security System that Best Fits Your Home">
        <CardGrid items={systems} tall bottom />
      </Section>

      <Section title="Find the Right Series for You">
        <CardGrid items={series} tall bottom />
      </Section>

      <Section title="Powered by Industry-Leading Technology">
        <div className="grid gap-4 md:grid-cols-2">
          {tech.map((x) => (
            <a key={x.t} href="#" className="group relative overflow-hidden rounded-2xl">
              <img src={x.img} alt={x.t} className="h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8 pt-16 text-primary-foreground">
                <h3 className="text-2xl font-bold">{x.t}</h3>
                <p className="mt-2">{x.s}</p>
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section title="Find the Right One for You">
        <div className="mb-8 flex justify-center gap-3">
          {["Best Seller", "New", "Bundle Deals", "On Sale"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{t}</button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((p) => (
            <div key={p.t} className="flex flex-col rounded-2xl bg-muted p-6">
              <span className="w-fit rounded bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">{p.tag}</span>
              <img src={p.img} alt={p.t} className="mx-auto my-4 aspect-square w-3/4 object-contain" />
              <h3 className="font-bold">{p.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.s}</p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold">{p.p}</span>
                {p.saved && <span className="text-sm text-destructive">{p.saved}</span>}
              </div>
              <div className="mt-5 flex gap-3">
                <Button asChild variant="outline" className="flex-1 rounded-full border-foreground"><Link to="/products/$product" params={{product:productSlug(p.t)}}>Learn More</Link></Button>
                <Button asChild className="flex-1 rounded-full"><Link to="/products/$product" params={{product:productSlug(p.t)}}>Shop Now</Link></Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <footer className="mt-20 bg-topbar text-topbar-foreground">
        <div className="mx-auto max-w-[1664px] px-10 pt-14 pb-2"><img src={logoLightAsset.url} alt="iHOMEY" width={700} height={300} className="h-9 w-auto md:h-10" /></div><div className="mx-auto grid max-w-[1664px] gap-10 px-10 pb-16 pt-8 md:grid-cols-5">
          {[
            ["Products", ["Security", "Clean", "Mom & Baby", "Smart Lights"]],
            ["Support", ["Help Center", "Warranty", "Track Order", "Returns"]],
            ["Explore", ["Blog", "Privacy Commitment", "Business", "Affiliates"]],
            ["About", ["About iHOMEY", "Careers", "Press", "Contact"]],
          ].map(([h, l]) => (
            <div key={h as string}>
              <h4 className="mb-4 font-semibold">{h as string}</h4>
              <ul className="space-y-2 text-sm opacity-70">{(l as string[]).map((x) => <li key={x}><a href="#">{x}</a></li>)}</ul>
            </div>
          ))}
          <div>
            <h4 className="mb-4 font-semibold">Join the iHOMEY community</h4>
            <div className="flex overflow-hidden rounded-full bg-background">
              <input placeholder="Email address" className="flex-1 bg-transparent px-4 py-2 text-sm text-foreground outline-none" />
              <button className="bg-primary px-4 text-sm text-primary-foreground">Sign Up</button>
            </div>
          </div>
        </div>
        <p className="border-t border-topbar-foreground/10 py-6 text-center text-xs opacity-60">© 2026 iHOMEY. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-[1664px] px-10 pt-20">
      <h2 className="mb-8 text-center text-4xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function CardGrid({ items, tall, bottom }: { items: { img: string; t: string; s: string; light?: boolean }[]; tall?: boolean; bottom?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((x) => (
        <a key={x.t} href="#" className="group relative overflow-hidden rounded-2xl">
          <img src={x.img} alt={x.t} className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${tall ? "h-[600px]" : "h-[400px]"}`} />
          <div className={`absolute inset-x-0 p-8 ${bottom ? "bottom-0" : "top-0"} ${x.light ? "text-primary-foreground" : ""}`}>
            <h3 className="text-2xl font-bold">{x.t}</h3>
            <p className="mt-2 text-sm">{x.s}</p>
            <span className="mt-5 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Shop Now</span>
          </div>
        </a>
      ))}
    </div>
  );
}
