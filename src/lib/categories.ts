import asset0 from "@/assets/categories/466.jpg.asset.json";
import asset1 from "@/assets/categories/468.png.asset.json";
import asset2 from "@/assets/categories/488.png.asset.json";
import asset3 from "@/assets/categories/491.png.asset.json";
import asset4 from "@/assets/categories/492.png.asset.json";
import asset5 from "@/assets/categories/496.png.asset.json";
import asset6 from "@/assets/categories/497.png.asset.json";
import asset7 from "@/assets/categories/501.png.asset.json";
import asset8 from "@/assets/categories/511.png.asset.json";
import asset9 from "@/assets/categories/520.png.asset.json";
import asset10 from "@/assets/categories/525.png.asset.json";
import asset11 from "@/assets/categories/531.png.asset.json";
import asset12 from "@/assets/categories/534.png.asset.json";
import asset13 from "@/assets/categories/564.png.asset.json";
import asset14 from "@/assets/categories/571.png.asset.json";
import asset15 from "@/assets/categories/597.png.asset.json";
import asset16 from "@/assets/categories/613.png.asset.json";
import asset17 from "@/assets/categories/636.png.asset.json";
import asset18 from "@/assets/categories/639.png.asset.json";
import asset19 from "@/assets/categories/646.png.asset.json";
import asset20 from "@/assets/categories/746.png.asset.json";
import asset21 from "@/assets/categories/810.png.asset.json";
import asset22 from "@/assets/categories/baby-monitors.png.asset.json";
import asset23 from "@/assets/categories/breast-pumps.png.asset.json";
import asset24 from "@/assets/categories/doorbell-banner.png.asset.json";
import asset25 from "@/assets/categories/homebase.png.asset.json";
import asset26 from "@/assets/categories/indoor-cameras.png.asset.json";
import asset27 from "@/assets/categories/lawn-mowers.png.asset.json";
import asset28 from "@/assets/categories/outdoor-banner.png.asset.json";
import asset29 from "@/assets/categories/outdoor-cameras.png.asset.json";
import asset30 from "@/assets/categories/poe-nvr-system.png.asset.json";
import asset31 from "@/assets/categories/pump-banner.png.asset.json";
import asset32 from "@/assets/categories/robot-vacuums.png.asset.json";
import asset33 from "@/assets/categories/smart-display.png.asset.json";
import asset34 from "@/assets/categories/smart-lights.png.asset.json";
import asset35 from "@/assets/categories/smart-locks.png.asset.json";
import asset36 from "@/assets/categories/vacuum-banner.png.asset.json";
import asset37 from "@/assets/categories/video-doorbells.png.asset.json";

export const categoryImages: Record<string, string> = {
  "466": asset0.url,
  "468": asset1.url,
  "488": asset2.url,
  "491": asset3.url,
  "492": asset4.url,
  "496": asset5.url,
  "497": asset6.url,
  "501": asset7.url,
  "511": asset8.url,
  "520": asset9.url,
  "525": asset10.url,
  "531": asset11.url,
  "534": asset12.url,
  "564": asset13.url,
  "571": asset14.url,
  "597": asset15.url,
  "613": asset16.url,
  "636": asset17.url,
  "639": asset18.url,
  "646": asset19.url,
  "746": asset20.url,
  "810": asset21.url,
  "baby-monitors": asset22.url,
  "breast-pumps": asset23.url,
  "doorbell-banner": asset24.url,
  "homebase": asset25.url,
  "indoor-cameras": asset26.url,
  "lawn-mowers": asset27.url,
  "outdoor-banner": asset28.url,
  "outdoor-cameras": asset29.url,
  "poe-nvr-system": asset30.url,
  "pump-banner": asset31.url,
  "robot-vacuums": asset32.url,
  "smart-display": asset33.url,
  "smart-lights": asset34.url,
  "smart-locks": asset35.url,
  "vacuum-banner": asset36.url,
  "video-doorbells": asset37.url
};

export interface CategoryProduct { name: string; image: string; description: string; price?: string; saved?: string; series: string; url?: string }
export interface Category { slug: string; name: string; title: string; subtitle: string; hero: string; photo: boolean; features: string[]; product: CategoryProduct }
const image = (key: string) => categoryImages[key] ?? "";
const definitions = [
 ["poe-nvr-system", "PoE NVR System", "eufy PoE NVR Security System E40", "Best Value-Per-Channel for Fixed Coverage", "", "$899.99"],
 ["outdoor-cameras", "Outdoor Cameras", "eufyCam S4", "The Perfect Harmony of Bullet and PTZ Cameras", "outdoor-banner", ""],
 ["robot-vacuums", "Robot Vacuums", "Anker eufy Robot Vacuum Omni E35", "Baby-Grade Cleaning. Carefree Crawling.", "vacuum-banner", ""],
 ["smart-locks", "Smart Locks", "eufy FamiLock S3 Max", "Unlock with a Wave, Your Palm is Your Key", "466", "$299.99"],
 ["breast-pumps", "Breast Pumps", "eufy Wearable Breast Pump S1 Pro", "30% More Output with 300 mmHg Strong Suction", "pump-banner", ""],
 ["smart-lights", "Smart Lights", "eufy Smart Lights", "Light Up Your Home", "", ""],
 ["lawn-mowers", "Lawn Mowers", "eufy Robot Lawn Mower E15", "0.2 acres max mapping area, for flat lawns", "", "$1,099.99"],
 ["video-doorbells", "Video Doorbells", "eufy Video Doorbell S4", "Immersive AI Tracking", "doorbell-banner", ""],
 ["homebase", "HomeBase", "eufy HomeBase", "Your Home Security, Connected", "", ""],
 ["indoor-cameras", "Indoor Cameras", "eufy Indoor Cameras", "Keep an Eye on What Matters", "", ""],
 ["smart-display", "Smart Display", "eufy Smart Display", "Your Home at a Glance", "", ""],
 ["baby-monitors", "Baby Monitors", "eufy Baby Monitors", "Closer to Your Little One", "", ""],
];
const featureSets: Record<string, string[]> = {
 "smart-locks": ["Multiple Unlocking Methods", "Seamless Ecosystem Integration", "Enhanced Battery Power", "BHMA Grade 1"],
 "robot-vacuums": ["Deep Cleaning", "Powerful Suction", "HydroJet™ Technology", "Everyday Care"],
 "outdoor-cameras": ["Full Coverage", "Local Security", "AI Tracking", "Day & Night"],
 "breast-pumps": ["Wearable Design", "Strong Suction", "Everyday Comfort", "Made for Moms"],
};
export const categories: Category[] = definitions.map(([slug = "", name = "", title = "", subtitle = "", hero = "", price = ""]) => ({
 slug, name, title, subtitle, hero: image(hero || slug), photo: Boolean(hero),
 features: featureSets[slug] ?? ["Designed for Your Home", "Everyday Convenience", "Connected Living", "Made with Care"],
 product: {name: title, image: image(slug === "smart-locks" ? "613" : slug), description: subtitle, ...(price ? {price} : {}), series: "Featured"},
}));
export const lockProducts: CategoryProduct[] = [
 { name: "eufy FamiLock S3 Max", image: image("613"), description: "Palm vein unlocking, 2K HDR camera and 4-inch display.", price: "$299.99", saved: "$100.00", series: "S Series", url: "https://www.eufy.com/products/e85v0jy1" },
 { name: "eufy Familock S3", image: image("496"), description: "Your palm is your key. Secure access for the whole family.", price: "$279.98", saved: "$70.01", series: "S Series", url: "https://www.eufy.com/products/t85v01y1" },
 { name: "Video Smart Lock S330", image: image("497"), description: "Fingerprint recognition, 2K camera and video doorbell.", price: "$349.99", series: "S Series", url: "https://www.eufy.com/products/e85301y1" },
 { name: "eufy Smart Lock E40", image: image("smart-locks"), description: "Facial recognition for effortless keyless entry.", price: "$349.99", series: "E Series", url: "https://www.eufy.com/products/t85m0j11" },
 { name: "Video Smart Lock E330", image: image("501"), description: "3-in-1 security. See and unlock from anywhere.", price: "$229.99", saved: "$70.00", series: "E Series", url: "https://www.eufy.com/products/t85311y1" },
 { name: "eufy FamiLock E34", image: image("520"), description: "Fast, forgery-resistant palm vein recognition.", price: "$199.99", saved: "$80.00", series: "E Series", url: "https://www.eufy.com/products/t85p0111" },
 { name: "eufy Smart Lock E32", image: image("746"), description: "Connected access with your smart home ecosystem.", price: "$139.98", saved: "$40.01", series: "E Series", url: "https://www.eufy.com/products/t85f2j11" },
 { name: "Smart Lock C220", image: image("525"), description: "Fingerprint unlocking and built-in Wi-Fi.", price: "$99.97", saved: "$70.02", series: "C Series", url: "https://www.eufy.com/products/t8506115" },
 { name: "eufy Smart Lock C33", image: image("531"), description: "Fingerprint recognition integrated into the handle.", price: "$105.23", saved: "$64.76", series: "C Series", url: "https://www.eufy.com/products/t85l0111" },
 { name: "eufy Smart Lock C32", image: image("636"), description: "Keyless entry with handle for interior doors.", price: "$69.99", saved: "$10.00", series: "C Series", url: "https://www.eufy.com/products/t85l1111" },
 { name: "eufy Smart Lock C30 Contemporary", image: image("564"), description: "Built-in Wi-Fi. Control your door from anywhere.", price: "$79.99", series: "C Series", url: "https://www.eufy.com/products/t85d0111" },
];
export function getCategory(slug: string) { return categories.find((category) => category.slug === slug); }
export function categorySlug(name: string) { return name.toLowerCase().replaceAll(" ", "-"); }
