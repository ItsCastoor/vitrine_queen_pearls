import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PearlDivider } from "@/components/PearlDivider";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEventBySlug(slug);
  return { title: e ? e.title : "Événement" };
}

export default async function EvenementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = await getEventBySlug(slug);
  if (!e) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 pt-24 pb-16">
      <p className="qp-overline text-center">
        {formatDate(e.startsAt)}
        {e.endsAt ? ` — ${formatDate(e.endsAt)}` : ""}
      </p>
      <h1 className="qp-title mt-3 text-center text-5xl text-ink">{e.title}</h1>
      <PearlDivider />

      {e.coverUrl && (
        <div className="qp-card relative mb-10 aspect-video overflow-hidden">
          <Image src={e.coverUrl} alt={e.title} fill className="object-cover" />
        </div>
      )}

      {e.excerpt && (
        <p className="mb-8 font-serif text-2xl italic leading-relaxed text-ink/80">
          {e.excerpt}
        </p>
      )}

      {e.body && (
        <div className="whitespace-pre-line text-lg leading-relaxed text-ink/80">
          {e.body}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/evenements" className="qp-btn">
          ← Tous les événements
        </Link>
      </div>
    </article>
  );
}
