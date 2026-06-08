import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/registry";
import { listRows } from "@/lib/admin/queries";
import { deleteResource } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/format";
import { requirePermission } from "@/lib/auth/permissions";
import type { ModuleKey } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

function renderCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (value instanceof Date) return formatDate(value);
  const s = String(value);
  return s.length > 60 ? s.slice(0, 60) + "…" : s;
}

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: resourceKey } = await params;
  const resource = getResource(resourceKey);
  if (!resource) notFound();

  await requirePermission(resourceKey as ModuleKey);

  const rows = await listRows(resourceKey);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="qp-overline mb-1">Gestion</p>
          <h1 className="qp-title text-4xl text-ink">{resource.label}</h1>
        </div>
        {resource.canCreate !== false && (
          <Link href={`/admin/${resourceKey}/new`} className="qp-btn qp-btn--solid">
            + Ajouter
          </Link>
        )}
      </div>

      <div className="qp-card mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-or/20 text-greypearl">
              {resource.listColumns.map((c) => (
                <th key={c.name} className="px-5 py-3 font-medium uppercase tracking-wider">
                  {c.label}
                </th>
              ))}
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={resource.listColumns.length + 1}
                  className="px-5 py-10 text-center font-serif text-greypearl"
                >
                  Aucun élément pour l&apos;instant.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const id = (row as { id: number }).id;
                return (
                  <tr key={id} className="border-b border-or/10 hover:bg-rose/20">
                    {resource.listColumns.map((c) => (
                      <td key={c.name} className="px-5 py-3 text-ink/80">
                        {renderCell(row[c.name])}
                      </td>
                    ))}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/${resourceKey}/${id}`}
                          className="text-xs text-or-deep underline"
                        >
                          Modifier
                        </Link>
                        <DeleteButton
                          action={deleteResource.bind(null, resourceKey, String(id))}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
