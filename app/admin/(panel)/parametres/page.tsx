import { getAllSettings } from "@/lib/settings";
import { saveSettings } from "@/app/admin/actions";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { PearlDivider } from "@/components/PearlDivider";

export const dynamic = "force-dynamic";

const TEXT_FIELDS: { key: string; label: string; long?: boolean }[] = [
  { key: "home.hero_title", label: "Accueil · Titre" },
  { key: "home.hero_tagline", label: "Accueil · Phrase signature" },
  { key: "home.hero_cta", label: "Accueil · Bouton d'appel" },
  { key: "home.intro", label: "Accueil · Introduction", long: true },
  { key: "club.histoire", label: "Club · Histoire", long: true },
  { key: "club.valeurs", label: "Club · Valeurs", long: true },
  { key: "club.style", label: "Club · Style", long: true },
  { key: "club.organisation", label: "Club · Organisation", long: true },
  { key: "club.objectifs", label: "Club · Objectifs", long: true },
  { key: "club.vision", label: "Club · Vision", long: true },
  { key: "lore.intro", label: "Lore · Introduction", long: true },
  { key: "lore.symbolique", label: "Lore · Symbolique des perles", long: true },
  { key: "lore.univers", label: "Lore · Univers", long: true },
  { key: "recrutement.intro", label: "Recrutement · Introduction", long: true },
  { key: "recrutement.criteres", label: "Recrutement · Critères", long: true },
];

const inputClass =
  "w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or";

export default async function ParametresPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const settings = await getAllSettings();

  return (
    <div>
      <p className="qp-overline mb-1">Réglages</p>
      <h1 className="qp-title text-4xl text-ink">Paramètres</h1>
      <p className="mt-2 font-serif text-lg text-greypearl">
        Modifiez les textes des pages et votre mot de passe.
      </p>

      {saved && (
        <p className="mt-4 text-sm text-or-deep">Textes enregistrés ✔</p>
      )}

      <h2 className="qp-title mt-10 text-2xl text-ink">Textes du site</h2>
      <form action={saveSettings} className="qp-card mt-4 max-w-3xl space-y-5 p-8">
        {TEXT_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="qp-overline mb-2 block">{f.label}</label>
            {f.long ? (
              <textarea
                name={f.key}
                rows={3}
                defaultValue={settings[f.key] ?? ""}
                className={inputClass}
              />
            ) : (
              <input
                name={f.key}
                type="text"
                defaultValue={settings[f.key] ?? ""}
                className={inputClass}
              />
            )}
          </div>
        ))}
        <button type="submit" className="qp-btn qp-btn--solid">
          Enregistrer les textes
        </button>
      </form>

      <PearlDivider />

      <h2 className="qp-title text-2xl text-ink">Sécurité</h2>
      <p className="mt-2 text-sm text-greypearl">
        Changez le mot de passe du compte administrateur.
      </p>
      <div className="mt-4">
        <PasswordForm />
      </div>
    </div>
  );
}
