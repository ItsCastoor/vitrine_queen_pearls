"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { guestbookEntries } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";

type Status = "pending" | "approved" | "rejected";

export async function setGuestbookStatus(
  idRaw: string,
  status: Status,
): Promise<void> {
  await requireAdmin();
  const id = Number(idRaw);
  await db
    .update(guestbookEntries)
    .set({ status, isPublished: status === "approved" })
    .where(eq(guestbookEntries.id, id));

  revalidatePath("/admin/livre-or");
  revalidatePath("/livre-d-or");
}

export async function deleteGuestbookEntry(idRaw: string): Promise<void> {
  await requireAdmin();
  const id = Number(idRaw);
  await db.delete(guestbookEntries).where(eq(guestbookEntries.id, id));

  revalidatePath("/admin/livre-or");
  revalidatePath("/livre-d-or");
}
