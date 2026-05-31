"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { recruitmentApplications, guestbookEntries } from "@/lib/db/schema";
import {
  validateMemberAnswers,
  validateAnswers,
  type MemberAnswers,
} from "@/lib/recruitment/member-form";
import { STAFF_FORMS_BY_ID } from "@/lib/recruitment/staff-forms";

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

export async function submitMemberRecruitment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let answers: MemberAnswers;
  try {
    const raw = formData.get("payload");
    answers = JSON.parse(typeof raw === "string" ? raw : "{}");
  } catch {
    return { ok: false, error: "Données du formulaire illisibles." };
  }

  const validationError = validateMemberAnswers(answers);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const str = (v: unknown) =>
    typeof v === "string" ? v.trim() : Array.isArray(v) ? v.join(", ") : "";

  const pseudo = str(answers.sso_pseudo).slice(0, 191) || "Candidate";

  try {
    await db.insert(recruitmentApplications).values({
      pseudo,
      discord: str(answers.discord_pseudo).slice(0, 191) || null,
      age: str(answers.age).slice(0, 32) || null,
      type: "member",
      message: str(answers.motivation) || null,
      answers: JSON.stringify(answers),
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible d'envoyer la candidature pour le moment." };
  }
}

export async function submitStaffRecruitment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const formId = formData.get("formId");
  const form =
    typeof formId === "string" ? STAFF_FORMS_BY_ID[formId] : undefined;
  if (!form) {
    return { ok: false, error: "Formulaire inconnu." };
  }

  let answers: MemberAnswers;
  try {
    const raw = formData.get("payload");
    answers = JSON.parse(typeof raw === "string" ? raw : "{}");
  } catch {
    return { ok: false, error: "Données du formulaire illisibles." };
  }

  const questions = form.sections.flatMap((s) => s.questions);
  const validationError = validateAnswers(questions, answers);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const str = (v: unknown) =>
    typeof v === "string" ? v.trim() : Array.isArray(v) ? v.join(", ") : "";

  const pseudo = str(answers.pseudo_sso).slice(0, 191) || "Candidate";

  try {
    await db.insert(recruitmentApplications).values({
      pseudo,
      discord: str(answers.discord).slice(0, 191) || null,
      age: str(answers.age).slice(0, 32) || null,
      type: "staff",
      message: str(answers.pourquoi_instructrice) || null,
      answers: JSON.stringify({ __formId: form.id, ...answers }),
    });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Impossible d'envoyer la candidature pour le moment.",
    };
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
