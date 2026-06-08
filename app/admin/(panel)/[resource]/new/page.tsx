import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/registry";
import { saveResource } from "@/app/admin/actions";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { requirePermission } from "@/lib/auth/permissions";
import type { ModuleKey } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export default async function NewResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: resourceKey } = await params;
  const resource = getResource(resourceKey);
  if (!resource || resource.canCreate === false) notFound();

  await requirePermission(resourceKey as ModuleKey);

  const action = saveResource.bind(null, resourceKey, null);

  return (
    <div>
      <Link href={`/admin/${resourceKey}`} className="qp-navlink">
        ← {resource.label}
      </Link>
      <h1 className="qp-title mt-3 text-4xl text-ink">
        Nouveau · {resource.labelSingular}
      </h1>

      <div className="mt-8">
        <ResourceForm action={action} fields={resource.fields} values={{}} />
      </div>
    </div>
  );
}
