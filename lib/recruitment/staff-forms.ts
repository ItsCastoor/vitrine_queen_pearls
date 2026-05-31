import type { FormSection } from "./member-form";
import { slugify } from "@/lib/slug";

export interface StaffForm {
  id: string;
  discipline: string;
  image: string;
  title: string;
  intro: string;
  successMessage: string;
  sections: FormSection[];
}

interface DisciplineConfig {
  discipline: string;
  practice: string;
  dejaCreeLabel: string;
  capaciteVerbe: string;
  presenceLabel: string;
  differenceLabel: string;
}

const SUCCESS_MESSAGE =
  "Merci d'avoir pris le temps de répondre à ce formulaire. Chaque candidature sera étudiée avec attention afin de trouver une instructrice capable de représenter pleinement les valeurs des Queen Pearls. 🤍";

function makeStaffForm(cfg: DisciplineConfig): StaffForm {
  const ouiNon = ["oui", "Non"];

  const sections: FormSection[] = [
    {
      id: "infos",
      title: "✧ Section 1 • Informations générales",
      questions: [
        { id: "pseudo_sso", label: "Pseudo Star Stable", type: "short", required: true },
        { id: "discord", label: "Nom Discord", type: "short", required: true },
        { id: "age", label: "Âge", type: "short", required: true },
        {
          id: "anciennete_sso",
          label: "Depuis combien de temps joues-tu à Star Stable ?",
          type: "short",
          required: true,
        },
        {
          id: "role_important",
          label: "As-tu déjà eu un rôle important dans un club ?",
          type: "radio",
          required: true,
          options: ouiNon,
        },
        {
          id: "role_lequel",
          label: "Si oui, lequel ?",
          type: "radio",
          requiredIf:{field:"role_important", value:"oui"},
          options: ["Instructrice", "Propriétaire", "Responsable", "Modératrice", "Autre", "Aucun"],
        },
        {
          id: "experience",
          label: "Explique brièvement ton expérience :",
          type: "para",
          required: true,
        },
      ],
    },
    {
      id: "niveau",
      title: `✧ Section 2 • Niveau & expérience en ${cfg.discipline.toUpperCase()}`,
      questions: [
        {
          id: "anciennete_discipline",
          label: `Depuis combien de temps pratiques-tu ${cfg.practice} sur SSO ?`,
          type: "short",
          required: true,
        },
        {
          id: "niveau_desc",
          label: `Comment décrirais-tu ton niveau en ${cfg.discipline} ?`,
          type: "para",
          required: true,
        },
        {
          id: "deja_cree",
          label: cfg.dejaCreeLabel,
          type: "radio",
          required: true,
          options: ouiNon,
        },
        {
          id: "capacites",
          label: `Es-tu capable :\n\nD'expliquer des ${cfg.capaciteVerbe} clairement\nDe corriger des erreurs avec calme\nD'adapter un cours selon le niveau des cavalières\nDe gérer un groupe pendant une activité\nDe créer des entraînements variés`,
          type: "radio",
          required: true,
          options: ouiNon,
        },
        {
          id: "qualites",
          label: "Selon toi, quelles qualités sont indispensables pour une bonne instructrice ?",
          type: "para",
          required: true,
        },
        {
          id: "reaction_membre",
          label: "Comment réagirais-tu face à une membre ayant du mal à suivre un cours ?",
          type: "para",
          required: true,
        },
      ],
    },
    {
      id: "implication",
      title: "✧ Section 3 • Implication & disponibilités",
      questions: [
        {
          id: "presence",
          label: cfg.presenceLabel,
          type: "radio",
          required: true,
          options: ["oui", "Non", "ça dépend des périodes"],
        },
        {
          id: "prepa_seances",
          label: "Es-tu capable de préparer des séances à l'avance ?",
          type: "radio",
          required: true,
          options: ouiNon,
        },
        {
          id: "discord_actif",
          label: "Le Discord est obligatoire pour l'organisation du club. Es-tu prête à y être active ?",
          type: "radio",
          required: true,
          options: ouiNon,
        },
        {
          id: "absence",
          label: "En cas d'absence, peux-tu prévenir à l'avance et organiser ton remplacement si nécessaire ?",
          type: "radio",
          required: true,
          options: ouiNon,
        },
      ],
    },
    {
      id: "mentalite",
      title: "✧ Section 4 • Mentalité & comportement",
      questions: [
        {
          id: "conflits",
          label: "Comment gères-tu les conflits ou tensions dans un groupe ?",
          type: "para",
          required: true,
        },
        {
          id: "communication",
          label: "Comment décrirais-tu ta façon de communiquer avec les autres ?",
          type: "para",
          required: true,
        },
        {
          id: "elegance",
          label: "Que représente pour toi l'élégance et la discipline dans un club ?",
          type: "para",
          required: true,
        },
        {
          id: "attitude_mature",
          label:
            "Une instructrice représente l'image du club. Penses-tu être capable de garder une attitude mature et respectueuse même en désaccord ?",
          type: "radio",
          required: true,
          options: ouiNon,
        },
      ],
    },
    {
      id: "motivation",
      title: "✧ Section 5 • Motivation",
      questions: [
        {
          id: "pourquoi_instructrice",
          label: "Pourquoi souhaites-tu devenir instructrice chez les Queen Pearls ?",
          type: "para",
          required: true,
        },
        {
          id: "pourquoi_club",
          label: "Pourquoi avoir choisi notre club plutôt qu'un autre ?",
          type: "para",
          required: true,
        },
        {
          id: "apport",
          label: "Qu'aimerais-tu apporter aux Queen Pearls ?",
          type: "para",
          required: true,
        },
        {
          id: "difference",
          label: cfg.differenceLabel,
          type: "para",
          required: true,
        },
      ],
    },
    {
      id: "finale",
      title: "✧ Question finale",
      questions: [
        {
          id: "conscience_role",
          label:
            "Es-tu consciente que ce rôle demande du temps, de l'investissement, de la patience et de la régularité ?",
          type: "radio",
          required: true,
          options: ["oui, totalement", "je pense que oui", "non"],
        },
      ],
    },
  ];

  const slug = slugify(cfg.discipline);

  return {
    id: `staff_${slug}`,
    discipline: cfg.discipline,
    image: `/${slug}.png`,
    title: `Recrutement instructrice de ${cfg.discipline}`,
    intro:
      "Les Queen Pearls recherchent une instructrice sérieuse, investie et passionnée. Merci de répondre avec honnêteté, sérieux et précision — toute candidature incomplète ou peu investie pourra être refusée automatiquement.",
    successMessage: SUCCESS_MESSAGE,
    sections,
  };
}

export const STAFF_FORMS: StaffForm[] = [
  makeStaffForm({
    discipline: "Dressage",
    practice: "le dressage",
    dejaCreeLabel: "As-tu déjà créé tes propres reprises ou chorégraphies ?",
    capaciteVerbe: "mouvements",
    presenceLabel:
      "Peux-tu être présente régulièrement pour assurer les séances de dressage ?",
    differenceLabel:
      "Selon toi, qu'est-ce qui différencie une simple bonne dresseuse d'une véritable instructrice ?",
  }),
  makeStaffForm({
    discipline: "Saut",
    practice: "le saut",
    dejaCreeLabel: "As-tu déjà organisé ou créé des entraînements/parcours de saut ?",
    capaciteVerbe: "trajectoires",
    presenceLabel:
      "Peux-tu être présente régulièrement pour assurer les séances de saut ?",
    differenceLabel:
      "Selon toi, qu'est-ce qui différencie une simple bonne cavalière d'une véritable instructrice ?",
  }),
  makeStaffForm({
    discipline: "Western",
    practice: "le Western",
    dejaCreeLabel: "As-tu déjà organisé ou créé des entraînements/activités de Western ?",
    capaciteVerbe: "trajectoires",
    presenceLabel:
      "Peux-tu être présente régulièrement pour assurer les séances de Western ?",
    differenceLabel:
      "Selon toi, qu'est-ce qui différencie une simple bonne joueuse d'une véritable instructrice ?",
  }),
];

export const STAFF_FORMS_BY_ID: Record<string, StaffForm> = Object.fromEntries(
  STAFF_FORMS.map((f) => [f.id, f]),
);
