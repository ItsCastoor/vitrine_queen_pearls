"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { recruitmentApplications, guestbookEntries } from "@/lib/db/schema";

const recruitmentSchema = z.object({
  pseudo: z.string().trim().min(2, "Pseudo trop court.").max(120),
  discord: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const guestbookSchema = z.object({
  author: z.string().trim().min(2, "Nom trop court.").max(120),
  message: z.string().trim().min(3, "Message trop court.").max(1000),
});

export type ActionState = { ok: boolean; error?: string };

export async function submitRecruitment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = recruitmentSchema.safeParse({
    pseudo: formData.get("pseudo"),
    discord: formData.get("discord"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  try {
    await db.insert(recruitmentApplications).values({
      pseudo: parsed.data.pseudo,
      discord: parsed.data.discord || null,
      message: parsed.data.message || null,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible d'envoyer la candidature pour le moment." };
  }
}

export async function submitGuestbook(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = guestbookSchema.safeParse({
    author: formData.get("author"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  try {
    await db.insert(guestbookEntries).values({
      author: parsed.data.author,
      message: parsed.data.message,
      isPublished: false,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible d'envoyer le message pour le moment." };
  }
}
