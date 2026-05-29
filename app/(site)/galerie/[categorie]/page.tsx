import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getGalleryCategoryBySlug,
  getGalleryItems,
} from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie } = await params;
  const cat = await getGalleryCategoryBySlug(categorie);
  return { title: cat ? `Galerie · ${cat.name}` : "Galerie" };
}

export default async function GalerieCategoriePage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const cat = await getGalleryCategoryBySlug(categorie);
  if (!cat) notFound();

  const items = await getGalleryItems(cat.id);

  return (
    <>
      <PageHeader overline="Galerie" title={cat.name} intro={cat.description ?? undefined} />

      <section className="mx-auto max-w-6xl px-6 py-12">
        {items.length === 0 ? (
          <EmptyState message="Cet album est encore vide." />
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {items.map((it) =>
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
                      alt={it.caption ?? cat.name}
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
        )}
      </section>
    </>
  );
}
