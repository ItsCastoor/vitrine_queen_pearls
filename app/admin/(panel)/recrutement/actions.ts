"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { recruitmentApplications, staff } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";

type Status = "new" | "read" | "accepted" | "rejected";

function parseAnswers(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export async function setApplicationStatus(
  idRaw: string,
  status: Status,
): Promise<void> {
  await requireAdmin();
  const id = Number(idRaw);

  await db
    .update(recruitmentApplications)
    .set({ status })
    .where(eq(recruitmentApplications.id, id));

  // Créer un brouillon de fiche membre si la candidature est acceptée
  if (status === "accepted") {
    const [app] = await db
      .select()
      .from(recruitmentApplications)
      .where(eq(recruitmentApplications.id, id))
      .limit(1);

    if (app) {
      const answers = parseAnswers(app.answers);
      const roleLabel =
        app.type === "staff"
          ? `Instructrice${typeof answers.__formId === "string" ? ` · ${answers.__formId}` : ""}`
          : "Membre";
      const description =
        typeof answers.motivation === "string" && answers.motivation
          ? answers.motivation
          : typeof app.message === "string" && app.message
            ? app.message
            : null;

      // Insérer seulement si pas déjà une fiche avec ce pseudo
      const existing = await db
        .select({ id: staff.id })
        .from(staff)
        .where(eq(staff.name, app.pseudo))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(staff).values({
          name: app.pseudo,
          role: roleLabel,
          description,
          isActive: false, // brouillon — en attente de validation pour publication
        });
      }
    }
  }

  revalidatePath("/admin/recrutement");
  revalidatePath("/admin/staff");
}

export async function deleteApplication(idRaw: string): Promise<void> {
  await requireAdmin();
  const id = Number(idRaw);
  await db
    .delete(recruitmentApplications)
    .where(eq(recruitmentApplications.id, id));

  revalidatePath("/admin/recrutement");
}
