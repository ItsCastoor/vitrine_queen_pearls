import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Journal" };

export default async function JournalPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHeader
        overline="Actualités"
        title="Le Journal"
        intro="Annonces, nouvelles recrues, promotions et projets — la maison au fil des jours."
      />

      <section className="mx-auto max-w-5xl px-6 py-12">
        {posts.length === 0 ? (
          <EmptyState message="Aucun article publié pour le moment." />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/journal/${p.slug}`}
                className="qp-card flex flex-col overflow-hidden"
              >
                <div className="relative aspect-video">
                  {p.coverUrl ? (
                    <Image src={p.coverUrl} alt={p.title} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-rose/50 to-or/20" />
                  )}
                </div>
                <div className="p-6">
                  <p className="qp-overline mb-2">{formatDate(p.publishedAt)}</p>
                  <h2 className="qp-title text-2xl text-ink">{p.title}</h2>
                  {p.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-greypearl">{p.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
