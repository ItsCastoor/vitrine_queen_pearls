import type { Metadata } from "next";
import { getPublishedGuestbook } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { PearlDivider } from "@/components/PearlDivider";
import { GuestbookForm } from "@/components/GuestbookForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Livre d'Or" };

export default async function LivreDorPage() {
  const entries = await getPublishedGuestbook();

  return (
    <>
      <PageHeader
        overline="Témoignages"
        title="Livre d'Or"
        intro="Souvenirs, messages et citations laissés par celles et ceux qui ont croisé la maison."
      />

      <section className="mx-auto max-w-3xl px-6 py-12">
        {entries.length > 0 && (
          <div className="space-y-6">
            {entries.map((e) => (
              <blockquote key={e.id} className="qp-card p-6">
                <p className="font-serif text-xl italic leading-relaxed text-ink/80">
                  « {e.message} »
                </p>
                <footer className="mt-4 flex items-center justify-between">
                  <span className="qp-overline">{e.author}</span>
                  <span className="text-xs text-greypearl">
                    {formatDate(e.createdAt)}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        )}

        <PearlDivider />

        <h2 className="qp-title text-center text-3xl text-ink">
          Laissez votre message
        </h2>
        <p className="mt-2 text-center font-serif text-lg text-greypearl">
          Votre mot sera publié après une douce relecture.
        </p>
        <div className="mt-8">
          <GuestbookForm />
        </div>
      </section>
    </>
  );
}
