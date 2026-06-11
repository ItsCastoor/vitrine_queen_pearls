"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import {
  recruitmentApplications,
  guestbookEntries,
  partnershipApplications,
} from "@/lib/db/schema";
import { notifyDiscord } from "@/lib/discord";
import { saveUpload } from "@/lib/uploads";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
import {
  validateMemberAnswers,
  validateAnswers,
  type MemberAnswers,
} from "@/lib/recruitment/member-form";
import { STAFF_FORMS_BY_ID } from "@/lib/recruitment/staff-forms";
import { validatePartnershipAnswers } from "@/lib/partnership/partnership-form";

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
    void notifyDiscord(process.env.DISCORD_WEBHOOK_RECRUTEMENT, {
      title: "🌸 Nouvelle candidature · Membre",
      color: 0xc9a66b,
      url: `${SITE_URL}/admin/recrutement`,
      fields: [
        { name: "Pseudo SSO", value: pseudo, inline: true },
        { name: "Discord", value: str(answers.discord_pseudo) || "—", inline: true },
        { name: "Type", value: "Membre", inline: true },
      ],
      footer: { text: "Queen Pearls — Candidatures" },
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
    void notifyDiscord(process.env.DISCORD_WEBHOOK_RECRUTEMENT, {
      title: "⭐ Nouvelle candidature · Staff",
      color: 0xc9a66b,
      url: `${SITE_URL}/admin/recrutement`,
      fields: [
        { name: "Pseudo SSO", value: pseudo, inline: true },
        { name: "Discord", value: str(answers.discord) || "—", inline: true },
        { name: "Type", value: "Staff", inline: true },
        { name: "Formulaire", value: form.id, inline: true },
      ],
      footer: { text: "Queen Pearls — Candidatures" },
    });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Impossible d'envoyer la candidature pour le moment.",
    };
  }
}

export async function submitPartnership(
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

  const validationError = validatePartnershipAnswers(answers);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const str = (v: unknown) =>
    typeof v === "string" ? v.trim() : Array.isArray(v) ? v.join(", ") : "";

  const clubName = str(answers.club_nom).slice(0, 191) || "Club";

  // Gestion de l'upload du logo
  let logoUrl: string | null = null;
  const logoFile = formData.get("club_logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    try {
      const saved = await saveUpload(logoFile, "partners");
      logoUrl = saved.url;
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Erreur lors de l'upload du logo.",
      };
    }
  } else {
    return { ok: false, error: "Le logo de votre club est obligatoire." };
  }

  try {
    await db.insert(partnershipApplications).values({
      clubName,
      server: str(answers.serveur).slice(0, 191) || null,
      contactName: str(answers.responsable).slice(0, 191) || null,
      contact: str(answers.moyen_contact).slice(0, 255) || null,
      links: str(answers.lien_reseaux).slice(0, 512) || null,
      message: str(answers.pourquoi) || null,
      answers: JSON.stringify(answers),
      logoUrl,
    });
    void notifyDiscord(
      process.env.DISCORD_WEBHOOK_PARTENARIAT ?? process.env.DISCORD_WEBHOOK_RECRUTEMENT,
      {
        title: "🤝 Nouvelle demande de partenariat",
        color: 0xc9a66b,
        url: `${SITE_URL}/admin/partenaires`,
        fields: [
          { name: "Club", value: clubName, inline: true },
          { name: "Serveur", value: str(answers.serveur) || "—", inline: true },
          { name: "Contact", value: str(answers.responsable) || "—", inline: true },
        ],
        footer: { text: "Queen Pearls — Partenariats" },
      },
    );
    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible d'envoyer la demande pour le moment." };
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
    const excerpt =
      parsed.data.message.length > 150
        ? parsed.data.message.slice(0, 150) + "…"
        : parsed.data.message;
    void notifyDiscord(process.env.DISCORD_WEBHOOK_LIVRE_OR, {
      title: "📖 Nouveau message — Livre d'or",
      color: 0xe8b4bc,
      url: `${SITE_URL}/admin/livre-or`,
      fields: [
        { name: "Auteur", value: parsed.data.author, inline: true },
        { name: "Message", value: excerpt },
      ],
      footer: { text: "Queen Pearls — Livre d'or · En attente de validation" },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible d'envoyer le message pour le moment." };
  }
}
