"use client";

import { useActionState } from "react";
import { submitRecruitment, type ActionState } from "@/app/actions/public";

const initial: ActionState = { ok: false };

export function RecruitmentForm() {
  const [state, action, pending] = useActionState(submitRecruitment, initial);

  if (state.ok) {
    return (
      <div className="qp-card p-8 text-center">
        <span className="qp-pearl mx-auto mb-4 block" />
        <p className="font-serif text-xl text-ink">
          Merci ✨ Votre candidature a bien été envoyée.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="qp-card space-y-5 p-8">
      <div>
        <label className="qp-overline mb-2 block">Pseudo *</label>
        <input
          name="pseudo"
          required
          className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
        />
      </div>
      <div>
        <label className="qp-overline mb-2 block">Discord</label>
        <input
          name="discord"
          placeholder="pseudo#0000"
          className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
        />
      </div>
      <div>
        <label className="qp-overline mb-2 block">Votre message</label>
        <textarea
          name="message"
          rows={5}
          placeholder="Parlez-nous de vous, de votre passion…"
          className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
        />
      </div>
      {state.error && <p className="text-sm text-rose-pearl">{state.error}</p>}
      <button type="submit" disabled={pending} className="qp-btn qp-btn--solid w-full">
        {pending ? "Envoi…" : "Envoyer ma candidature"}
      </button>
    </form>
  );
}
