import Link from "next/link";
import { countRows } from "@/lib/admin/queries";
import { RESOURCE_NAV } from "@/lib/admin/registry";
import { requireAdmin } from "@/lib/auth/session";
import type { ModuleKey } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  const permissions = session.permissions ?? [];

  const allHighlights: ModuleKey[] = [
    "posts", "evenements", "staff", "galerie-items", "livre-or", "recrutement",
  ];
  const highlights = allHighlights.filter((k) => permissions.includes(k));

  const counts = await Promise.all(
    highlights.map(async (key) => ({
      key,
      label: RESOURCE_NAV.find((r) => r.key === key)?.label ?? key,
      count: await countRows(key),
    })),
  );

  const accessibleNav = RESOURCE_NAV.filter((r) =>
    permissions.includes(r.key as ModuleKey),
  );

  const specialLinks = [
    { key: "parametres" as ModuleKey, label: "Paramètres", href: "/admin/parametres", always: true },
    { key: "membres" as ModuleKey,    label: "Membres admin", href: "/admin/membres" },
    { key: "roles" as ModuleKey,      label: "Rôles & permissions", href: "/admin/roles" },
  ].filter((l) => l.always || permissions.includes(l.key));

  return (
    <div>
      <p className="qp-overline mb-2">Espace privé</p>
      <h1 className="qp-title text-4xl text-ink">Tableau de bord</h1>
      <p className="mt-2 font-serif text-lg text-greypearl">
        Gérez l&apos;ensemble du contenu de la maison Queen Pearls.
      </p>

      {counts.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {counts.map((c) => (
            <Link key={c.key} href={`/admin/${c.key}`} className="qp-card p-6">
              <p className="qp-overline">{c.label}</p>
              <p className="qp-title mt-2 text-5xl text-or-deep">{c.count}</p>
              <p className="mt-2 text-sm text-greypearl">Gérer →</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="qp-card mt-10 p-10 text-center font-serif text-greypearl">
          Aucun module accessible. Contactez un administrateur pour obtenir des droits d&apos;accès.
        </div>
      )}

      {(accessibleNav.length > 0 || specialLinks.length > 0) && (
        <div className="mt-12">
          <h2 className="qp-title text-2xl text-ink">Accès rapides</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {accessibleNav.map((r) => (
              <Link key={r.key} href={`/admin/${r.key}`} className="qp-btn !py-2 !text-xs">
                {r.label}
              </Link>
            ))}
            {specialLinks.map((l) => (
              <Link key={l.key} href={l.href} className="qp-btn !py-2 !text-xs">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
