export function PearlDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`qp-divider ${className}`} aria-hidden>
      <span className="qp-pearl" />
      <span className="qp-pearl" />
      <span className="qp-pearl" />
    </div>
  );
}
