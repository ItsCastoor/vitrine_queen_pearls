import type { FormSection, Question, MemberAnswers } from "@/lib/recruitment/member-form";
import { validateAnswers } from "@/lib/recruitment/member-form";

export const PARTNERSHIP_FORM_INTRO = {
  title: "Formulaire de partenariat — Queen Pearls",
  description:
    "Les Queen Pearls ouvrent leurs portes aux clubs souhaitant partager un moment unique à leurs côtés. Chaque proposition est étudiée avec attention afin de créer une activité adaptée à nos deux univers. 🤍",
};

export const PARTNERSHIP_FORM: FormSection[] = [
  {
    id: "club",
    title: "🌸 Informations sur votre club",
    questions: [
      {
        id: "club_nom",
        label: "Nom de votre club",
        type: "short",
        required: true,
      },
      {
        id: "serveur",
        label: "Serveur sur lequel votre club évolue",
        type: "short",
        required: true,
      },
      {
        id: "responsable",
        label: "Nom du responsable à contacter",
        type: "short",
        required: true,
      },
      {
        id: "moyen_contact",
        label: "Moyen de contact",
        type: "checkbox",
        required: true,
        options: ["Discord", "Instagram", "Autre"],
      },
      {
        id: "lien_reseaux",
        label: "Lien vers votre présentation ou vos réseaux",
        type: "short",
      },
    ],
  },
  {
    id: "presentation",
    title: "🐴 Présentation de votre club",
    questions: [
      {
        id: "club_logo",
        label: "Logo de votre club",
        help: "Format JPG, PNG ou WebP — 10 Mo maximum.",
        type: "file",
        required: true,
      },
      {
        id: "anciennete",
        label: "Depuis combien de temps votre club existe-t-il ?",
        type: "short",
        required: true,
      },
      {
        id: "nb_membres",
        label: "Combien de membres compte votre club actuellement ?",
        type: "short",
        required: true,
      },
      {
        id: "ambiance",
        label: "Comment décririez-vous l'ambiance de votre club ?",
        type: "checkbox",
        required: true,
        options: [
          "Compétitive",
          "Familiale",
          "Élégante / sérieuse",
          "Détente et loisirs",
          "Autre",
        ],
      },
      {
        id: "activites_principales",
        label: "Quelles sont vos activités principales ?",
        help: "Dressage, saut, balades, événements, créations, concours…",
        type: "para",
        required: true,
      },
    ],
  },
  {
    id: "projet",
    title: "✨ Votre projet de collaboration",
    questions: [
      {
        id: "type_partenariat",
        label:
          "Quel type de partenariat souhaitez-vous réaliser avec les Queen Pearls ?",
        type: "checkbox",
        required: true,
        options: [
          "Participer à une activité déjà prévue dans notre planning",
          "Organiser une activité spéciale ensemble",
          "Faire découvrir votre discipline aux membres des Queen Pearls",
          "Créer un événement exceptionnel entre nos deux clubs",
          "Réaliser un shooting photo commun",
          "Organiser une rencontre conviviale entre membres",
          "Autre",
        ],
      },
    ],
  },
  {
    id: "activite",
    title: "📅 Choix de l'activité",
    questions: [
      {
        id: "activite_choisie",
        label:
          "Quelle(s) activité(s) aimeriez-vous partager avec les Queen Pearls ?",
        help: "Cochez les activités qui vous intéressent.",
        type: "checkbox",
        required: true,
        options: [
          "🤍 Lundi — Dressage (précision, harmonie, travail d'équipe)",
          "🤍 Mardi — Saut d'obstacles (dépassement de soi, confiance)",
          "🤍 Mercredi — Balade (sortie conviviale et détente)",
          "🤍 Jeudi — Dressage (élégance et maîtrise équestre)",
          "🤍 Vendredi — Western (découverte d'une autre discipline)",
          "🤍 Samedi — Jeux & Shooting photo (moment créatif entre clubs)",
        ],
      },
      {
        id: "idee_activite",
        label: "Avez-vous une idée particulière concernant l'activité choisie ?",
        type: "para",
        required: true,
      },
    ],
  },
  {
    id: "organisation",
    title: "🎀 Organisation de la collaboration",
    questions: [
      {
        id: "nb_participants",
        label: "Combien de participants souhaitez-vous inviter ?",
        type: "radio",
        required: true,
        options: ["1 à 5 membres", "5 à 10 membres", "Plus de 10 membres"],
      },
      {
        id: "duree",
        label: "Quelle durée souhaiteriez-vous pour cette activité ?",
        type: "radio",
        required: true,
        options: ["30 minutes", "1 heure", "1h30", "Plus"],
      },
      {
        id: "participation_orga",
        label: "Souhaitez-vous participer à l'organisation ?",
        type: "radio",
        required: true,
        options: [
          "Oui, nous avons déjà une idée précise",
          "Oui, nous aimerions construire le projet ensemble",
          "Nous préférons vous laisser proposer une organisation",
        ],
      },
    ],
  },
  {
    id: "vision",
    title: "💎 Votre vision",
    questions: [
      {
        id: "apport",
        label: "Qu'aimeriez-vous apporter à cette collaboration ?",
        type: "para",
        required: true,
      },
      {
        id: "attentes",
        label: "Qu'attendez-vous des Queen Pearls lors de cette rencontre ?",
        type: "para",
        required: true,
      },
      {
        id: "theme_idee",
        label:
          "Avez-vous un thème, une idée ou une envie particulière pour cette collaboration ?",
        type: "para",
        required: true,
      },
    ],
  },
  {
    id: "derniere",
    title: "🤍 Une dernière question…",
    questions: [
      {
        id: "pourquoi",
        label:
          "Pourquoi souhaitez-vous réaliser un partenariat avec les Queen Pearls ?",
        type: "para",
        required: true,
      },
    ],
  },
];

export const PARTNERSHIP_QUESTIONS: Question[] = PARTNERSHIP_FORM.flatMap(
  (s) => s.questions,
);

export function validatePartnershipAnswers(
  answers: MemberAnswers,
): string | null {
  return validateAnswers(PARTNERSHIP_QUESTIONS, answers);
}
