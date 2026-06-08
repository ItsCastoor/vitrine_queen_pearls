import Link from "next/link";
import { ne } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { roles } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/permissions";
import { CreateAdminForm } from "../CreateAdminForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Nouveau compte admin" };

export default async function NouveauMembrePage() {
  await requireAdmin();
  await requirePermission("membres");

  // Exclure le rôle Superadmin — non assignable à la création
  const allRoles = await db
    .select()
    .from(roles)
    .where(ne(roles.name, "Superadmin"))
    .catch(() => []);

  return (
    <div className="max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/membres"
          className="text-greypearl hover:text-or-deep transition text-sm"
        >
          ← Comptes admin
        </Link>
      </div>

      <p className="qp-overline mb-1">Administration</p>
      <h1 className="qp-title text-4xl text-ink mb-2">Nouveau compte admin</h1>
      <p className="font-serif text-lg text-greypearl mb-8">
        Créez un compte et partagez le lien de configuration en privé avec la personne concernée.
      </p>

      <CreateAdminForm roles={allRoles} />
    </div>
  );
}
