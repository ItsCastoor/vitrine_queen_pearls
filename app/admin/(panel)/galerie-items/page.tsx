import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { galleryItems, type GalleryItem } from "@/lib/db/schema";
import { deleteResource } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getGalleryCategories } from "@/lib/admin/gallery-helpers";
import { requirePermission } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

async function getItems(): Promise<GalleryItem[]> {
  try {
    return await db
      .select()
      .from(galleryItems)
      .orderBy(desc(galleryItems.id));
  } catch {
    return [];
  }
}

export default async function GalleryItemsListPage() {
  await requirePermission("galerie-items");
  const items = await getItems();
  const categories = await getGalleryCategories();
  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="qp-title text-4xl text-ink">Galerie · Médias</h1>
        <Link href="/admin/galerie-items/new" className="qp-btn qp-btn--solid">
          + Nouveau média
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="qp-card mt-8 p-10 text-center font-serif text-greypearl">
          Aucun média pour l&apos;instant.
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-or/20 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-nacre-deep/30">
              <tr className="border-b border-or/10">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-or-deep">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-or-deep">
                  Légende
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-or-deep">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-or-deep">
                  Catégorie
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-or-deep">
                  Accueil
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-or-deep">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-or/10">
              {items.map((item) => {
                const catName = item.categoryId
                  ? catMap.get(item.categoryId) ?? `ID ${item.categoryId}`
                  : "Hors catégorie";
                return (
                  <tr key={item.id} className="hover:bg-nacre-deep/10">
                    <td className="px-4 py-3 text-sm text-ink">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-ink">
                      {item.caption || <span className="italic text-greypearl">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">
                      {item.type === "photo" ? "Photo" : "Vidéo"}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">
                      <span
                        className={
                          item.categoryId
                            ? ""
                            : "italic text-greypearl"
                        }
                      >
                        {catName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">
                      {item.showOnHome ? "Oui" : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/galerie-items/${item.id}`}
                          className="text-sm text-or-deep underline hover:text-or"
                        >
                          Modifier
                        </Link>
                        <DeleteButton
                          action={deleteResource.bind(
                            null,
                            "galerie-items",
                            String(item.id),
                          )}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
