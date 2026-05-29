import type { Metadata } from "next";
import Image from "next/image";
import { getHallOfFame } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Hall of Fame" };

export default async function HallOfFamePage() {
  const entries = await getHallOfFame();

  return (
    <>
      <PageHeader
        overline="Mémoire"
        title="Hall of Fame"
        intro="Les membres emblématiques, les projets et les moments qui ont forgé notre légende."
      />

      <section className="mx-auto max-w-5xl px-6 py-12">
        {entries.length === 0 ? (
          <EmptyState message="La légende reste à écrire." />
        ) : (
          <div className="space-y-10">
            {entries.map((e) => (
              <article key={e.id} className="qp-card flex flex-col gap-6 p-6 sm:flex-row">
                {e.imageUrl && (
                  <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg sm:w-40">
                    <Image src={e.imageUrl} alt={e.title} fill className="object-cover" />
                  </div>
                )}
                <div>
                  {e.year && <p className="qp-overline mb-1">{e.year}</p>}
                  <h2 className="qp-title text-3xl text-ink">{e.title}</h2>
                  {e.subtitle && (
                    <p className="font-serif text-lg italic text-or-deep">{e.subtitle}</p>
                  )}
                  {e.body && (
                    <p className="mt-3 leading-relaxed text-greypearl">{e.body}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
