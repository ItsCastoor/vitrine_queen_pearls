"use client";

import { useActionState } from "react";
import { changePassword, type PasswordState } from "@/app/admin/actions";

const initial: PasswordState = { ok: false };

const inputClass =
  "w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);

  return (
    <form action={action} className="qp-card max-w-md space-y-5 p-8">
      <div>
        <label className="qp-overline mb-2 block">Mot de passe actuel</label>
        <input name="current" type="password" required className={inputClass} />
      </div>
      <div>
        <label className="qp-overline mb-2 block">Nouveau mot de passe</label>
        <input name="next" type="password" required className={inputClass} />
      </div>
      <div>
        <label className="qp-overline mb-2 block">Confirmer</label>
        <input name="confirm" type="password" required className={inputClass} />
      </div>
      {state.error && <p className="text-sm text-rose-pearl">{state.error}</p>}
      {state.ok && (
        <p className="text-sm text-or-deep">Mot de passe mis à jour ✔</p>
      )}
      <button type="submit" disabled={pending} className="qp-btn qp-btn--solid w-full">
        {pending ? "Mise à jour…" : "Changer le mot de passe"}
      </button>
    </form>
  );
}
