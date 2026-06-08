"use client";

export function DeleteRoleButton({
  id,
  name,
  action,
}: {
  id: number;
  name: string;
  action: (idRaw: string) => Promise<void>;
}) {
  return (
    <form
      action={() => action(String(id))}
      onSubmit={(e) => {
        if (!confirm(`Supprimer le rôle « ${name} » ?\nLes comptes qui ont ce rôle n'auront plus aucun accès.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-rose-pearl/40 px-4 py-1.5 text-xs text-rose-pearl hover:bg-rose/20 transition"
      >
        Supprimer
      </button>
    </form>
  );
}
