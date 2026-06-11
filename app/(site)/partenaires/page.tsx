import type { Metadata } from "next";
import Image from "next/image";
import { getPartners } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { PearlDivider } from "@/components/PearlDivider";
import { PartnershipForm } from "@/components/partnership/PartnershipForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Partenaires" };

export default async function PartenairesPage() {
  const partners = await getPartners();

  return (
    <>
      <PageHeader
        overline="Alliances"
        title="Nos Partenaires"
        intro="Les clubs, artistes et complices qui partagent notre vision de l'élégance."
      />

      <section className="mx-auto max-w-5xl px-6 py-12">
        {partners.length === 0 && (
          <div className="mb-14 flex justify-center">
            <div className="qp-card max-w-xl w-full px-10 py-8 text-center border border-rose-pearl/40">
              <span className="text-2xl">🤍</span>
              <p className="qp-overline text-or mt-3 mb-1">Bientôt disponibles</p>
              <p className="font-serif text-lg text-greypearl leading-relaxed">
                Nos partenariats seront visibles ici dès qu&apos;ils seront confirmés.
              </p>
            </div>
          </div>
        )}

        {partners.length > 0 && (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((p) => {
                const logos = (
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="relative h-20 w-20 shrink-0">
                      <Image src="/logo.png" alt="Queen Pearls" fill className="object-contain" />
                    </div>
                    <span className="qp-title text-6xl text-or-deep">×</span>
                    <div className="relative h-20 w-20 shrink-0">
                      {p.logoUrl ? (
                        <Image src={p.logoUrl} alt={p.name} fill className="object-contain" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center qp-title text-sm text-or-deep/60 text-center">
                          {p.name}
                        </div>
                      )}
                    </div>
                  </div>
                );
                const inner = (
                  <>
                    {logos}
                    <h2 className="font-sans text-base font-medium tracking-wide text-ink">
                      Queen Pearls × {p.name}
                    </h2>
                    {p.description && (
                      <p className="mt-2 text-sm text-greypearl">{p.description}</p>
                    )}
                  </>
                );
                return p.url ? (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="qp-card border-transparent p-8 text-center"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={p.id} className="qp-card border-transparent p-8 text-center">
                    {inner}
                  </div>
                );
              })}
            </div>

            <PearlDivider />
          </>
        )}

        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="qp-overline text-or">Espace collaborations</p>
            <h2 className="qp-title mt-2 text-3xl text-ink">
              Proposer un partenariat
            </h2>
            <p className="mt-3 font-serif text-lg text-greypearl">
              Nous croyons que chaque rencontre entre clubs est une occasion de créer
              de beaux souvenirs. Remplissez ce formulaire pour nous proposer une
              collaboration — chaque proposition est étudiée avec attention. 🤍
            </p>
          </div>
          <div className="mt-8">
            <PartnershipForm />
          </div>
        </div>
      </section>
    </>
  );
}
