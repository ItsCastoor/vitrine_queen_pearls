import type { Metadata } from "next";
import Link from "next/link";
import { getGalleryCategories } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Galerie" };

export default async function GaleriePage() {
  const categories = await getGalleryCategories();

  return (
    <>
      <PageHeader
        overline="Souvenirs"
        title="Galerie"
        intro="Photos, vidéos, tenues, concours et événements — l'élégance des Queen Pearls en images."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        {categories.length === 0 ? (
          <EmptyState message="Les albums seront bientôt dévoilés ici." />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/galerie/${c.slug}`}
                className="qp-card flex aspect-[4/3] flex-col items-center justify-center p-8 text-center"
              >
                <span className="qp-pearl mb-4" />
                <h2 className="qp-title text-3xl text-ink">{c.name}</h2>
                {c.description && (
                  <p className="mt-2 text-sm text-greypearl">{c.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
