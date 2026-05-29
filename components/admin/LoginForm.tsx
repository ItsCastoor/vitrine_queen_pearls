"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: form,
    });

    setPending(false);

    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Connexion impossible.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="qp-card space-y-5 p-8">
      <div>
        <label className="qp-overline mb-2 block">Identifiant</label>
        <input
          name="username"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
        />
      </div>
      <div>
        <label className="qp-overline mb-2 block">Mot de passe</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
        />
      </div>
      {error && <p className="text-sm text-rose-pearl">{error}</p>}
      <button type="submit" disabled={pending} className="qp-btn qp-btn--solid w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
