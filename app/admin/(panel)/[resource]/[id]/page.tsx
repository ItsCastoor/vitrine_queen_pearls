import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/registry";
import { getRow } from "@/lib/admin/queries";
import { saveResource } from "@/app/admin/actions";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { requirePermission } from "@/lib/auth/permissions";
import type { ModuleKey } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: resourceKey, id } = await params;
  const resource = getResource(resourceKey);
  if (!resource) notFound();

  await requirePermission(resourceKey as ModuleKey);

  const row = await getRow(resourceKey, Number(id));
  if (!row) notFound();

  const action = saveResource.bind(null, resourceKey, id);

  return (
    <div>
      <Link href={`/admin/${resourceKey}`} className="qp-navlink">
        ← {resource.label}
      </Link>
      <h1 className="qp-title mt-3 text-4xl text-ink">
        Modifier · {resource.labelSingular}
      </h1>

      <div className="mt-8">
        <ResourceForm action={action} fields={resource.fields} values={row} />
      </div>
    </div>
  );
}
