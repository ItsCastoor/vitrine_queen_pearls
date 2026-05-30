import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/registry";
import { getRow } from "@/lib/admin/queries";
import { saveResource } from "@/app/admin/actions";
import { ResourceForm } from "@/components/admin/ResourceForm";
import {
  getGalleryCategories,
  getCategoryOptions,
} from "@/lib/admin/gallery-helpers";

export const dynamic = "force-dynamic";

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = getResource("galerie-items");
  if (!resource) notFound();

  const row = await getRow("galerie-items", Number(id));
  if (!row) notFound();

  const categories = await getGalleryCategories();
  const action = saveResource.bind(null, "galerie-items", id);

  const fields = resource.fields.map((f) => {
    if (f.name === "categoryId") {
      return {
        ...f,
        label: "Catégorie",
        type: "select" as const,
        required: false,
        options: getCategoryOptions(categories),
      };
    }
    return f;
  });

  return (
    <div>
      <Link href="/admin/galerie-items" className="qp-navlink">
        ← {resource.label}
      </Link>
      <h1 className="qp-title mt-3 text-4xl text-ink">
        Modifier · {resource.labelSingular}
      </h1>

      <div className="mt-8">
        <ResourceForm
          action={action}
          fields={fields}
          values={{
            ...row,
            categoryId: row.categoryId ? String(row.categoryId) : "",
          }}
        />
      </div>
    </div>
  );
}
