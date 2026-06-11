"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { partnershipApplications, partners } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/permissions";

type Status = "new" | "read" | "accepted" | "rejected";

export async function setPartnershipStatus(
  idRaw: string,
  status: Status,
): Promise<void> {
  await requireAdmin();
  await requirePermission("partenaires");
  const id = Number(idRaw);

  await db
    .update(partnershipApplications)
    .set({ status })
    .where(eq(partnershipApplications.id, id));

  // À l'acceptation : publier directement le partenaire sur le site
  if (status === "accepted") {
    const [app] = await db
      .select()
      .from(partnershipApplications)
      .where(eq(partnershipApplications.id, id))
      .limit(1);

    if (app) {
      const existing = await db
        .select({ id: partners.id })
        .from(partners)
        .where(eq(partners.name, app.clubName))
        .limit(1);

      if (existing.length === 0) {
        const url = app.links && /^https?:\/\//i.test(app.links) ? app.links : null;
        await db.insert(partners).values({
          name: app.clubName,
          url,
          logoUrl: app.logoUrl ?? null,
          description: app.message ?? null,
        });
      }
    }
  }

  // Si on repasse en "new" ou "rejected" depuis "accepted" : dépublier le partenaire associé
  if (status === "new" || status === "rejected") {
    const [app] = await db
      .select({ clubName: partnershipApplications.clubName })
      .from(partnershipApplications)
      .where(eq(partnershipApplications.id, id))
      .limit(1);

    if (app) {
      await db.delete(partners).where(eq(partners.name, app.clubName));
    }
  }

  revalidatePath("/admin/partenaires");
  revalidatePath("/partenaires");
}

export async function deletePartnership(idRaw: string): Promise<void> {
  await requireAdmin();
  await requirePermission("partenaires");
  const id = Number(idRaw);
  await db
    .delete(partnershipApplications)
    .where(eq(partnershipApplications.id, id));

  revalidatePath("/admin/partenaires");
}
