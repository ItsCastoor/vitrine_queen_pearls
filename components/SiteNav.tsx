"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/club", label: "Le Club" },
  { href: "/equipe", label: "Équipe" },
  { href: "/galerie", label: "Galerie" },
  { href: "/evenements", label: "Événements" },
  { href: "/tenues", label: "Tenues" },
  { href: "/lore", label: "Lore" },
  { href: "/journal", label: "Journal" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/faq", label: "FAQ" },
  { href: "/livre-d-or", label: "Livre d'Or" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
];

const half = Math.ceil(links.length / 2);
const linkRows = [links.slice(0, half), links.slice(half)];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-or/20 bg-nacre/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-around px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="qp-pearl" />
          <span className="qp-title text-2xl text-ink">Queen Pearls</span>
        </Link>

        <button
          className="qp-navlink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? "Fermer" : "Menu"}
        </button>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex flex-col items-start gap-y-2">
            {linkRows.map((row, i) => (
              <ul key={i} className="flex items-center justify-start gap-x-6">
                {row.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="qp-navlink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <Link
          href="/recrutement"
          className="hidden qp-btn qp-btn--solid !px-5 !py-2 lg:inline-flex"
        >
          Rejoindre
        </Link>
      </nav>

      {open && (
        <ul className="flex flex-col gap-3 border-t border-or/20 bg-nacre px-6 py-5 lg:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="qp-navlink"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/recrutement"
              className="qp-btn qp-btn--solid mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Rejoindre
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
