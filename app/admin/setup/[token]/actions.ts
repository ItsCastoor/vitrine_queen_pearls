"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { admins, rolePermissions } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import type { ModuleKey } from "@/lib/auth/permissions";

export async function setupPassword(
  token: string,
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  if (password !== confirm) return { error: "Les mots de passe ne correspondent pas." };

  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.setupToken, token))
    .limit(1);

  if (!admin) return { error: "Lien invalide ou déjà utilisé." };

  if (!admin.isEnabled) return { error: "Ce compte est désactivé. Contactez un administrateur." };

  const passwordHash = await hashPassword(password);

  await db
    .update(admins)
    .set({ passwordHash, setupToken: null })
    .where(eq(admins.id, admin.id));

  // Ouvrir la session directement
  if (admin.roleId) {
    const perms = await db
      .select({ moduleKey: rolePermissions.moduleKey })
      .from(rolePermissions)
      .where(eq(rolePermissions.roleId, admin.roleId));
    await createSession(admin.id, admin.username, admin.roleId, perms.map((p) => p.moduleKey as ModuleKey));
  } else {
    await createSession(admin.id, admin.username, null, []);
  }

  redirect("/admin");
}
