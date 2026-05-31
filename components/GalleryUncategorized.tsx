"use client";
import { useState } from "react";
import { GalleryItemModal } from "@/components/GalleryItemModal";

export function GalleryUncategorized({ items }: { items: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);
  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((it) =>
          it.type === "video" ? (
            <div
              key={it.id}
              className="qp-card overflow-hidden cursor-pointer"
              onClick={() => setSelected(it)}
            >
              <video controls className="w-full" poster={it.thumbnailUrl ?? undefined}>
                <source src={it.url} />
              </video>
              {it.caption && (
                <p className="p-3 text-center text-sm text-greypearl">{it.caption}</p>
              )}
            </div>
          ) : (
            <figure
              key={it.id}
              className="qp-card overflow-hidden cursor-pointer"
              onClick={() => setSelected(it)}
            >
              <div className="relative">
                <img
                  src={it.url}
                  alt={it.caption ?? "Hors catégorie"}
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
      <GalleryItemModal open={!!selected} onClose={() => setSelected(null)} item={selected} />
    </>
  );
}
