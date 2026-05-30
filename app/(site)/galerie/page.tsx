import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getGalleryCategories, getUncategorizedGalleryItems } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { PearlDivider } from "@/components/PearlDivider";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Galerie" };

export default async function GaleriePage() {
  const categories = await getGalleryCategories();
  const uncategorized = await getUncategorizedGalleryItems();

  return (
    <>
      <PageHeader
        overline="Souvenirs"
        title="Galerie"
        intro="Photos, vidéos, tenues, concours et événements — l'élégance des Queen Pearls en images."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        {categories.length === 0 && uncategorized.length === 0 ? (
          <EmptyState message="Les albums seront bientôt dévoilés ici." />
        ) : (
          <>
            {categories.length > 0 && (
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

            {uncategorized.length > 0 && (
              <>
                {categories.length > 0 && <PearlDivider />}
                <div>
                  <h2 className="qp-title mb-8 text-center text-3xl text-ink">
                    Hors catégorie
                  </h2>
                  <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
                    {uncategorized.map((it) =>
                      it.type === "video" ? (
                        <div key={it.id} className="qp-card overflow-hidden">
                          <video controls className="w-full" poster={it.thumbnailUrl ?? undefined}>
                            <source src={it.url} />
                          </video>
                          {it.caption && (
                            <p className="p-3 text-center text-sm text-greypearl">{it.caption}</p>
                          )}
                        </div>
                      ) : (
                        <figure key={it.id} className="qp-card overflow-hidden">
                          <div className="relative">
                            <Image
                              src={it.url}
                              alt={it.caption ?? "Hors catégorie"}
                              width={600}
                              height={800}
                              className="h-auto w-full object-cover"
                            />
                          </div>
                          {it.caption && (
                            <figcaption className="p-3 text-center text-sm text-greypearl">
                              {it.caption}
                            </figcaption>
                          )}
                        </figure>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
