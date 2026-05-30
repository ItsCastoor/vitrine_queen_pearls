import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  recruitmentApplications,
  type RecruitmentApplication,
} from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { MEMBER_FORM } from "@/lib/recruitment/member-form";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { setApplicationStatus, deleteApplication } from "./actions";

export const dynamic = "force-dynamic";

type Status = RecruitmentApplication["status"];

async function getApplications(): Promise<RecruitmentApplication[]> {
  try {
    return await db
      .select()
      .from(recruitmentApplications)
      .orderBy(desc(recruitmentApplications.createdAt));
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
    <form action={setApplicationStatus.bind(null, String(id), status)}>
      <button
        type="submit"
        className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${styles}`}
      >
        {label}
      </button>
    </form>
  );
}

function ApplicationCard({ app }: { app: RecruitmentApplication }) {
  const meta = STATUS_META[app.status];
  const answers = parseAnswers(app.answers);

  return (
    <article className="qp-card flex flex-col gap-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="qp-title text-lg text-ink">{app.pseudo}</span>
          {app.discord && (
            <span className="text-sm text-greypearl">· {app.discord}</span>
          )}
          {app.age && (
            <span className="text-sm text-greypearl">· {app.age} ans</span>
          )}
          <span
            className={`rounded-full border px-3 py-0.5 text-[11px] font-medium uppercase tracking-wider ${meta.badge}`}
          >
            {meta.label}
          </span>
        </div>
        <span className="text-xs text-greypearl">
          {formatDate(app.createdAt)}
        </span>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-or-deep">
          Voir les réponses ▾
        </summary>
        <div className="mt-4 space-y-6">
          {MEMBER_FORM.map((section) => (
            <section key={section.id}>
              <h4 className="qp-overline mb-2">{section.title}</h4>
              <dl className="space-y-3">
                {section.questions.map((q) => {
                  const value = answers[q.id];
                  const display = Array.isArray(value)
                    ? value.join(", ")
                    : (value ?? "");
                  return (
                    <div key={q.id}>
                      <dt className="text-sm font-medium text-ink/70">
                        {q.label}
                      </dt>
                      <dd className="mt-0.5 whitespace-pre-line font-serif text-ink/90">
                        {display || (
                          <span className="italic text-greypearl">—</span>
                        )}
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
          <StatusButton
            id={app.id}
            status="accepted"
            label="✓ Accepter"
            variant="approve"
          />
        )}
        {app.status !== "rejected" && (
          <StatusButton
            id={app.id}
            status="rejected"
            label="✕ Refuser"
            variant="reject"
          />
        )}
        {app.status !== "read" && app.status !== "accepted" && (
          <StatusButton
            id={app.id}
            status="read"
            label="👁 Marquer comme lue"
            variant="neutral"
          />
        )}
        {app.status !== "new" && (
          <StatusButton
            id={app.id}
            status="new"
            label="↺ Remettre en nouvelle"
            variant="neutral"
          />
        )}
        <div className="ml-auto">
          <DeleteButton action={deleteApplication.bind(null, String(app.id))} />
        </div>
      </div>
    </article>
  );
}

export default async function RecruitmentAdminPage() {
  const apps = await getApplications();

  const groups: { key: Status; title: string; subtitle: string }[] = [
    { key: "new", title: "Nouvelles candidatures", subtitle: "À étudier" },
    { key: "read", title: "Lues", subtitle: "En cours d'examen" },
    { key: "accepted", title: "Acceptées", subtitle: "Recrues validées" },
    { key: "rejected", title: "Refusées", subtitle: "Conservées dans l'historique" },
  ];

  return (
    <div>
      <div>
        <p className="qp-overline mb-1">Recrutement</p>
        <h1 className="qp-title text-4xl text-ink">Candidatures · Membres</h1>
        <p className="mt-2 text-sm text-greypearl">
          Consultez les réponses détaillées et validez ou refusez chaque
          candidature. L&apos;historique est conservé.
        </p>
      </div>

      {apps.length === 0 ? (
        <div className="qp-card mt-8 p-10 text-center font-serif text-greypearl">
          Aucune candidature reçue pour l&apos;instant.
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
                    Aucune candidature dans cette catégorie.
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
    </div>
  );
}
