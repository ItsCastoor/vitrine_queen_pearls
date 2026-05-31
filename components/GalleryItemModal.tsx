"use client";
import { useEffect } from "react";

export function GalleryItemModal({ open, onClose, item }: {
  open: boolean;
  onClose: () => void;
  item: any | null;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="relative max-w-lg w-full bg-white rounded-xl shadow-xl p-6 animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-2xl text-or/70 hover:text-or"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        {item.type === "video" ? (
          <video controls className="w-full rounded-lg mb-4" poster={item.thumbnailUrl ?? undefined}>
            <source src={item.url} />
          </video>
        ) : (
          <img src={item.url} alt={item.caption ?? "Souvenir"} className="w-full rounded-lg mb-4" />
        )}
        {item.caption && (
          <div className="text-center text-lg text-ink font-serif mb-2">{item.caption}</div>
        )}
        {item.description && (
          <div className="text-center text-greypearl mb-2 whitespace-pre-line">{item.description}</div>
        )}
        <div className="text-center text-sm text-greypearl">
          {item.type === "video" ? "Vidéo" : "Photo"}
        </div>
      </div>
    </div>
  );
}
