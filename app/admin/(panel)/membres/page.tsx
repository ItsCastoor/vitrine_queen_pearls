import Link from "next/link";
import { db } from "@/lib/db/client";
import { admins, roles, staff } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/permissions";
import { toggleAdminEnabled, deleteAdmin } from "./actions";
import { RoleSelect, StaffSelect } from "./MemberSelects";
import { DeleteAdminButton } from "./DeleteAdminButton";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [allAdmins, allRoles, allStaff] = await Promise.all([
      db.select().from(admins),
      db.select().from(roles),
      db.select({ id: staff.id, name: staff.name }).from(staff),
    ]);
    return { allAdmins, allRoles, allStaff };
  } catch {
    return { allAdmins: [], allRoles: [], allStaff: [] };
  }
}

export default async function MembresPage() {
  const session = await requireAdmin();
  await requirePermission("membres");
  const { allAdmins, allRoles, allStaff } = await getData();
  const currentAdminId = session.adminId;

  const rolesMap = Object.fromEntries(allRoles.map((r) => [r.id, r.name]));

  return (
    <div>
      <p className="qp-overline mb-1">Administration</p>
      <h1 className="qp-title text-4xl text-ink">Comptes admin</h1>
      <p className="mt-2 font-serif text-lg text-greypearl">
        Gérez les accès à l&apos;espace admin — activez, désactivez ou changez le rôle de chaque compte.
        Désactiver un compte ne retire pas la personne de la page Équipe publique.
      </p>

      <div className="mt-6">
        <Link
          href="/admin/membres/nouveau"
          className="qp-btn qp-btn--solid inline-flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          Nouveau compte admin
        </Link>
      </div>

      {/* Liste des comptes */}
      {allAdmins.length === 0 ? (
        <div className="qp-card mt-8 p-10 text-center font-serif text-greypearl">
          Aucun compte admin.
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          <h2 className="qp-title text-2xl text-ink">Comptes existants</h2>
          {allAdmins.map((admin) => (
            <article key={admin.id} className="qp-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span
                  className={`h-3 w-3 shrink-0 rounded-full ${
                    admin.isEnabled ? "bg-emerald-400" : "bg-rose-pearl"
                  }`}
                />
                <div>
                  <p className="font-medium text-ink">
                    {admin.username}
                    {admin.setupToken && (
                      <span className="ml-2 rounded-full bg-or/15 px-2 py-0.5 text-xs text-or-deep">
                        Accès non configuré
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-greypearl">
                    Rôle :{" "}
                    {admin.roleId ? (
                      rolesMap[admin.roleId] ?? "—"
                    ) : (
                      <span className="text-rose-pearl">Aucun rôle</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {admin.id === currentAdminId ? (
                  <span className="rounded-full border border-or/20 px-4 py-1.5 text-xs text-greypearl italic">
                    Compte protégé — non modifiable
                  </span>
                ) : (
                  <>
                    {/* Activer / Désactiver */}
                    <form action={toggleAdminEnabled.bind(null, String(admin.id), !admin.isEnabled)}>
                      <button
                        type="submit"
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                          admin.isEnabled
                            ? "border border-rose-pearl/40 text-rose-pearl hover:bg-rose/20"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {admin.isEnabled ? "Désactiver" : "Activer"}
                      </button>
                    </form>

                    {/* Changer le rôle */}
                    <RoleSelect
                      adminId={admin.id}
                      currentRoleId={admin.roleId ?? null}
                      roles={allRoles}
                    />

                    {/* Lier fiche membre */}
                    <StaffSelect
                      adminId={admin.id}
                      currentStaffId={admin.staffId ?? null}
                      staffList={allStaff}
                    />

                    {/* Supprimer */}
                    <DeleteAdminButton id={admin.id} username={admin.username} action={deleteAdmin} />
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
