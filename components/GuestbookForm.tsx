"use client";

import { useActionState } from "react";
import { submitGuestbook, type ActionState } from "@/app/actions/public";

const initial: ActionState = { ok: false };

export function GuestbookForm() {
  const [state, action, pending] = useActionState(submitGuestbook, initial);

  if (state.ok) {
    return (
      <div className="qp-card p-8 text-center">
        <span className="qp-pearl mx-auto mb-4 block" />
        <p className="font-serif text-xl text-ink">
          Merci pour votre message 💗 Il sera publié après validation.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="qp-card space-y-5 p-8">
      <div>
        <label className="qp-overline mb-2 block">Votre nom *</label>
        <input
          name="author"
          required
          className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
        />
      </div>
      <div>
        <label className="qp-overline mb-2 block">Votre message *</label>
        <textarea
          name="message"
          rows={4}
          required
          className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
        />
      </div>
      {state.error && <p className="text-sm text-rose-pearl">{state.error}</p>}
      <button type="submit" disabled={pending} className="qp-btn qp-btn--solid w-full">
        {pending ? "Envoi…" : "Signer le livre d'or"}
      </button>
    </form>
  );
}
