import type { Metadata } from "next";
import { getAllSettings, getSetting } from "@/lib/settings";
import { getFaq } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { PearlDivider } from "@/components/PearlDivider";
import { MemberRecruitmentForm } from "@/components/recruitment/MemberRecruitmentForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Recrutement" };

export default async function RecrutementPage() {
  const s = await getAllSettings();
  const faq = await getFaq();

  const attentes = [
    "Une présence régulière et bienveillante",
    "Le goût du raffinement et du travail soigné",
    "Le respect de l'esprit de la maison",
    "Une passion sincère pour notre univers",
  ];
  const postes = [
    "Cavalières & instructrices",
    "Responsables de projets",
    "Artistes & créatrices visuelles",
    "Modératrices Discord",
  ];

  return (
    <>
      <PageHeader
        overline="Rejoindre"
        title="Devenir une Queen Pearl"
        intro={getSetting(s, "recrutement.intro")}
      />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="qp-card p-8">
            <h2 className="qp-title text-2xl text-ink">Nos critères</h2>
            <p className="mt-3 font-serif text-lg text-ink/80">
              {getSetting(s, "recrutement.criteres")}
            </p>
            <h3 className="qp-overline mt-8 mb-3">Nos attentes</h3>
            <ul className="space-y-2">
              {attentes.map((a) => (
                <li key={a} className="flex items-start gap-3 text-ink/80">
                  <span className="qp-pearl mt-2 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="qp-card p-8">
            <h2 className="qp-title text-2xl text-ink">Postes recherchés</h2>
            <ul className="mt-3 space-y-2">
              {postes.map((p) => (
                <li key={p} className="flex items-start gap-3 text-ink/80">
                  <span className="qp-pearl mt-2 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <h3 className="qp-overline mt-8 mb-3">Ce qui nous rend uniques</h3>
            <p className="font-serif text-lg text-ink/80">
              Une maison où l&apos;élégance n&apos;est pas une façade mais un art de
              vivre partagé, porté par une sororité sincère.
            </p>
          </div>
        </div>

        <PearlDivider />

        <div className="mx-auto max-w-2xl">
          <h2 className="qp-title text-center text-3xl text-ink">
            Formulaire de candidature · Membre
          </h2>
          <p className="mt-2 text-center font-serif text-lg text-greypearl">
            Réponds avec sérieux et sincérité — la sélection est renforcée.
          </p>
          <div className="mt-8">
            <MemberRecruitmentForm />
          </div>
        </div>

        {faq.length > 0 && (
          <>
            <PearlDivider />
            <h2 className="qp-title text-center text-3xl text-ink">
              FAQ recrutement
            </h2>
            <div className="mx-auto mt-8 max-w-2xl space-y-4">
              {faq.map((f) => (
                <details key={f.id} className="qp-card p-5">
                  <summary className="cursor-pointer font-serif text-lg text-ink">
                    {f.question}
                  </summary>
                  <p className="mt-3 text-greypearl">{f.answer}</p>
                </details>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
