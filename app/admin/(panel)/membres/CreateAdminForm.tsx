"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createAdmin } from "./actions";

type State = { setupUrl?: string; direct?: boolean; error?: string } | null;

export function CreateAdminForm({ roles }: { roles: { id: number; name: string }[] }) {
  const [state, action, pending] = useActionState<State, FormData>(
    async (_prev, fd) => createAdmin(fd),
    null,
  );

  if (state?.direct) {
    return (
      <div className="qp-card mt-8 max-w-xl p-6">
        <p className="qp-overline mb-2 text-emerald-600">Compte créé ✔</p>
        <p className="font-serif text-ink/80 mb-4">
          Le compte est prêt — la personne peut se connecter avec l&apos;identifiant et le mot de passe que vous avez définis.
        </p>
        <Link href="/admin/membres" className="qp-btn qp-btn--solid inline-block">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  if (state?.setupUrl) {
    return (
      <div className="qp-card mt-8 max-w-xl p-6">
        <p className="qp-overline mb-2 text-emerald-600">Compte créé ✔</p>
        <p className="font-serif text-ink/80 mb-4">
          Partagez ce lien <strong>en privé</strong> avec la personne concernée. Il est à usage unique et expire dès que le mot de passe est défini.
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-or/30 bg-nacre-deep p-3 text-sm break-all">
          <code className="flex-1 text-or-deep">{state.setupUrl}</code>
          <button
            type="button"
            className="qp-btn !py-1 !px-3 !text-xs shrink-0"
            onClick={() => navigator.clipboard.writeText(state.setupUrl!)}
          >
            Copier
          </button>
        </div>
        <form className="mt-4">
          <button formAction={() => window.location.reload()} type="submit" className="text-sm text-or-deep underline">
            Créer un autre compte
          </button>
        </form>
      </div>
    );
  }

  const noRoles = roles.length === 0;

  return (
    <form action={action} className="qp-card mt-8 max-w-xl p-6">
      <h2 className="qp-title text-xl text-ink mb-4">Nouveau compte admin</h2>

      {noRoles && (
        <p className="mb-4 rounded-lg border border-or/30 bg-or/10 px-4 py-3 text-sm text-or-deep">
          ⚠ Aucun rôle disponible. Créez d&apos;abord un rôle dans{" "}
          <Link href="/admin/roles" className="underline">Rôles &amp; permissions</Link>.
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="qp-overline mb-2 block">Identifiant *</label>
          <input
            name="username"
            required
            disabled={noRoles}
            placeholder="ex. katarina_r"
            className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or disabled:opacity-40"
          />
        </div>

        <div>
          <label className="qp-overline mb-2 block">Rôle *</label>
          <select
            name="roleId"
            required
            disabled={noRoles}
            className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or disabled:opacity-40"
          >
            <option value="">— Choisir un rôle —</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="qp-overline mb-2 block">
            Mot de passe <span className="normal-case font-normal text-greypearl">(optionnel — laissez vide pour envoyer un lien de configuration)</span>
          </label>
          <input
            name="password"
            type="password"
            disabled={noRoles}
            minLength={8}
            placeholder="8 caractères minimum"
            className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or disabled:opacity-40"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isEnabled"
            id="isEnabled"
            value="1"
            defaultChecked
            disabled={noRoles}
            className="h-4 w-4 accent-or-deep"
          />
          <label htmlFor="isEnabled" className="text-sm text-ink/80">
            Compte activé dès la création
          </label>
        </div>

        {state?.error && (
          <p className="text-sm text-rose-pearl">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending || noRoles}
          className="qp-btn qp-btn--solid disabled:opacity-40"
        >
          {pending ? "Création…" : "Créer le compte"}
        </button>
      </div>
    </form>
  );
}
