export function EmptyState({ message }: { message: string }) {
  return (
    <div className="qp-card mx-auto my-12 max-w-xl p-10 text-center">
      <span className="qp-pearl mx-auto mb-4 block" />
      <p className="font-serif text-lg text-greypearl">{message}</p>
    </div>
  );
}
