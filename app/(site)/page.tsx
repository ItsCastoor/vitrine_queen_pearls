import Link from "next/link";
import Image from "next/image";
import { getAllSettings, getSetting } from "@/lib/settings";
import { getHighlightEvents, getHomeGalleryImages } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PearlDivider } from "@/components/PearlDivider";
import { SectionTitle } from "@/components/SectionTitle";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getAllSettings();
  const events = await getHighlightEvents();
  const gallery = await getHomeGalleryImages(3);

  const heroTitle = getSetting(settings, "home.hero_title");
  const tagline = getSetting(settings, "home.hero_tagline");
  const cta = getSetting(settings, "home.hero_cta");
  const intro = getSetting(settings, "home.intro");

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6 text-center">
        <Image
          src="/logo.png"
          alt=""
          aria-hidden
          fill
          priority
          className="-z-20 object-cover object-center opacity-100"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-nacre/70 via-nacre/60 to-nacre/85" />
        <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(circle_at_50%_20%,rgba(201,166,107,0.25),transparent_60%)]" />

        <div className="mx-auto max-w-4xl">
          <p className="qp-overline mb-6 qp-fade-up">Maison &amp; Club d&apos;élégance</p>
          <h1 className="qp-title text-6xl sm:text-8xl text-ink qp-fade-up">
            {heroTitle}
          </h1>
          <PearlDivider className="qp-fade-up-2" />
          <p className="mx-auto max-w-2xl font-serif text-2xl italic leading-relaxed text-ink/80 qp-fade-up-2">
            « {tagline} »
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 qp-fade-up-3">
            <Link href="/recrutement" className="qp-btn qp-btn--solid">
              {cta}
            </Link>
            <Link href="/club" className="qp-btn">
              Découvrir la maison
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-serif text-2xl leading-relaxed text-ink/80">{intro}</p>
      </section>

      {/* IMAGES FORTES */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {gallery.length > 0
            ? gallery.map((img) => (
                <figure
                  key={img.id}
                  className="qp-card relative aspect-[3/4] overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt={img.caption ?? "Queen Pearls"}
                    fill
                    className="object-cover"
                  />
                  {img.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-4 text-sm text-white">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))
            : [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="qp-card relative aspect-[3/4] overflow-hidden"
                >
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose/50 to-or/20">
                    <span className="qp-title text-3xl text-or-deep/70">
                      Queen Pearls
                    </span>
                  </div>
                </div>
              ))}
        </div>
        {gallery.length === 0 && (
          <p className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-greypearl">
            Galerie à venir — ajoutez vos images depuis l&apos;espace privé
          </p>
        )}
      </section>

      {/* PROCHAINS ÉVÉNEMENTS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle
          overline="Agenda"
          title="Nos prochains rendez-vous"
          subtitle="Spectacles, concours et soirées : la maison ne dort jamais."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {events.length === 0 ? (
            <div className="qp-card col-span-full p-10 text-center font-serif text-lg text-greypearl">
              Aucun événement programmé pour l&apos;instant — revenez bientôt ✨
            </div>
          ) : (
            events.map((e) => (
              <Link
                key={e.id}
                href={`/evenements/${e.slug}`}
                className="qp-card flex flex-col overflow-hidden"
              >
                <div className="relative aspect-video">
                  {e.coverUrl ? (
                    <Image
                      src={e.coverUrl}
                      alt={e.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-rose/50 to-or/20" />
                  )}
                </div>
                <div className="p-6">
                  <p className="qp-overline mb-2">{formatDate(e.startsAt)}</p>
                  <h3 className="qp-title text-2xl text-ink">{e.title}</h3>
                  {e.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-greypearl">
                      {e.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="mt-10 text-center">
          <Link href="/evenements" className="qp-btn">
            Tous les événements
          </Link>
        </div>
      </section>

      {/* APPEL FINAL */}
      <section className="bg-gradient-to-b from-transparent to-rose/40 px-6 py-24 text-center">
        <SectionTitle
          overline="Rejoignez-nous"
          title="Et si votre perle rejoignait le collier ?"
          subtitle="Les Queen Pearls accueillent les âmes passionnées et élégantes."
        />
        <div className="mt-10">
          <Link href="/recrutement" className="qp-btn qp-btn--solid">
            {cta}
          </Link>
        </div>
      </section>
    </>
  );
}
