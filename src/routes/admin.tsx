import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { LogOut, Minus, Package, Pencil, Plus, ShoppingBag, Trash2, Users, Warehouse } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/categories";
import { productSlug } from "@/lib/products";
import { addAdmin, listAdmins, removeAdmin } from "@/lib/admin.functions";
import logo from "@/assets/brand/ihomey-logo.png.asset.json";

type Bundle = { name: string; price: string; note: string; image: string };
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"] & { order_items: Database["public"]["Tables"]["order_items"]["Row"][] };

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [
    { name: "robots", content: "noindex, nofollow" },
    { title: "Administration | iHOMEY" },
    { name: "description", content: "Gestion des produits, du stock et des commandes iHOMEY." },
    { property: "og:title", content: "Administration | iHOMEY" },
    { property: "og:description", content: "Gestion des produits, du stock et des commandes iHOMEY." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AdminPage,
});

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const STATUS: Record<string, string> = { pending: "En attente", paid: "Payée", shipped: "Expédiée", delivered: "Livrée", cancelled: "Annulée" };

function AdminPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "denied" | "ok">("loading");
  const [email, setEmail] = useState("");
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return navigate({ to: "/auth", replace: true });
      setEmail(data.user.email ?? "");
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      setState(isAdmin ? "ok" : "denied");
    })();
  }, [navigate]);
  const qc = useQueryClient();
  async function signOut() { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }

  if (state === "loading") return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Chargement…</div>;
  if (state === "denied") return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Accès refusé</h1>
      <p className="text-muted-foreground">Le compte {email} n'est pas administrateur. Demandez à un administrateur de vous ajouter.</p>
      <Button variant="outline" onClick={signOut}>Se déconnecter</Button>
    </div>
  );
  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4"><Link to="/"><img src={logo.url} alt="iHOMEY" className="h-7" /></Link><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">Admin</span></div>
          <div className="flex items-center gap-3 text-sm"><span className="hidden text-muted-foreground sm:inline">{email}</span><Button variant="ghost" size="sm" onClick={signOut}><LogOut className="mr-1 h-4 w-4" />Déconnexion</Button></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-6 h-auto flex-wrap rounded-full bg-background p-1">
            <TabsTrigger value="products" className="rounded-full"><Package className="mr-2 h-4 w-4" />Produits</TabsTrigger>
            <TabsTrigger value="stock" className="rounded-full"><Warehouse className="mr-2 h-4 w-4" />Stock</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-full"><ShoppingBag className="mr-2 h-4 w-4" />Commandes</TabsTrigger>
            <TabsTrigger value="admins" className="rounded-full"><Users className="mr-2 h-4 w-4" />Administrateurs</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="stock"><StockTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="admins"><AdminsTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function useProducts() {
  return useQuery({ queryKey: ["admin-products"], queryFn: async () => {
    const { data, error } = await supabase.from("products").select("*").order("category").order("name");
    if (error) throw error; return data;
  } });
}

const Card = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-border bg-background p-6">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">{title}</h2>{action}</div>
    {children}
  </section>
);

function ProductsTab() {
  const { data = [] } = useProducts();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<ProductRow> | null>(null);
  const [q, setQ] = useState("");
  const list = data.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Produit supprimé"); qc.invalidateQueries({ queryKey: ["admin-products"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Card title={`Produits (${data.length})`} action={<div className="flex gap-2"><Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="w-48" /><Button className="rounded-full" onClick={() => setEditing({ active: true, stock: 0, price_cents: 0, low_stock_threshold: 5, category: categories[0]?.slug ?? "" })}><Plus className="mr-1 h-4 w-4" />Ajouter</Button></div>}>
      <Table>
        <TableHeader><TableRow><TableHead>Produit</TableHead><TableHead>Catégorie</TableHead><TableHead>Prix</TableHead><TableHead>Stock</TableHead><TableHead>Statut</TableHead><TableHead /></TableRow></TableHeader>
        <TableBody>{list.map((p) => (
          <TableRow key={p.id}>
            <TableCell><div className="flex items-center gap-3"><img src={p.image_url} alt="" className="h-12 w-12 rounded-lg bg-muted object-contain" /><div><div className="font-semibold">{p.name}</div><div className="text-xs text-muted-foreground">{p.series}</div></div></div></TableCell>
            <TableCell>{categories.find((c) => c.slug === p.category)?.name ?? p.category}</TableCell>
            <TableCell>{p.price_cents ? money(p.price_cents) : "—"}</TableCell>
            <TableCell>{p.stock}</TableCell>
            <TableCell>{p.active ? <Badge>En ligne</Badge> : <Badge variant="secondary">Masqué</Badge>}</TableCell>
            <TableCell className="text-right"><Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => confirm(`Supprimer ${p.name} ?`) && del.mutate(p.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
          </TableRow>))}</TableBody>
      </Table>
      {editing && <ProductDialog product={editing} onClose={() => setEditing(null)} />}
    </Card>
  );
}

function ProductDialog({ product, onClose }: { product: Partial<ProductRow>; onClose: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState({ ...product, price: ((product.price_cents ?? 0) / 100).toFixed(2) });
  const [uploading, setUploading] = useState(false);
  const set = (k: string, v: unknown) => setF((s) => ({ ...s, [k]: v }));
  const save = useMutation({
    mutationFn: async () => {
      const row = { gallery: f.gallery ?? [], scenes: f.scenes ?? [], details: (f.details ?? []).filter(Boolean), bundles: (f.bundles ?? []) as Database["public"]["Tables"]["products"]["Row"]["bundles"], custom_page: !!f.custom_page, name: f.name ?? "", slug: f.slug || productSlug(f.name ?? ""), category: f.category ?? "", series: f.series ?? "", description: f.description ?? "", image_url: f.image_url ?? "", price_cents: Math.round(Number(f.price) * 100) || 0, stock: Number(f.stock) || 0, low_stock_threshold: Number(f.low_stock_threshold) || 0, active: !!f.active };
      if (!row.name) throw new Error("Le nom est obligatoire");
      const { error } = product.id ? await supabase.from("products").update(row).eq("id", product.id) : await supabase.from("products").insert(row);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Produit enregistré"); qc.invalidateQueries({ queryKey: ["admin-products"] }); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });
  async function upload(file: File): Promise<void> { const url = await uploadFile(file); if (url) set("image_url", url); }
  async function uploadFile(file: File): Promise<string | null> {
    setUploading(true);
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { setUploading(false); toast.error(error.message); return null; }
    const { data, error: e2 } = await supabase.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    setUploading(false);
    if (e2 || !data) { toast.error(e2?.message ?? "Échec de l'envoi"); return null; }
    return data.signedUrl;
  }
  const bundles = (Array.isArray(f.bundles) ? f.bundles : []) as Bundle[];
  const addImages = async (k: "gallery" | "scenes", files: FileList) => { const urls: string[] = []; for (const file of Array.from(files)) { const u = await uploadFile(file); if (u) urls.push(u); } set(k, [...(f[k] ?? []), ...urls]); };
  const ImageList = ({ k, label }: { k: "gallery" | "scenes"; label: string }) => (
    <div className="space-y-2 sm:col-span-2"><Label>{label}</Label>
      <div className="flex flex-wrap gap-2">{(f[k] ?? []).map((u, i) => <div key={u + i} className="relative"><img src={u} alt="" className="h-20 w-20 rounded-lg bg-muted object-contain" /><div className="absolute inset-x-0 bottom-0 flex justify-between"><Button size="icon" variant="secondary" className="h-6 w-6" disabled={i === 0} onClick={() => { const a = [...(f[k] ?? [])]; [a[i - 1], a[i]] = [a[i]!, a[i - 1]!]; set(k, a); }}>‹</Button><Button size="icon" variant="destructive" className="h-6 w-6" onClick={() => set(k, (f[k] ?? []).filter((_, j) => j !== i))}>×</Button></div></div>)}</div>
      <Input type="file" accept="image/*" multiple disabled={uploading} onChange={(e) => e.target.files?.length && addImages(k, e.target.files)} />
    </div>
  );
  const setBundle = (i: number, patch: Partial<Bundle>) => set("bundles", bundles.map((b, j) => j === i ? { ...b, ...patch } : b));
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader><DialogTitle>{product.id ? "Modifier le produit" : "Nouveau produit"}</DialogTitle><DialogDescription>Les champs sont enregistrés dans votre catalogue.</DialogDescription></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2"><Label>Nom</Label><Input value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="space-y-1"><Label>Catégorie</Label><Select value={f.category ?? ""} onValueChange={(v) => set("category", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Série</Label><Input value={f.series ?? ""} onChange={(e) => set("series", e.target.value)} /></div>
          <div className="space-y-1"><Label>Prix ($)</Label><Input type="number" step="0.01" min="0" value={f.price} onChange={(e) => set("price", e.target.value)} /></div>
          <div className="space-y-1"><Label>Stock</Label><Input type="number" min="0" value={f.stock ?? 0} onChange={(e) => set("stock", e.target.value)} /></div>
          <div className="space-y-1"><Label>Alerte stock bas</Label><Input type="number" min="0" value={f.low_stock_threshold ?? 5} onChange={(e) => set("low_stock_threshold", e.target.value)} /></div>
          <div className="flex items-center gap-3 pt-6"><Switch checked={!!f.active} onCheckedChange={(v) => set("active", v)} /><Label>En ligne</Label></div>
          <div className="space-y-1 sm:col-span-2"><Label>Description</Label><Textarea rows={3} value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Photo</Label>
            <div className="flex items-center gap-3">{f.image_url && <img src={f.image_url} alt="" className="h-16 w-16 rounded-lg bg-muted object-contain" />}<Input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} /></div>
          </div>
          <div className="sm:col-span-2 border-t border-border pt-4"><div className="flex items-center gap-3"><Switch checked={!!f.custom_page} onCheckedChange={(v) => set("custom_page", v)} /><Label>Utiliser ce contenu sur la page produit</Label></div><p className="mt-1 text-xs text-muted-foreground">Sinon, la page affiche le contenu FamiLock provisoire.</p></div>
          <ImageList k="gallery" label="Photos produit (galerie)" />
          <ImageList k="scenes" label="Photos de scène" />
          <div className="space-y-1 sm:col-span-2"><Label>Détails (un point par ligne — « Titre: texte » met le titre en gras)</Label><Textarea rows={6} value={(f.details ?? []).join("\n")} onChange={(e) => set("details", e.target.value.split("\n"))} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Bundles</Label>
            {bundles.map((b, i) => <div key={i} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-2">
              <Input placeholder="Nom du bundle" value={b.name} onChange={(e) => setBundle(i, { name: e.target.value })} />
              <Input placeholder="Prix ($)" type="number" step="0.01" value={b.price} onChange={(e) => setBundle(i, { price: e.target.value })} />
              <Input className="sm:col-span-2" placeholder="Note (ex. produits inclus, réduction)" value={b.note} onChange={(e) => setBundle(i, { note: e.target.value })} />
              <div className="flex items-center gap-2 sm:col-span-2">{b.image && <img src={b.image} alt="" className="h-12 w-12 rounded bg-muted object-contain" />}<Input type="file" accept="image/*" disabled={uploading} onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const u = await uploadFile(file); if (u) setBundle(i, { image: u }); } }} /><Button variant="ghost" size="icon" onClick={() => set("bundles", bundles.filter((_, j) => j !== i))}><Trash2 /></Button></div>
            </div>)}
            <Button variant="outline" onClick={() => set("bundles", [...bundles, { name: "", price: "", note: "", image: "" }])}><Plus /> Ajouter un bundle</Button>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Annuler</Button><Button onClick={() => save.mutate()} disabled={save.isPending || uploading}>Enregistrer</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StockTab() {
  const { data = [] } = useProducts();
  const qc = useQueryClient();
  const update = useMutation({
    mutationFn: async ({ id, stock }: { id: string; stock: number }) => { const { error } = await supabase.from("products").update({ stock: Math.max(0, stock) }).eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
    onError: (e: Error) => toast.error(e.message),
  });
  const low = data.filter((p) => p.stock <= p.low_stock_threshold);
  const total = data.reduce((s, p) => s + p.stock, 0);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Unités en stock" value={total} /><Stat label="Produits" value={data.length} /><Stat label="Stock bas / rupture" value={low.length} />
      </div>
      <Card title="Niveaux de stock">
        <Table>
          <TableHeader><TableRow><TableHead>Produit</TableHead><TableHead>État</TableHead><TableHead className="text-right">Quantité</TableHead></TableRow></TableHeader>
          <TableBody>{[...data].sort((a, b) => a.stock - b.stock).map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.stock === 0 ? <Badge variant="destructive">Rupture</Badge> : p.stock <= p.low_stock_threshold ? <Badge variant="secondary">Stock bas</Badge> : <Badge variant="outline">OK</Badge>}</TableCell>
              <TableCell><div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="icon" aria-label="Retirer" onClick={() => update.mutate({ id: p.id, stock: p.stock - 1 })}><Minus className="h-4 w-4" /></Button>
                <Input key={p.stock} type="number" min="0" defaultValue={p.stock} className="w-20 text-center" onBlur={(e) => Number(e.target.value) !== p.stock && update.mutate({ id: p.id, stock: Number(e.target.value) })} />
                <Button variant="outline" size="icon" aria-label="Ajouter" onClick={() => update.mutate({ id: p.id, stock: p.stock + 1 })}><Plus className="h-4 w-4" /></Button>
              </div></TableCell>
            </TableRow>))}</TableBody>
        </Table>
      </Card>
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-background p-5"><div className="text-sm text-muted-foreground">{label}</div><div className="mt-1 text-3xl font-bold">{value}</div></div>
);

function OrdersTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState<OrderRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState("all");
  const { data = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: async () => {
    const { data, error } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    if (error) throw error; return data as OrderRow[];
  } });
  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const { error } = await supabase.from("orders").update({ status }).eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Statut mis à jour"); qc.invalidateQueries({ queryKey: ["admin-orders"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const list = filter === "all" ? data : data.filter((o) => o.status === filter);
  const revenue = data.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total_cents, 0);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Commandes" value={data.length} /><Stat label="En attente" value={data.filter((o) => o.status === "pending").length} /><Stat label="Chiffre d'affaires" value={money(revenue)} />
      </div>
      <Card title="Commandes" action={<div className="flex gap-2"><Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Toutes</SelectItem>{Object.entries(STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select><Button className="rounded-full" onClick={() => setCreating(true)}><Plus className="mr-1 h-4 w-4" />Nouvelle commande</Button></div>}>
        {list.length === 0 ? <p className="py-10 text-center text-muted-foreground">Aucune commande pour le moment.</p> : (
          <Table>
            <TableHeader><TableRow><TableHead>N°</TableHead><TableHead>Client</TableHead><TableHead>Date</TableHead><TableHead>Total</TableHead><TableHead>Statut</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{list.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-semibold">#{o.number}</TableCell>
                <TableCell><div>{o.customer_name}</div><div className="text-xs text-muted-foreground">{o.customer_email}</div></TableCell>
                <TableCell>{new Date(o.created_at).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>{money(o.total_cents)}</TableCell>
                <TableCell><Select value={o.status} onValueChange={(status) => setStatus.mutate({ id: o.id, status })}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => setOpen(o)}>Détails</Button></TableCell>
              </TableRow>))}</TableBody>
          </Table>)}
      </Card>
      {open && <Dialog open onOpenChange={(o) => !o && setOpen(null)}><DialogContent>
        <DialogHeader><DialogTitle>Commande #{open.number}</DialogTitle><DialogDescription>{STATUS[open.status]} · {new Date(open.created_at).toLocaleString("fr-FR")}</DialogDescription></DialogHeader>
        <div className="space-y-1 text-sm"><p className="font-semibold">{open.customer_name}</p><p>{open.customer_email} {open.customer_phone && `· ${open.customer_phone}`}</p><p className="whitespace-pre-line text-muted-foreground">{open.shipping_address}</p></div>
        <ul className="divide-y divide-border rounded-xl border border-border text-sm">{open.order_items.map((i) => <li key={i.id} className="flex justify-between p-3"><span>{i.product_name} × {i.quantity}</span><span>{money(i.unit_price_cents * i.quantity)}</span></li>)}</ul>
        <p className="text-right font-bold">Total {money(open.total_cents)}</p>
        {open.notes && <p className="text-sm text-muted-foreground">{open.notes}</p>}
      </DialogContent></Dialog>}
      {creating && <NewOrderDialog onClose={() => setCreating(false)} />}
    </div>
  );
}

function NewOrderDialog({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { data: products = [] } = useProducts();
  const [c, setC] = useState({ customer_name: "", customer_email: "", customer_phone: "", shipping_address: "", notes: "" });
  const [lines, setLines] = useState<{ productId: string; quantity: number }[]>([{ productId: "", quantity: 1 }]);
  const total = useMemo(() => lines.reduce((s, l) => s + (products.find((p) => p.id === l.productId)?.price_cents ?? 0) * l.quantity, 0), [lines, products]);
  const save = useMutation({
    mutationFn: async () => {
      const items = lines.filter((l) => l.productId && l.quantity > 0).map((l) => { const p = products.find((x) => x.id === l.productId)!; return { p, quantity: l.quantity }; });
      if (!c.customer_name || !c.customer_email || !items.length) throw new Error("Client, email et au moins un produit sont obligatoires");
      const { data: order, error } = await supabase.from("orders").insert({ ...c, total_cents: total }).select().single();
      if (error) throw error;
      const { error: e2 } = await supabase.from("order_items").insert(items.map(({ p, quantity }) => ({ order_id: order.id, product_id: p.id, product_name: p.name, unit_price_cents: p.price_cents, quantity })));
      if (e2) throw e2;
      for (const { p, quantity } of items) await supabase.from("products").update({ stock: Math.max(0, p.stock - quantity) }).eq("id", p.id);
    },
    onSuccess: () => { toast.success("Commande créée, stock mis à jour"); qc.invalidateQueries({ queryKey: ["admin-orders"] }); qc.invalidateQueries({ queryKey: ["admin-products"] }); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const setField = (k: keyof typeof c) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setC({ ...c, [k]: e.target.value });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
      <DialogHeader><DialogTitle>Nouvelle commande</DialogTitle><DialogDescription>Le stock des produits est déduit automatiquement.</DialogDescription></DialogHeader>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1"><Label>Nom du client</Label><Input value={c.customer_name} onChange={setField("customer_name")} /></div>
        <div className="space-y-1"><Label>Email</Label><Input type="email" value={c.customer_email} onChange={setField("customer_email")} /></div>
        <div className="space-y-1"><Label>Téléphone</Label><Input value={c.customer_phone} onChange={setField("customer_phone")} /></div>
        <div className="space-y-1 sm:col-span-2"><Label>Adresse de livraison</Label><Textarea rows={2} value={c.shipping_address} onChange={setField("shipping_address")} /></div>
      </div>
      <div className="space-y-2">{lines.map((l, i) => (
        <div key={i} className="flex gap-2">
          <Select value={l.productId} onValueChange={(v) => setLines(lines.map((x, j) => (j === i ? { ...x, productId: v } : x)))}><SelectTrigger className="flex-1"><SelectValue placeholder="Produit" /></SelectTrigger><SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} ({p.stock})</SelectItem>)}</SelectContent></Select>
          <Input type="number" min="1" className="w-20" value={l.quantity} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, quantity: Number(e.target.value) } : x)))} />
          <Button variant="ghost" size="icon" aria-label="Retirer la ligne" onClick={() => setLines(lines.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
        </div>))}
        <Button variant="outline" size="sm" onClick={() => setLines([...lines, { productId: "", quantity: 1 }])}><Plus className="mr-1 h-4 w-4" />Ajouter un produit</Button>
      </div>
      <div className="space-y-1"><Label>Notes</Label><Textarea rows={2} value={c.notes} onChange={setField("notes")} /></div>
      <DialogFooter className="items-center"><span className="mr-auto font-bold">Total {money(total)}</span><Button variant="outline" onClick={onClose}>Annuler</Button><Button onClick={() => save.mutate()} disabled={save.isPending}>Créer</Button></DialogFooter>
    </DialogContent></Dialog>
  );
}

function AdminsTab() {
  const qc = useQueryClient();
  const list = useServerFn(listAdmins), add = useServerFn(addAdmin), remove = useServerFn(removeAdmin);
  const [email, setEmail] = useState("");
  const { data = [] } = useQuery({ queryKey: ["admins"], queryFn: () => list() });
  const addM = useMutation({ mutationFn: () => add({ data: { email } }), onSuccess: () => { toast.success("Administrateur ajouté"); setEmail(""); qc.invalidateQueries({ queryKey: ["admins"] }); }, onError: (e: Error) => toast.error(e.message) });
  const rmM = useMutation({ mutationFn: (userId: string) => remove({ data: { userId } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admins"] }), onError: (e: Error) => toast.error(e.message) });
  return (
    <Card title="Administrateurs">
      <p className="mb-4 text-sm text-muted-foreground">La personne crée d'abord son compte sur la page de connexion admin, puis vous l'ajoutez ici avec son email.</p>
      <form className="mb-6 flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); addM.mutate(); }}><Input type="email" required placeholder="email@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} /><Button type="submit" className="rounded-full" disabled={addM.isPending}>Ajouter</Button></form>
      <ul className="divide-y divide-border">{data.map((a) => <li key={a.id} className="flex items-center justify-between py-3"><span>{a.email}</span><Button variant="ghost" size="sm" onClick={() => rmM.mutate(a.id)}>Retirer</Button></li>)}</ul>
    </Card>
  );
}
