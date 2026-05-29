import type { Metadata } from "next";
import { getAllSettings, getSetting } from "@/lib/settings";
import { PageHeader } from "@/components/PageHeader";
import { PearlDivider } from "@/components/PearlDivider";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lore & Univers" };

export default async function LorePage() {
  const s = await getAllSettings();

  const blocks = [
    { title: "Au commencement", key: "lore.intro" },
    { title: "La symbolique des perles", key: "lore.symbolique" },
    { title: "Notre univers", key: "lore.univers" },
  ];

  return (
    <>
      <PageHeader
        overline="Univers"
        title="Lore"
        intro={getSetting(s, "lore.intro")}
      />

      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        {blocks.map((b, i) => (
          <div key={b.key} className="mb-12">
            <h2 className="qp-title text-3xl text-ink">{b.title}</h2>
            <p className="mt-4 font-serif text-xl italic leading-relaxed text-ink/80">
              {getSetting(s, b.key)}
            </p>
            {i < blocks.length - 1 && <PearlDivider />}
          </div>
        ))}
      </section>
    </>
  );
}
