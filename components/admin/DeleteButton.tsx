"use client";

export function DeleteButton({
  action,
}: {
  action: () => void | Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Supprimer définitivement cet élément ?")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-xs text-rose-pearl underline">
        Supprimer
      </button>
    </form>
  );
}
