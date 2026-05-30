export type QuestionType = "short" | "para" | "radio" | "checkbox";

export interface Question {
  id: string;
  label: string;
  help?: string;
  type: QuestionType;
  required?: boolean;
  /** Rend la question obligatoire seulement si une autre question a une valeur spécifique. */
  requiredIf?: { field: string; value: string | string[] };
  options?: string[];
  /** Pour les cases à cocher : impose que toutes les options soient cochées. */
  requireAll?: boolean;
}

export interface FormSection {
  id: string;
  title: string;
  questions: Question[];
}

export const MEMBER_FORM_INTRO = {
  title: "Formulaire des Queen Pearls",
  description:
    "Merci de répondre avec sérieux, honnêteté et précision. La sélection est renforcée : les réponses vagues, incohérentes ou incomplètes entraînent un refus automatique. 🤍",
};

export const MEMBER_FORM: FormSection[] = [
  {
    id: "identite",
    title: "🔐 Identité & transparence",
    questions: [
      {
        id: "sso_pseudo",
        label: "Ton pseudo sur Star Stable Online",
        type: "short",
        required: true,
      },
      {
        id: "discord_pseudo",
        label: "Ton pseudo Discord",
        type: "short",
        required: true,
      },
      {
        id: "age",
        label: "Merci d'indiquer ton âge.",
        type: "short",
        required: true,
      },
      {
        id: "motivation",
        label: "Pourquoi souhaites-tu rejoindre les Queen Pearls ?",
        help: "Explique ta motivation, ce que tu recherches et ce qui t'a attirée dans notre club.",
        type: "para",
        required: true,
      },
    ],
  },
  {
    id: "chevaux",
    title: "🐴 Chevaux & tenues obligatoires",
    questions: [
      {
        id: "connait_chevaux",
        label: "As-tu pris connaissance des 3 chevaux obligatoires du club ?",
        type: "radio",
        required: true,
        options: ["Oui", "Non"],
      },
      {
        id: "chevaux_possedes",
        label: "Lesquels possèdes-tu déjà ?",
        type: "checkbox",
        required: true,
        options: [
          "Frison blanc (dressage)",
          "Belge sang chaud blanc (saut)",
          "Paint Horse Américain (Western)",
          "Aucun",
        ],
      },
      {
        id: "capacite_achat",
        label:
          "Es-tu en capacité d'acheter en priorité le cheval de dressage + sa tenue dans un délai raisonnable après ton entrée ?",
        type: "radio",
        required: true,
        options: ["Oui", "Non"],
      },
      {
        id: "delai_achat",
        label:
          "➡️ Si non, explique pourquoi et dans quels délais tu pourrais le faire.",
        type: "para",
        requiredIf: { field: "capacite_achat", value: "Non" },
      },
      {
        id: "respect_chevaux",
        label:
          "Es-tu prête à respecter strictement les chevaux et tenues imposés, sans exception ?",
        type: "radio",
        required: true,
        options: ["Oui", "Non"],
      },
    ],
  },
  {
    id: "activite",
    title: "🕰️ Activité & disponibilité",
    questions: [
      {
        id: "frequence",
        label: "À quelle fréquence joues-tu à Star Stable Online ?",
        type: "radio",
        required: true,
        options: [
          "Tous les jours",
          "Presque tous les jours",
          "Une fois par semaine",
        ],
      },
      {
        id: "dispo_soir",
        label: "Es-tu disponible régulièrement le soir, notamment à 21h ?",
        type: "radio",
        required: true,
        options: ["Oui", "Non"],
      },
      {
        id: "gestion_absence",
        label: "Comment réagis-tu si tu sais que tu seras absente ?",
        help: "Explique comment tu préviens et comment tu t'organises.",
        type: "para",
        required: true,
      },
    ],
  },
  {
    id: "regles",
    title: "📌 Règles & comportement",
    questions: [
      {
        id: "compris_avertissements",
        label:
          "As-tu bien compris le système d'avertissements ? (Absence non prévenue = 1 avertissement / 3 = exclusion)",
        type: "radio",
        required: true,
        options: ["Oui", "Non"],
      },
      {
        id: "compris_exposition",
        label:
          "As-tu bien compris que ce club est très exposé sur les réseaux, la dirigeante étant une streameuse engagée à publier régulièrement du contenu ?",
        type: "radio",
        required: true,
        options: ["Oui", "Non"],
      },
      {
        id: "participation",
        label: "Comment participes-tu à la vie d'un club ?",
        help: "Présence, entraide, discussions, événements…",
        type: "para",
        required: true,
      },
    ],
  },
  {
    id: "connaitre",
    title: "🤍 Pour mieux te connaître",
    questions: [
      {
        id: "description",
        label: "Décris-toi en quelques mots :",
        help: "Personnalité, caractère, façon de jouer…",
        type: "para",
        required: true,
      },
      {
        id: "attentes_long_terme",
        label: "Qu'attends-tu d'un club sur le long terme ?",
        type: "para",
        required: true,
      },
      {
        id: "raisons_depart",
        label: "Qu'est-ce qui pourrait te pousser à quitter un club ?",
        help: "Question importante pour évaluer la stabilité.",
        type: "para",
        required: true,
      },
    ],
  },
  {
    id: "engagement",
    title: "✨ Engagement final",
    questions: [
      {
        id: "confirmations",
        label: "En validant ce formulaire, confirmes-tu :",
        type: "checkbox",
        required: true,
        requireAll: true,
        options: [
          "Avoir lu et compris l'intégralité de la description du club",
          "Être prête à m'investir sérieusement chez les Queen Pearls",
        ],
      },
      {
        id: "dernier_mot",
        label: "Un dernier mot pour la dirigeante ou le staff ? 🤍",
        type: "para",
        required: true,
      },
    ],
  },
];

export const MEMBER_QUESTIONS: Question[] = MEMBER_FORM.flatMap(
  (s) => s.questions,
);

export type MemberAnswers = Record<string, string | string[]>;

/** Valide les réponses côté serveur. Retourne le 1er message d'erreur ou null. */
export function validateMemberAnswers(answers: MemberAnswers): string | null {
  for (const q of MEMBER_QUESTIONS) {
    const value = answers[q.id];
    
    let isRequired = q.required ?? false;
    
    // Si la question a une condition requiredIf, vérifier si elle est activée
    if (!isRequired && q.requiredIf) {
      const condValue = answers[q.requiredIf.field];
      const expectedValue = q.requiredIf.value;
      
      if (Array.isArray(expectedValue)) {
        // Si expectedValue est un tableau, vérifier si condValue contient l'une des valeurs
        isRequired = Array.isArray(condValue)
          ? expectedValue.some((v) => condValue.includes(v))
          : expectedValue.includes(String(condValue));
      } else {
        // Comparaison simple
        isRequired = condValue === expectedValue;
      }
    }
    
    if (!isRequired) continue;

    if (q.type === "checkbox") {
      const arr = Array.isArray(value) ? value : [];
      if (q.requireAll) {
        if (arr.length < (q.options?.length ?? 0)) {
          return `Merci de cocher toutes les cases : « ${q.label} »`;
        }
      } else if (arr.length === 0) {
        return `Merci de répondre à : « ${q.label} »`;
      }
    } else {
      if (typeof value !== "string" || value.trim().length === 0) {
        return `Merci de répondre à : « ${q.label} »`;
      }
    }
  }
  return null;
}
