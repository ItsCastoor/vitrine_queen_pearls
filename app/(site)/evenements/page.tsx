import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getEvents } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { PearlDivider } from "@/components/PearlDivider";
import { SectionTitle } from "@/components/SectionTitle";
import { EmptyState } from "@/components/EmptyState";
import type { EventRow } from "@/lib/db/schema";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Événements" };

function EventCard({ e }: { e: EventRow }) {
  return (
    <Link href={`/evenements/${e.slug}`} className="qp-card flex flex-col overflow-hidden">
      <div className="relative aspect-video">
        {e.coverUrl ? (
          <Image src={e.coverUrl} alt={e.title} fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-rose/50 to-or/20" />
        )}
      </div>
      <div className="p-6">
        <p className="qp-overline mb-2">{formatDate(e.startsAt)}</p>
        <h3 className="qp-title text-2xl text-ink">{e.title}</h3>
        {e.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-greypearl">{e.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

export default async function EvenementsPage() {
  const upcoming = await getEvents("upcoming");
  const past = await getEvents("past");

  return (
    <>
      <PageHeader
        overline="Agenda"
        title="Événements"
        intro="Spectacles, concours, soirées, jeux de piste et collaborations : la vie de la maison."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <SectionTitle overline="À venir" title="Nos futurs rendez-vous" align="left" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.length === 0 ? (
            <div className="col-span-full">
              <EmptyState message="Aucun événement à venir pour l'instant." />
            </div>
          ) : (
            upcoming.map((e) => <EventCard key={e.id} e={e} />)
          )}
        </div>

        <PearlDivider />

        <SectionTitle
          overline="Hall of Memories"
          title="Nos souvenirs"
          subtitle="Les grands moments qui ont marqué l'histoire des Queen Pearls."
          align="left"
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {past.length === 0 ? (
            <div className="col-span-full">
              <EmptyState message="Les souvenirs s'écriront bientôt." />
            </div>
          ) : (
            past.map((e) => <EventCard key={e.id} e={e} />)
          )}
        </div>
      </section>
    </>
  );
}
