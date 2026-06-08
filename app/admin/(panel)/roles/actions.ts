"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { roles, rolePermissions } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/permissions";
import type { ModuleKey } from "@/lib/auth/permissions";

export async function createRole(formData: FormData): Promise<void> {
  await requireAdmin();
  await requirePermission("roles");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!name) return;
  if (name === "Superadmin") return; // nom réservé

  await db.insert(roles).values({ name, description });
  revalidatePath("/admin/roles");
}

export async function deleteRole(idRaw: string): Promise<void> {
  await requireAdmin();
  await requirePermission("roles");

  const id = Number(idRaw);

  // Empêcher la suppression du rôle Superadmin
  const [role] = await db.select({ name: roles.name }).from(roles).where(eq(roles.id, id)).limit(1);
  if (role?.name === "Superadmin") return;

  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
  await db.delete(roles).where(eq(roles.id, id));
  revalidatePath("/admin/roles");
}

export async function togglePermission(
  roleId: number,
  moduleKey: ModuleKey,
  grant: boolean,
): Promise<void> {
  await requireAdmin();
  await requirePermission("roles");

  // Bloquer toute modification du rôle Superadmin
  const [role] = await db.select({ name: roles.name }).from(roles).where(eq(roles.id, roleId)).limit(1);
  if (role?.name === "Superadmin") return;

  if (grant) {
    const existing = await db
      .select({ id: rolePermissions.id })
      .from(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, roleId),
          eq(rolePermissions.moduleKey, moduleKey),
        ),
      )
      .limit(1);
    if (existing.length === 0) {
      await db.insert(rolePermissions).values({ roleId, moduleKey });
    }
  } else {
    await db
      .delete(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, roleId),
          eq(rolePermissions.moduleKey, moduleKey),
        ),
      );
  }

  revalidatePath("/admin/roles");
}
