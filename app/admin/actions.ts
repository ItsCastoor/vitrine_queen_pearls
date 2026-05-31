"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { admins, siteSettings } from "@/lib/db/schema";
import { getResource, type FieldDef } from "@/lib/admin/registry";
import { requireAdmin } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { slugify } from "@/lib/slug";

function coerceField(field: FieldDef, formData: FormData): unknown {
  const raw = formData.get(field.name);

  switch (field.type) {
    case "boolean":
      return raw === "on" || raw === "true" || raw === "1";
    case "number": {
      if (raw == null || raw === "") return 0;
      const n = Number(raw);
      return Number.isNaN(n) ? 0 : n;
    }
    case "date":
    case "datetime": {
      if (!raw) return null;
      const d = new Date(String(raw));
      return Number.isNaN(d.getTime()) ? null : d;
    }
    default: {
      const v = raw == null ? "" : String(raw);
      return v === "" ? null : v;
    }
  }
}

function buildValues(
  fields: FieldDef[],
  formData: FormData,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    values[field.name] = coerceField(field, formData);
  }
  return values;
}

export async function saveResource(
  resourceKey: string,
  idRaw: string | null,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource) throw new Error("Ressource inconnue.");

  const values = buildValues(resource.fields, formData);

  // Logique spéciale pour galerie-items : categoryId string → number|null
  if (resourceKey === "galerie-items" && "categoryId" in values) {
    const catId = values.categoryId;
    if (catId === "" || catId == null) {
      values.categoryId = null;
    } else {
      const parsed = Number(catId);
      values.categoryId = Number.isNaN(parsed) ? null : parsed;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = resource.table as any;

  // Slug généré automatiquement à partir du champ source (titre, nom…).
  if (resource.slugFrom) {
    const source = String(formData.get(resource.slugFrom) ?? "").trim();
    const base = slugify(source) || "element";
    const rows: { id: number; slug: string | null }[] = await db
      .select({ id: table.id, slug: table.slug })
      .from(table);
    const taken = new Set(
      rows
        .filter((r) => String(r.id) !== String(idRaw))
        .map((r) => r.slug)
        .filter((s): s is string => !!s),
    );
    let candidate = base;
    let i = 2;
    while (taken.has(candidate)) {
      candidate = `${base}-${i++}`;
    }
    values.slug = candidate;
  }

  if (idRaw) {
    const id = Number(idRaw);
    await db.update(table).set(values).where(sql`id = ${id}`);
  } else {
    await db.insert(table).values(values);
  }

  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}`);
}

export async function deleteResource(
  resourceKey: string,
  idRaw: string,
): Promise<void> {
  await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource) throw new Error("Ressource inconnue.");

  const id = Number(idRaw);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.delete(resource.table as any).where(sql`id = ${id}`);

  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}`);
}

export async function saveSettings(formData: FormData): Promise<void> {
  await requireAdmin();
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onDuplicateKeyUpdate({ set: { value } });
  }
  revalidatePath("/admin/parametres");
  redirect("/admin/parametres?saved=1");
}

export type PasswordState = { ok: boolean; error?: string };

export async function changePassword(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const session = await requireAdmin();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 8) {
    return { ok: false, error: "Le nouveau mot de passe doit faire au moins 8 caractères." };
  }
  if (next !== confirm) {
    return { ok: false, error: "La confirmation ne correspond pas." };
  }

  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.id, session.adminId!))
    .limit(1);

  if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
    return { ok: false, error: "Mot de passe actuel incorrect." };
  }

  const hash = await hashPassword(next);
  await db.update(admins).set({ passwordHash: hash }).where(eq(admins.id, admin.id));

  return { ok: true };
}
