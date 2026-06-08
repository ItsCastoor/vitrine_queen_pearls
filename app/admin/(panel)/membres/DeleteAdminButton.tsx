"use client";

export function DeleteAdminButton({
  id,
  username,
  action,
}: {
  id: number;
  username: string;
  action: (idRaw: string) => Promise<void>;
}) {
  return (
    <form
      action={() => action(String(id))}
      onSubmit={(e) => {
        if (!confirm(`Supprimer définitivement le compte « ${username} » ?`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-rose-pearl/40 px-3 py-1.5 text-xs text-rose-pearl hover:bg-rose/20 transition"
      >
        Supprimer
      </button>
    </form>
  );
}
