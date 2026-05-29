import type { Metadata } from "next";
import { getAllSettings, getSetting } from "@/lib/settings";
import { PageHeader } from "@/components/PageHeader";
import { PearlDivider } from "@/components/PearlDivider";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Le Club" };

export default async function ClubPage() {
  const s = await getAllSettings();

  const blocks = [
    { title: "Notre histoire", key: "club.histoire" },
    { title: "Nos valeurs", key: "club.valeurs" },
    { title: "Notre style", key: "club.style" },
    { title: "Notre organisation", key: "club.organisation" },
    { title: "Nos objectifs", key: "club.objectifs" },
    { title: "Notre vision", key: "club.vision" },
  ];

  return (
    <>
      <PageHeader
        overline="La Maison"
        title="Le Club"
        intro="Découvrez l'âme des Queen Pearls — ce qui nous rassemble, nous inspire et nous distingue."
      />

      <section className="mx-auto max-w-4xl px-6 py-12">
        {blocks.map((b, i) => (
          <article key={b.key} className="mb-14">
            <p className="qp-overline mb-3">0{i + 1}</p>
            <h2 className="qp-title text-3xl text-ink">{b.title}</h2>
            <p className="mt-4 font-serif text-xl leading-relaxed text-ink/80">
              {getSetting(s, b.key)}
            </p>
            {i < blocks.length - 1 && <PearlDivider />}
          </article>
        ))}
      </section>
    </>
  );
}
