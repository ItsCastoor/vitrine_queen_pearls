import type { Metadata } from "next";
import Image from "next/image";
import { getPartners } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

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
        {partners.length === 0 ? (
          <EmptyState message="Nos alliances seront bientôt dévoilées." />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => {
              const inner = (
                <>
                  <div className="relative mx-auto mb-4 h-24 w-full">
                    {p.logoUrl ? (
                      <Image src={p.logoUrl} alt={p.name} fill className="object-contain" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center qp-title text-2xl text-or-deep/60">
                        {p.name}
                      </div>
                    )}
                  </div>
                  <h2 className="qp-title text-2xl text-ink">{p.name}</h2>
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
                  className="qp-card p-8 text-center"
                >
                  {inner}
                </a>
              ) : (
                <div key={p.id} className="qp-card p-8 text-center">
                  {inner}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
