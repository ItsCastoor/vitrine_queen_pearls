"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function OutfitImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="qp-card group relative block w-full cursor-zoom-in overflow-hidden bg-nacre md:w-3/5"
        aria-label={`Agrandir l'image : ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="block h-auto w-full transition-transform duration-500 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/50 px-3 py-1 text-xs text-nacre opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Cliquer pour agrandir
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in-up"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-5 text-4xl leading-none text-nacre/80 hover:text-nacre"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
          >
            ×
          </button>
          <div
            className="relative h-full max-h-[90vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
