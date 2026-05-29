"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { RESOURCE_NAV } from "@/lib/admin/registry";

export function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const linkClass = (href: string) =>
    `block rounded-lg px-4 py-2 text-sm transition-colors ${
      pathname === href
        ? "bg-or/20 text-or-deep"
        : "text-ink/70 hover:bg-rose/40 hover:text-ink"
    }`;

  return (
    <aside className="w-full shrink-0 border-r border-or/20 bg-nacre lg:w-64">
      <div className="flex items-center justify-between px-6 py-5">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="qp-pearl" />
          <span className="qp-title text-xl text-ink">Pearls Admin</span>
        </Link>
        <button
          className="qp-navlink lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

      <nav className={`${open ? "block" : "hidden"} px-3 pb-6 lg:block`}>
        <Link href="/admin" className={linkClass("/admin")}>
          Tableau de bord
        </Link>

        <p className="qp-overline mt-5 mb-2 px-4">Contenu</p>
        {RESOURCE_NAV.map((r) => (
          <Link key={r.key} href={`/admin/${r.key}`} className={linkClass(`/admin/${r.key}`)}>
            {r.label}
          </Link>
        ))}

        <p className="qp-overline mt-5 mb-2 px-4">Réglages</p>
        <Link href="/admin/parametres" className={linkClass("/admin/parametres")}>
          Paramètres
        </Link>
        <Link href="/" className="block rounded-lg px-4 py-2 text-sm text-ink/70 hover:bg-rose/40">
          Voir le site ↗
        </Link>

        <div className="mt-6 border-t border-or/20 px-4 pt-4">
          <p className="text-xs text-greypearl">Connecté : {username}</p>
          <button onClick={logout} className="qp-btn mt-3 w-full !py-2 !text-xs">
            Se déconnecter
          </button>
        </div>
      </nav>
    </aside>
  );
}
