"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { recruitmentApplications } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";

type Status = "new" | "read" | "accepted" | "rejected";

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

  revalidatePath("/admin/recrutement");
}

export async function deleteApplication(idRaw: string): Promise<void> {
  await requireAdmin();
  const id = Number(idRaw);
  await db
    .delete(recruitmentApplications)
    .where(eq(recruitmentApplications.id, id));

  revalidatePath("/admin/recrutement");
}
