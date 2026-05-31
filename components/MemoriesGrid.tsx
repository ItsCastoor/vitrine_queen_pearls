"use client";
import { useState } from "react";
import { GalleryItemModal } from "@/components/GalleryItemModal";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { EventRow } from "@/lib/db/schema";

export function MemoriesGrid({ events }: { events: EventRow[] }) {
  const [selected, setSelected] = useState<EventRow | null>(null);
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <div
            key={e.id}
            className="qp-card flex flex-col overflow-hidden cursor-pointer"
            onClick={() => setSelected(e)}
          >
            <div className="relative aspect-video">
              {e.coverUrl ? (
                <Image src={e.coverUrl} alt={e.title} fill className="object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-rose/50 to-or/20" />
              )}
            </div>
            <div className="p-6">
              <p className="qp-overline mb-2">{formatDate(e.startsAt)}</p>
              <h3 className="qp-title text-2xl text-ink">{e.title}</h3>
              {e.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-greypearl">{e.excerpt}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <GalleryItemModal
        open={!!selected}
        onClose={() => setSelected(null)}
        item={selected && {
          type: "photo",
          url: selected.coverUrl,
          caption: selected.title + (selected.excerpt ? ` — ${selected.excerpt}` : ""),
          description: selected.body || undefined,
        }}
      />
    </>
  );
}
