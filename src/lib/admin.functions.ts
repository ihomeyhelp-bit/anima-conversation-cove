import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || !data) throw new Error("Accès réservé aux administrateurs");
}

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
    const ids = new Set((roles ?? []).map((r) => r.user_id));
    const { data } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    return (data?.users ?? []).filter((u) => ids.has(u.id)).map((u) => ({ id: u.id, email: u.email ?? "" }));
  });

export const addAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { email: string }) => ({ email: String(input.email).trim().toLowerCase() }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const user = list?.users.find((u) => u.email?.toLowerCase() === data.email);
    if (!user) throw new Error("Aucun compte avec cet email. La personne doit d'abord créer un compte sur /auth.");
    const { error } = await supabaseAdmin.from("user_roles").upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { userId: string }) => ({ userId: String(input.userId) }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId) throw new Error("Vous ne pouvez pas retirer votre propre accès.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", "admin");
    if (error) throw new Error(error.message);
    return { ok: true };
  });
