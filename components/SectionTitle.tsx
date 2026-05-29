export function SectionTitle({
  overline,
  title,
  subtitle,
  align = "center",
}: {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center"
          ? "text-center max-w-2xl mx-auto"
          : "text-left max-w-2xl"
      }
    >
      {overline && <p className="qp-overline mb-3">{overline}</p>}
      <h2 className="qp-title text-4xl sm:text-5xl text-ink">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-greypearl leading-relaxed font-serif text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
