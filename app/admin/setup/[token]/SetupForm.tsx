"use client";

import { useActionState } from "react";
import { setupPassword } from "./actions";

export function SetupForm({ token }: { token: string }) {
  const action = setupPassword.bind(null, token);
  const [state, formAction, pending] = useActionState<{ error?: string } | null, FormData>(
    async (_prev, fd) => action(_prev, fd),
    null,
  );

  return (
    <form action={formAction} className="qp-card space-y-5 p-8">
      <div>
        <label className="qp-overline mb-2 block">Nouveau mot de passe *</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
        />
      </div>
      <div>
        <label className="qp-overline mb-2 block">Confirmer le mot de passe *</label>
        <input
          name="confirm"
          type="password"
          required
          className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
        />
      </div>
      {state?.error && <p className="text-sm text-rose-pearl">{state.error}</p>}
      <button type="submit" disabled={pending} className="qp-btn qp-btn--solid w-full">
        {pending ? "Enregistrement…" : "Définir mon mot de passe"}
      </button>
    </form>
  );
}
