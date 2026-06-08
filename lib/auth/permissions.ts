import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";

/**
 * Tous les modules accessibles dans l'admin.
 * Chaque clé doit correspondre à une entrée dans role_permissions.module_key.
 */
export const ALL_MODULES = [
  { key: "posts",              label: "Journal" },
  { key: "evenements",         label: "Événements" },
  { key: "staff",              label: "Équipe" },
  { key: "galerie-categories", label: "Galerie · Catégories" },
  { key: "galerie-items",      label: "Galerie · Médias" },
  { key: "tenues",             label: "Tenues" },
  { key: "partenaires",        label: "Partenaires" },
  { key: "faq",                label: "FAQ" },
  { key: "hall-of-fame",       label: "Hall of Fame" },
  { key: "livre-or",           label: "Livre d'Or" },
  { key: "recrutement",        label: "Candidatures" },
  { key: "parametres",         label: "Paramètres" },
  { key: "membres",            label: "Membres admin" },
  { key: "roles",              label: "Rôles & permissions" },
] as const;

export type ModuleKey = (typeof ALL_MODULES)[number]["key"];

/**
 * Retourne true si la session courante a accès au module donné.
 * On lit les permissions stockées dans la session (tableau de clés).
 */
export async function hasPermission(moduleKey: ModuleKey): Promise<boolean> {
  const session = await getSession();
  if (!session.adminId) return false;
  return session.permissions?.includes(moduleKey) ?? false;
}

/**
 * Redirige vers /admin si l'admin connecté n'a pas accès au module.
 * À appeler en tête des layouts et pages sensibles.
 */
export async function requirePermission(moduleKey: ModuleKey): Promise<void> {
  const ok = await hasPermission(moduleKey);
  if (!ok) redirect("/admin");
}
