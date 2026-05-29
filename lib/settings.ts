import "server-only";
import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";

/** Clés de texte éditables depuis /admin/parametres, avec leur valeur par défaut. */
export const SETTINGS_DEFAULTS: Record<string, string> = {
  "home.hero_title": "Queen Pearls",
  "home.hero_tagline":
    "Plus qu'un club, une maison où l'élégance rencontre la passion.",
  "home.hero_cta": "Rejoindre les Queen Pearls",
  "home.intro":
    "Bienvenue dans l'univers nacré des Queen Pearls — une maison où chaque membre cultive le raffinement, la passion du dressage et l'art de briller ensemble.",
  "club.histoire":
    "Née d'un rêve partagé, la maison Queen Pearls réunit des âmes passionnées autour d'une même quête : l'élégance dans chaque geste.",
  "club.valeurs":
    "Bienveillance, exigence, raffinement et sororité. Voilà les perles qui composent notre collier.",
  "club.style":
    "Un style affirmé, entre académie prestigieuse et maison de couture, où l'esthétique se mêle à la discipline.",
  "club.organisation":
    "Une fondatrice, des instructrices dévouées, des responsables de projets et une communauté soudée.",
  "club.objectifs":
    "Faire grandir chaque membre, organiser des événements mémorables et rayonner par notre élégance.",
  "club.vision":
    "Nous voyons le dressage comme un art : la rencontre entre la grâce du cheval et la passion de sa cavalière.",
  "lore.intro":
    "Les perles naissent dans le secret des profondeurs, façonnées par le temps et la patience. Ainsi sont nos membres.",
  "lore.symbolique":
    "Chaque perle représente une membre : unique, précieuse, irremplaçable. Ensemble, elles forment un collier d'exception.",
  "lore.univers":
    "Un monde nacré baigné de lumière dorée, où la romance et la noblesse se rencontrent.",
  "recrutement.intro":
    "Vous rêvez de rejoindre une maison où l'élégance est un art de vivre ? Les portes des Queen Pearls vous sont peut-être ouvertes.",
  "recrutement.criteres":
    "Esprit bienveillant · Goût du raffinement · Présence régulière sur Discord · Passion sincère.",
};

export async function getAllSettings(): Promise<Record<string, string>> {
  const result = { ...SETTINGS_DEFAULTS };
  try {
    const rows = await db.select().from(siteSettings);
    for (const row of rows) {
      if (row.value != null) result[row.key] = row.value;
    }
  } catch {
    // BDD indisponible : on retourne les valeurs par défaut.
  }
  return result;
}

export function getSetting(
  settings: Record<string, string>,
  key: string,
): string {
  return settings[key] ?? SETTINGS_DEFAULTS[key] ?? "";
}
