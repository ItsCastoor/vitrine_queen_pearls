import type { Metadata } from "next";
import Image from "next/image";
import { getOutfits } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nos Tenues" };

function parseColors(json: string | null): string[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return json.split(",").map((c) => c.trim()).filter(Boolean);
  }
}

export default async function TenuesPage() {
  const outfits = await getOutfits();

  return (
    <>
      <PageHeader
        overline="Élégance"
        title="Nos Tenues"
        intro="Uniformes officiels, codes couleurs et chevaux associés — la signature visuelle des Queen Pearls."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        {outfits.length === 0 ? (
          <EmptyState message="Les tenues seront bientôt présentées ici." />
        ) : (
          <div className="space-y-16">
            {outfits.map((o, i) => {
              const colors = parseColors(o.colorsJson);
              return (
                <article
                  key={o.id}
                  className={`flex flex-col gap-8 md:flex-row md:items-center ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="qp-card relative aspect-[3/4] w-full overflow-hidden md:w-1/2">
                    {o.imageUrl ? (
                      <Image src={o.imageUrl} alt={o.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose/50 to-or/20 qp-title text-3xl text-or-deep/60">
                        {o.name}
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2">
                    <h2 className="qp-title text-4xl text-ink">{o.name}</h2>
                    {o.description && (
                      <p className="mt-4 font-serif text-lg leading-relaxed text-ink/80">
                        {o.description}
                      </p>
                    )}
                    {colors.length > 0 && (
                      <div className="mt-6">
                        <p className="qp-overline mb-3">Codes couleurs</p>
                        <div className="flex flex-wrap gap-3">
                          {colors.map((c) => (
                            <span key={c} className="flex items-center gap-2 text-sm text-ink/70">
                              <span
                                className="h-6 w-6 rounded-full border border-or/40"
                                style={{ background: c }}
                              />
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {o.horse && (
                      <p className="mt-6 text-ink/70">
                        <span className="qp-overline">Cheval associé · </span>
                        <span className="font-serif text-lg">{o.horse}</span>
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
