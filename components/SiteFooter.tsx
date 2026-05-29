import Link from "next/link";
import { PearlDivider } from "./PearlDivider";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-or/20 bg-nacre-deep/60">
      <div className="mx-auto max-w-7xl px-6 py-14 text-center">
        <p className="qp-title text-3xl text-ink">Queen Pearls</p>
        <PearlDivider />
        <p className="mx-auto max-w-md font-serif text-lg text-greypearl">
          « Plus qu&apos;un club, une maison où l&apos;élégance rencontre la passion. »
        </p>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <li>
            <Link href="/club" className="qp-navlink">
              Le Club
            </Link>
          </li>
          <li>
            <Link href="/recrutement" className="qp-navlink">
              Recrutement
            </Link>
          </li>
          <li>
            <Link href="/faq" className="qp-navlink">
              FAQ
            </Link>
          </li>
          <li>
            <Link href="/livre-d-or" className="qp-navlink">
              Livre d&apos;Or
            </Link>
          </li>
          <li>
            <Link href="/admin/login" className="qp-navlink">
              Espace privé
            </Link>
          </li>
        </ul>

        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-greypearl">
          © {new Date().getFullYear()} Queen Pearls — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
