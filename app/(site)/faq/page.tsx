import type { Metadata } from "next";
import { getFaq } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage() {
  const faq = await getFaq();

  return (
    <>
      <PageHeader
        overline="Questions"
        title="Foire aux questions"
        intro="Tout ce que vous vous demandez sur les Queen Pearls, en un coup d'œil."
      />

      <section className="mx-auto max-w-2xl px-6 py-12">
        {faq.length === 0 ? (
          <EmptyState message="Les questions fréquentes arriveront bientôt." />
        ) : (
          <div className="space-y-4">
            {faq.map((f) => (
              <details key={f.id} className="qp-card p-6">
                <summary className="cursor-pointer font-serif text-xl text-ink">
                  {f.question}
                </summary>
                <p className="mt-4 leading-relaxed text-greypearl">{f.answer}</p>
              </details>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
