import { PearlDivider } from "./PearlDivider";

export function PageHeader({
  overline,
  title,
  intro,
}: {
  overline?: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose/40 to-transparent px-6 pt-24 pb-12 text-center">
      <div className="mx-auto max-w-3xl qp-fade-up">
        {overline && <p className="qp-overline mb-4">{overline}</p>}
        <h1 className="qp-title text-5xl sm:text-6xl text-ink">{title}</h1>
        <PearlDivider />
        {intro && (
          <p className="mx-auto max-w-2xl font-serif text-xl leading-relaxed text-greypearl">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
