import Link from "next/link";
import Image from "next/image";
import { desc, asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  partnershipApplications,
  partners,
  type PartnershipApplication,
  type Partner,
} from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { PARTNERSHIP_FORM } from "@/lib/partnership/partnership-form";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { requirePermission } from "@/lib/auth/permissions";
import { deleteResource } from "@/app/admin/actions";
import { setPartnershipStatus, deletePartnership } from "./actions";

export const dynamic = "force-dynamic";

type Status = PartnershipApplication["status"];

async function getApplications(): Promise<PartnershipApplication[]> {
  try {
    return await db
      .select()
      .from(partnershipApplications)
      .orderBy(desc(partnershipApplications.createdAt));
  } catch {
    return [];
  }
}

async function getPublishedPartners(): Promise<Partner[]> {
  try {
    return await db.select().from(partners).orderBy(asc(partners.sortOrder));
  } catch {
    return [];
  }
}

const STATUS_META: Record<Status, { label: string; badge: string }> = {
  new: { label: "Nouvelle", badge: "bg-or/15 text-or-deep border-or/30" },
  read: { label: "Lue", badge: "bg-rose/30 text-or-deep border-or/20" },
  accepted: {
    label: "Acceptée",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Refusée",
    badge: "bg-rose/30 text-rose-pearl border-rose-pearl/30",
  },
};

function parseAnswers(raw: string | null): Record<string, string | string[]> {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function StatusButton({
  id,
  status,
  label,
  variant,
}: {
  id: number;
  status: Status;
  label: string;
  variant: "approve" | "reject" | "neutral";
}) {
  const styles = {
    approve: "bg-emerald-600 text-white hover:bg-emerald-700",
    reject: "border border-rose-pearl/40 text-rose-pearl hover:bg-rose/20",
    neutral: "border border-or/30 text-or-deep hover:bg-or/10",
  }[variant];

  return (
    <form action={setPartnershipStatus.bind(null, String(id), status)}>
      <button
        type="submit"
        className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${styles}`}
      >
        {label}
      </button>
    </form>
  );
}

function ApplicationCard({ app }: { app: PartnershipApplication }) {
  const meta = STATUS_META[app.status];
  const answers = parseAnswers(app.answers);

  return (
    <article className="qp-card flex flex-col gap-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          {app.logoUrl && (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-or/20">
              <Image src={app.logoUrl} alt={app.clubName} fill className="object-contain" />
            </div>
          )}
          <span className="qp-title text-lg text-ink">{app.clubName}</span>
          {app.server && (
            <span className="text-sm text-greypearl">· {app.server}</span>
          )}
          {app.contactName && (
            <span className="text-sm text-greypearl">· {app.contactName}</span>
          )}
          <span
            className={`rounded-full border px-3 py-0.5 text-[11px] font-medium uppercase tracking-wider ${meta.badge}`}
          >
            {meta.label}
          </span>
        </div>
        <span className="text-xs text-greypearl">{formatDate(app.createdAt)}</span>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-or-deep">
          Voir les réponses ▾
        </summary>
        <div className="mt-4 space-y-6">
          {PARTNERSHIP_FORM.map((section) => (
            <section key={section.id}>
              <h4 className="qp-overline mb-2">{section.title}</h4>
              <dl className="space-y-3">
                {section.questions.map((q) => {
                  if (q.type === "file") return null;
                  const value = answers[q.id];
                  const display = Array.isArray(value)
                    ? value.join(", ")
                    : (value ?? "");
                  return (
                    <div key={q.id}>
                      <dt className="text-sm font-medium text-ink/70">{q.label}</dt>
                      <dd className="mt-0.5 whitespace-pre-line font-serif text-ink/90">
                        {display || <span className="italic text-greypearl">—</span>}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ))}
        </div>
      </details>

      <div className="flex flex-wrap items-center gap-3 border-t border-or/10 pt-3">
        {app.status !== "accepted" && (
          <StatusButton id={app.id} status="accepted" label="✓ Accepter & publier" variant="approve" />
        )}
        {app.status !== "rejected" && (
          <StatusButton
            id={app.id}
            status="rejected"
            label={app.status === "accepted" ? "✕ Refuser & dépublier" : "✕ Refuser"}
            variant="reject"
          />
        )}
        {app.status !== "read" && app.status !== "accepted" && (
          <StatusButton id={app.id} status="read" label="👁 Marquer comme lue" variant="neutral" />
        )}
        {app.status !== "new" && (
          <StatusButton id={app.id} status="new" label="↺ Remettre en nouvelle et dépublier" variant="neutral" />
        )}
        <div className="ml-auto">
          <DeleteButton action={deletePartnership.bind(null, String(app.id))} />
        </div>
      </div>
    </article>
  );
}

export default async function PartnershipAdminPage() {
  await requirePermission("partenaires");
  const apps = await getApplications();
  const published = await getPublishedPartners();

  const groups: { key: Status; title: string; subtitle: string }[] = [
    { key: "new", title: "Nouvelles demandes", subtitle: "À étudier" },
    { key: "read", title: "Lues", subtitle: "En cours d'examen" },
    { key: "accepted", title: "Acceptées", subtitle: "Partenaires publiés" },
    { key: "rejected", title: "Refusées", subtitle: "Conservées dans l'historique" },
  ];

  return (
    <div>
      <div>
        <p className="qp-overline mb-1">Alliances</p>
        <h1 className="qp-title text-4xl text-ink">Partenariats</h1>
        <p className="mt-2 text-sm text-greypearl">
          Étudiez les demandes de collaboration. Accepter une demande publie
          automatiquement le club sur la page Partenaires — vous pourrez ensuite
          ajouter son logo et peaufiner sa fiche.
        </p>
      </div>

      {/* Candidatures */}
      {apps.length === 0 ? (
        <div className="qp-card mt-8 p-10 text-center font-serif text-greypearl">
          Aucune demande de partenariat pour l&apos;instant.
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {groups.map((group) => {
            const list = apps.filter((a) => a.status === group.key);
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
                    Aucune demande dans cette catégorie.
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {list.map((app) => (
                      <ApplicationCard key={app.id} app={app} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Partenaires publiés */}
      <section className="mt-16">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="qp-title text-2xl text-ink">Partenaires publiés</h2>
            <p className="text-sm text-greypearl">
              Visibles sur la page Partenaires du site.
            </p>
          </div>
          <Link href="/admin/partenaires/new" className="qp-btn qp-btn--solid">
            + Ajouter manuellement
          </Link>
        </div>

        {published.length === 0 ? (
          <div className="qp-card p-8 text-center font-serif text-greypearl">
            Aucun partenaire publié pour l&apos;instant.
          </div>
        ) : (
          <div className="qp-card divide-y divide-or/10">
            {published.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-ink">{p.name}</p>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-or-deep underline break-all"
                    >
                      {p.url}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/partenaires/${p.id}`}
                    className="text-xs text-or-deep underline"
                  >
                    Modifier
                  </Link>
                  <DeleteButton
                    action={deleteResource.bind(null, "partenaires", String(p.id))}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
