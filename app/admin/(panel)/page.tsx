import Link from "next/link";
import { countRows } from "@/lib/admin/queries";
import { RESOURCE_NAV } from "@/lib/admin/registry";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const highlights = [
    "posts",
    "evenements",
    "staff",
    "galerie-items",
    "livre-or",
    "recrutement",
  ];

  const counts = await Promise.all(
    highlights.map(async (key) => ({
      key,
      label: RESOURCE_NAV.find((r) => r.key === key)?.label ?? key,
      count: await countRows(key),
    })),
  );

  return (
    <div>
      <p className="qp-overline mb-2">Espace privé</p>
      <h1 className="qp-title text-4xl text-ink">Tableau de bord</h1>
      <p className="mt-2 font-serif text-lg text-greypearl">
        Gérez l&apos;ensemble du contenu de la maison Queen Pearls.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map((c) => (
          <Link key={c.key} href={`/admin/${c.key}`} className="qp-card p-6">
            <p className="qp-overline">{c.label}</p>
            <p className="qp-title mt-2 text-5xl text-or-deep">{c.count}</p>
            <p className="mt-2 text-sm text-greypearl">Gérer →</p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="qp-title text-2xl text-ink">Accès rapides</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {RESOURCE_NAV.map((r) => (
            <Link key={r.key} href={`/admin/${r.key}`} className="qp-btn !py-2 !text-xs">
              {r.label}
            </Link>
          ))}
          <Link href="/admin/parametres" className="qp-btn !py-2 !text-xs">
            Paramètres
          </Link>
        </div>
      </div>
    </div>
  );
}
