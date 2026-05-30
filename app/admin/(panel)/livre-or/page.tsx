import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { guestbookEntries, type GuestbookEntry } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { setGuestbookStatus, deleteGuestbookEntry } from "./actions";

export const dynamic = "force-dynamic";

async function getAllEntries(): Promise<GuestbookEntry[]> {
  try {
    return await db
      .select()
      .from(guestbookEntries)
      .orderBy(desc(guestbookEntries.createdAt));
  } catch {
    return [];
  }
}

const STATUS_META: Record<
  GuestbookEntry["status"],
  { label: string; badge: string }
> = {
  pending: {
    label: "En attente",
    badge: "bg-or/15 text-or-deep border-or/30",
  },
  approved: {
    label: "Publié",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Refusé",
    badge: "bg-rose/30 text-rose-pearl border-rose-pearl/30",
  },
};

function StatusButton({
  id,
  status,
  label,
  variant,
}: {
  id: number;
  status: "pending" | "approved" | "rejected";
  label: string;
  variant: "approve" | "reject" | "neutral";
}) {
  const styles = {
    approve: "bg-emerald-600 text-white hover:bg-emerald-700",
    reject: "border border-rose-pearl/40 text-rose-pearl hover:bg-rose/20",
    neutral: "border border-or/30 text-or-deep hover:bg-or/10",
  }[variant];

  return (
    <form action={setGuestbookStatus.bind(null, String(id), status)}>
      <button
        type="submit"
        className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${styles}`}
      >
        {label}
      </button>
    </form>
  );
}

function EntryCard({ entry }: { entry: GuestbookEntry }) {
  const meta = STATUS_META[entry.status];

  return (
    <article className="qp-card flex flex-col gap-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="qp-title text-lg text-ink">{entry.author}</span>
          <span
            className={`rounded-full border px-3 py-0.5 text-[11px] font-medium uppercase tracking-wider ${meta.badge}`}
          >
            {meta.label}
          </span>
        </div>
        <span className="text-xs text-greypearl">
          {formatDate(entry.createdAt)}
        </span>
      </div>

      <p className="whitespace-pre-line font-serif text-ink/80">
        {entry.message}
      </p>

      <div className="flex flex-wrap items-center gap-3 border-t border-or/10 pt-3">
        {entry.status !== "approved" && (
          <StatusButton
            id={entry.id}
            status="approved"
            label="✓ Publier"
            variant="approve"
          />
        )}
        {entry.status !== "rejected" && (
          <StatusButton
            id={entry.id}
            status="rejected"
            label="✕ Refuser"
            variant="reject"
          />
        )}
        {entry.status !== "pending" && (
          <StatusButton
            id={entry.id}
            status="pending"
            label="↺ Remettre en attente"
            variant="neutral"
          />
        )}
        <div className="ml-auto">
          <DeleteButton
            action={deleteGuestbookEntry.bind(null, String(entry.id))}
          />
        </div>
      </div>
    </article>
  );
}

export default async function GuestbookModerationPage() {
  const entries = await getAllEntries();

  const groups: {
    key: GuestbookEntry["status"];
    title: string;
    subtitle: string;
  }[] = [
    {
      key: "pending",
      title: "En attente de validation",
      subtitle: "Nouveaux messages à modérer",
    },
    { key: "approved", title: "Publiés", subtitle: "Visibles sur le site" },
    { key: "rejected", title: "Refusés", subtitle: "Conservés dans l'historique" },
  ];

  return (
    <div>
      <div>
        <p className="qp-overline mb-1">Modération</p>
        <h1 className="qp-title text-4xl text-ink">Livre d&apos;Or</h1>
        <p className="mt-2 text-sm text-greypearl">
          Validez ou refusez les messages. L&apos;historique est conservé : un
          message refusé peut être republié à tout moment.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="qp-card mt-8 p-10 text-center font-serif text-greypearl">
          Aucun message reçu pour l&apos;instant.
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {groups.map((group) => {
            const list = entries.filter((e) => e.status === group.key);
            return (
              <section key={group.key}>
                <div className="mb-4 flex items-baseline gap-3">
                  <h2 className="qp-title text-2xl text-ink">{group.title}</h2>
                  <span className="text-xs uppercase tracking-wider text-greypearl">
                    {group.subtitle} · {list.length}
                  </span>
                </div>
                {list.length === 0 ? (
                  <p className="text-sm italic text-greypearl">
                    Aucun message dans cette catégorie.
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {list.map((entry) => (
                      <EntryCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
