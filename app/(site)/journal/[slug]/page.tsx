import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PearlDivider } from "@/components/PearlDivider";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  return { title: p ? p.title : "Article" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 pt-24 pb-16">
      <p className="qp-overline text-center">{formatDate(p.publishedAt)}</p>
      <h1 className="qp-title mt-3 text-center text-5xl text-ink">{p.title}</h1>
      <PearlDivider />

      {p.coverUrl && (
        <div className="qp-card relative mb-10 aspect-video overflow-hidden">
          <Image src={p.coverUrl} alt={p.title} fill className="object-cover" />
        </div>
      )}

      {p.excerpt && (
        <p className="mb-8 font-serif text-2xl italic leading-relaxed text-ink/80">
          {p.excerpt}
        </p>
      )}

      {p.body && (
        <div className="whitespace-pre-line text-lg leading-relaxed text-ink/80">
          {p.body}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/journal" className="qp-btn">
          ← Retour au journal
        </Link>
      </div>
    </article>
  );
}
