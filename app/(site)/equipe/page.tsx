import type { Metadata } from "next";
import Image from "next/image";
import { getStaff } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Équipe" };

export default async function EquipePage() {
  const members = await getStaff();

  return (
    <>
      <PageHeader
        overline="Le Staff"
        title="Notre Équipe"
        intro="Les visages qui font vivre la maison, jour après jour, avec passion et exigence."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        {members.length === 0 ? (
          <EmptyState message="L'équipe sera bientôt présentée ici." />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <article key={m.id} className="qp-card overflow-hidden text-center">
                <div className="relative mx-auto mt-8 h-32 w-32 overflow-hidden rounded-full border border-or/40">
                  {m.avatarUrl ? (
                    <Image src={m.avatarUrl} alt={m.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose to-or/30 qp-title text-3xl text-or-deep">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="qp-title text-2xl text-ink">{m.name}</h3>
                  <p className="qp-overline mt-1">{m.role}</p>
                  {m.description && (
                    <p className="mt-4 font-serif text-base leading-relaxed text-greypearl">
                      {m.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
