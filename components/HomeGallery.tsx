"use client";
import { useState } from "react";
import { GalleryItemModal } from "@/components/GalleryItemModal";
import Image from "next/image";

export function HomeGallery({ images }: { images: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);
  if (!images.length) return null;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {images.map((img) => (
          <figure
            key={img.id}
            className="qp-card relative aspect-[3/4] overflow-hidden cursor-pointer"
            onClick={() => setSelected(img)}
          >
            <Image
              src={img.url}
              alt={img.caption ?? "Queen Pearls"}
              fill
              className="object-cover"
            />
            {img.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-4 text-sm text-white">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      <GalleryItemModal open={!!selected} onClose={() => setSelected(null)} item={selected} />
    </>
  );
}
