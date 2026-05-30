import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/registry";
import { saveResource } from "@/app/admin/actions";
import { ResourceForm } from "@/components/admin/ResourceForm";
import {
  getGalleryCategories,
  getCategoryOptions,
} from "@/lib/admin/gallery-helpers";

export const dynamic = "force-dynamic";

export default async function NewGalleryItemPage() {
  const resource = getResource("galerie-items");
  if (!resource) notFound();

  const categories = await getGalleryCategories();
  const action = saveResource.bind(null, "galerie-items", "new");

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
        Nouveau · {resource.labelSingular}
      </h1>

      <div className="mt-8">
        <ResourceForm action={action} fields={fields} values={{}} />
      </div>
    </div>
  );
}
