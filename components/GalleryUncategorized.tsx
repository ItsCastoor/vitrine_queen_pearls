"use client";
import { useState } from "react";
import { GalleryItemModal } from "@/components/GalleryItemModal";

export function GalleryUncategorized({ items }: { items: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) =>
          it.type === "video" ? (
            <div
              key={it.id}
              className="qp-card overflow-hidden cursor-pointer flex flex-col h-full"
              style={{ minHeight: 340 }}
              onClick={() => setSelected(it)}
            >
              <div className="relative aspect-[4/3] w-full">
                <video controls className="absolute inset-0 w-full h-full object-cover rounded-t-lg" poster={it.thumbnailUrl ?? undefined}>
                  <source src={it.url} />
                </video>
              </div>
              {it.caption && (
                <p className="p-3 text-center text-sm text-greypearl flex-1 flex items-center justify-center">{it.caption}</p>
              )}
            </div>
          ) : (
            <figure
              key={it.id}
              className="qp-card overflow-hidden cursor-pointer flex flex-col h-full"
              style={{ minHeight: 340 }}
              onClick={() => setSelected(it)}
            >
              <div className="relative aspect-[4/3] w-full">
                <img
                  src={it.url}
                  alt={it.caption ?? "Hors catégorie"}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                />
              </div>
              {it.caption && (
                <figcaption className="p-3 text-center text-sm text-greypearl flex-1 flex items-center justify-center">
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
