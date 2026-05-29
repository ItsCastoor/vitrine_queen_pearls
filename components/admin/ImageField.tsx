"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageField({
  name,
  defaultValue,
  category,
}: {
  name: string;
  defaultValue?: string | null;
  category?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", category ?? "misc");

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setBusy(false);

    if (res.ok) {
      const data = await res.json();
      setUrl(data.url);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Échec de l'upload.");
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-lg border border-or/30">
          <Image src={url} alt="aperçu" fill className="object-cover" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*,video/mp4,video/webm"
          onChange={onFile}
          className="text-sm"
        />
        {busy && <span className="text-xs text-greypearl">Téléversement…</span>}
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-xs text-rose-pearl underline"
          >
            Retirer
          </button>
        )}
      </div>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="ou collez une URL"
        className="w-full rounded-lg border border-or/30 bg-white/70 px-3 py-2 text-sm outline-none focus:border-or"
      />
      {error && <p className="text-xs text-rose-pearl">{error}</p>}
    </div>
  );
}
