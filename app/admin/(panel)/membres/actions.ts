"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db } from "@/lib/db/client";
import { admins, roles } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/permissions";

import { hashPassword } from "@/lib/auth/password";

export async function createAdmin(formData: FormData): Promise<{ setupUrl?: string; direct?: boolean; error?: string }> {
  await requireAdmin();
  await requirePermission("membres");

  const username = String(formData.get("username") ?? "").trim();
  const roleId = formData.get("roleId") ? Number(formData.get("roleId")) : null;
  const isEnabled = formData.get("isEnabled") === "1";
  const rawPassword = String(formData.get("password") ?? "").trim();

  if (!username) return { error: "Identifiant requis." };
  if (!roleId) return { error: "Un rôle doit être sélectionné." };

  // Vérifier que le rôle sélectionné n'est pas Superadmin
  const [selectedRole] = await db.select({ name: roles.name }).from(roles).where(eq(roles.id, roleId)).limit(1);
  if (!selectedRole) return { error: "Rôle introuvable." };
  if (selectedRole.name === "Superadmin") return { error: "Le rôle Superadmin ne peut pas être assigné à la création." };

  // Vérifier unicité
  const existing = await db.select({ id: admins.id }).from(admins).where(eq(admins.username, username)).limit(1);
  if (existing.length > 0) return { error: `L'identifiant « ${username} » est déjà utilisé.` };

  if (rawPassword) {
    if (rawPassword.length < 8) return { error: "Le mot de passe doit faire au moins 8 caractères." };
    const passwordHash = await hashPassword(rawPassword);
    await db.insert(admins).values({ username, passwordHash, isEnabled, roleId });
    revalidatePath("/admin/membres");
    return { direct: true };
  }

  const setupToken = randomBytes(32).toString("hex");
  try {
    await db.insert(admins).values({ username, passwordHash: "", isEnabled, roleId, setupToken });
  } catch (err: unknown) {
    // Colonne setup_token absente (migration non appliquée) → erreur explicite
    if (typeof err === "object" && err !== null && "errno" in err && (err as { errno: number }).errno === 1054) {
      return { error: "La colonne setup_token n'existe pas encore en base. Veuillez exécuter npm run db:migrate puis réessayer." };
    }
    throw err;
  }
  revalidatePath("/admin/membres");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return { setupUrl: `${siteUrl}/admin/setup/${setupToken}` };
}

export async function deleteAdmin(idRaw: string): Promise<void> {
  const session = await requireAdmin();
  await requirePermission("membres");

  const id = Number(idRaw);
  if (id === session.adminId) return; // protection auto
  await db.delete(admins).where(eq(admins.id, id));
  revalidatePath("/admin/membres");
}

export async function toggleAdminEnabled(idRaw: string, enabled: boolean): Promise<void> {
  const session = await requireAdmin();
  await requirePermission("membres");

  const id = Number(idRaw);
  if (id === session.adminId) return;

  await db.update(admins).set({ isEnabled: enabled }).where(eq(admins.id, id));
  revalidatePath("/admin/membres");
}

export async function changeAdminRole(idRaw: string, roleIdRaw: string): Promise<void> {
  const session = await requireAdmin();
  await requirePermission("membres");

  const id = Number(idRaw);
  if (id === session.adminId) return;

  const roleId = roleIdRaw ? Number(roleIdRaw) : null;
  await db.update(admins).set({ roleId }).where(eq(admins.id, id));
  revalidatePath("/admin/membres");
}

export async function linkStaffProfile(idRaw: string, staffIdRaw: string): Promise<void> {
  const session = await requireAdmin();
  await requirePermission("membres");

  const id = Number(idRaw);
  if (id === session.adminId) return;

  const staffId = staffIdRaw ? Number(staffIdRaw) : null;
  await db.update(admins).set({ staffId }).where(eq(admins.id, id));
  revalidatePath("/admin/membres");
}
