import empty from "@/assets/ihomey-app/empty-room.jpg.asset.json";
import safety from "@/assets/ihomey-app/safety.jpg.asset.json";
import professional from "@/assets/ihomey-app/professional.jpg.asset.json";
import homebase from "@/assets/ihomey-app/homebase.jpg.asset.json";
import nvr from "@/assets/ihomey-app/nvr.jpg.asset.json";
import battery from "@/assets/ihomey-app/battery-camera.jpg.asset.json";
import wired from "@/assets/ihomey-app/wired-camera.jpg.asset.json";
import smart from "@/assets/ihomey-app/smart-lock.jpg.asset.json";
import lever from "@/assets/ihomey-app/lever-lock.jpg.asset.json";
import video from "@/assets/ihomey-app/video-lock.jpg.asset.json";
import retrofit from "@/assets/ihomey-app/retrofit-lock.jpg.asset.json";
import bridge from "@/assets/ihomey-app/bridge.jpg.asset.json";
import robot from "@/assets/ihomey-app/app-robot.jpg.asset.json";

export const emptyRoom = empty.url;
export const homebaseImage = homebase.url;

export type FamilyCategory = "Security" | "Clean" | "Baby" | "Lights" | "Other";
export const familyTabs: [FamilyCategory, string][] = [
  ["Security", "Sécurité"],
  ["Clean", "Nettoyage"],
  ["Baby", "Bébé"],
  ["Lights", "Éclairage"],
  ["Other", "Autres"],
];

export const families: { name: string; image: string; category: FamilyCategory; expert?: boolean }[] = [
  { name: "Safety kit", image: safety.url, category: "Security" },
  { name: "HomeBase Professional", image: professional.url, category: "Security", expert: true },
  { name: "HomeBase", image: homebase.url, category: "Security" },
  { name: "NVR", image: nvr.url, category: "Security" },
  { name: "Battery Camera", image: battery.url, category: "Security" },
  { name: "Wired Camera", image: wired.url, category: "Security" },
  { name: "Video Doorbell", image: battery.url, category: "Security" },
  { name: "Smart Lock", image: smart.url, category: "Security" },
  { name: "Robot aspirateur", image: robot.url, category: "Clean" },
  { name: "Baby Monitor", image: wired.url, category: "Baby" },
  { name: "Éclairage connecté", image: bridge.url, category: "Lights" },
  { name: "Wi-Fi Bridge & Chime", image: bridge.url, category: "Other" },
];

export const lockModels = [
  { name: "Smart Lock", image: smart.url, models: "Smart Lock C100 / Smart Lock C110 / Smart Lock C210 / Smart Lock C220 / Smart Lock C30 / Smart Lock C34 / Smart Lock E130 / Smart Lock E30 / T8510P / Smart Lock E31 / Smart Lock S230 / Smart Lock S231 / FamiLock E34 / FamiLock E35" },
  { name: "Lever Smart Lock", image: lever.url, models: "Lever Smart Lock C33 / FamiLock C32" },
  { name: "Video Smart Lock", image: video.url, models: "Video Smart Lock S330 / Video Smart Lock E330 / FamiLock S3 Max / FamiLock E40 / Smart Lock S4 / Smart Lock E38" },
  { name: "Retrofit Smart Lock", image: retrofit.url, models: "Retrofit Smart Lock R10 / Retrofit Smart Lock R20" },
  { name: "Wi-Fi Bridge & Chime", image: bridge.url, models: "Wi-Fi Doorbell Chime / Doorbell Chime / MiniBase Chime" },
];

export type DeviceKind = "homebase" | "lock" | "camera" | "light" | "climate";
export type HomeTab = "Tout" | "Sécurité" | "Éclairage" | "Climatisation";
export const homeTabs: HomeTab[] = ["Tout", "Sécurité", "Éclairage", "Climatisation"];
export const kindTab: Record<DeviceKind, Exclude<HomeTab, "Tout">> = {
  homebase: "Sécurité",
  lock: "Sécurité",
  camera: "Sécurité",
  light: "Éclairage",
  climate: "Climatisation",
};
export const kindImage: Record<DeviceKind, string> = {
  homebase: homebase.url,
  lock: video.url,
  camera: battery.url,
  light: bridge.url,
  climate: professional.url,
};

export type Device = {
  id: string;
  name: string;
  model: string;
  kind: DeviceKind;
  room: string;
  online: boolean;
  battery?: number;
  on?: boolean;
  temperature?: number;
};

export type House = { id: string; name: string; demo?: boolean; devices: Device[] };

export const rooms = ["Entrée", "Salon", "Cuisine", "Chambre", "Garage", "Jardin"];

export const demoHouse = (): House => ({
  id: "maison",
  name: "Ma maison",
  demo: true,
  devices: [
    { id: "hb", name: "HomeBase 3", model: "HomeBase S380", kind: "homebase", room: "Salon", online: true },
    { id: "lk1", name: "Serrure Entrée", model: "FamiLock S3 Max", kind: "lock", room: "Entrée", online: true, battery: 82 },
    { id: "lk2", name: "Serrure Garage", model: "Smart Lock C220", kind: "lock", room: "Garage", online: true, battery: 18 },
    { id: "cm1", name: "Caméra Jardin", model: "SoloCam S340", kind: "camera", room: "Jardin", online: true, battery: 64 },
    { id: "cm2", name: "Caméra Salon", model: "Indoor Cam C220", kind: "camera", room: "Salon", online: false },
    { id: "lt1", name: "Lumière Salon", model: "Ampoule connectée", kind: "light", room: "Salon", online: true, on: true },
    { id: "ac1", name: "Climatiseur Chambre", model: "Thermostat Wi-Fi", kind: "climate", room: "Chambre", online: true, temperature: 24 },
  ],
});

/** Auto-detects a device family from a scanned QR / serial number. */
export function detectDevice(code: string, hint = ""): { kind: DeviceKind; name: string; model: string } {
  const c = `${code} ${hint}`.toUpperCase();
  if (/T85|LOCK|FAMI|SERRURE|S3|E3\d|C2\d0/.test(c)) return { kind: "lock", name: "Serrure connectée", model: hint && /lock/i.test(hint) ? hint : "Smart Lock" };
  if (/HB|BASE|NVR/.test(c)) return { kind: "homebase", name: "HomeBase", model: hint || "HomeBase" };
  if (/LIGHT|BULB|LAMP|ÉCLAIRAGE|ECLAIRAGE/.test(c)) return { kind: "light", name: "Éclairage connecté", model: hint || "Ampoule connectée" };
  if (/CLIM|AC-|THERMO|HVAC/.test(c)) return { kind: "climate", name: "Climatiseur", model: hint || "Thermostat Wi-Fi" };
  return { kind: "camera", name: "Caméra", model: hint || "Caméra IHOMEY" };
}

export type AppEvent = {
  id: string;
  at: string; // ISO date
  type: "lock" | "alert" | "detection" | "system";
  title: string;
  detail: string;
};

export const eventFilters: [AppEvent["type"] | "all", string][] = [
  ["all", "Tout"],
  ["lock", "Serrures"],
  ["alert", "Alertes"],
  ["detection", "Détections"],
];

/** Demo history for today and yesterday, relative to the current date. */
export function demoEvents(now = new Date()): AppEvent[] {
  const at = (dayOffset: number, h: number, m: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - dayOffset);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  return [
    { id: "e1", at: at(0, 8, 12), type: "lock", title: "Serrure Entrée déverrouillée", detail: "Empreinte digitale · Utilisateur principal" },
    { id: "e2", at: at(0, 8, 13), type: "lock", title: "Serrure Entrée verrouillée", detail: "Verrouillage automatique après 30 s" },
    { id: "e3", at: at(0, 10, 41), type: "detection", title: "Personne détectée", detail: "Caméra Jardin · Allée principale" },
    { id: "e4", at: at(0, 12, 5), type: "alert", title: "Batterie faible", detail: "Serrure Garage · 18 % restants" },
    { id: "e5", at: at(0, 14, 30), type: "alert", title: "Caméra hors ligne", detail: "Caméra Salon · Vérifiez le Wi-Fi" },
    { id: "e6", at: at(1, 7, 55), type: "lock", title: "Serrure Garage déverrouillée", detail: "Code temporaire · Livreur" },
    { id: "e7", at: at(1, 19, 2), type: "detection", title: "Mouvement détecté", detail: "Caméra Jardin · Portail" },
    { id: "e8", at: at(1, 22, 30), type: "system", title: "Mode Armé activé", detail: "HomeBase 3 · Programmation du soir" },
  ];
}

/** Display currencies for cloud prices (base prices are USD). Rates are indicative. */
export const currencies = {
  MAD: { rate: 10, format: (v: number) => `${v.toFixed(2).replace(".", ",")} MAD` },
  EUR: { rate: 0.92, format: (v: number) => `${v.toFixed(2).replace(".", ",")} €` },
  USD: { rate: 1, format: (v: number) => `$${v.toFixed(2)}` },
} as const;
export type Currency = keyof typeof currencies;
