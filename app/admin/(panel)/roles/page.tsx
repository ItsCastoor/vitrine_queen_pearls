import { db } from "@/lib/db/client";
import { roles, rolePermissions } from "@/lib/db/schema";
import { requirePermission, ALL_MODULES } from "@/lib/auth/permissions";
import type { ModuleKey } from "@/lib/auth/permissions";
import { createRole, deleteRole, togglePermission } from "./actions";
import { DeleteRoleButton } from "./DeleteRoleButton";

export const dynamic = "force-dynamic";

async function getRolesWithPermissions() {
  try {
    const allRoles = await db.select().from(roles);
    const allPerms = await db.select().from(rolePermissions);
    return allRoles.map((r) => ({
      ...r,
      permissions: new Set(
        allPerms.filter((p) => p.roleId === r.id).map((p) => p.moduleKey),
      ),
    }));
  } catch {
    return [];
  }
}

export default async function RolesPage() {
  await requirePermission("roles");
  const rolesData = await getRolesWithPermissions();

  return (
    <div>
      <p className="qp-overline mb-1">Administration</p>
      <h1 className="qp-title text-4xl text-ink">Rôles &amp; permissions</h1>
      <p className="mt-2 font-serif text-lg text-greypearl">
        Créez des rôles et définissez précisément les modules accessibles pour chaque rôle.
      </p>

      {/* Créer un rôle */}
      <form action={createRole} className="qp-card mt-8 max-w-xl p-6">
        <h2 className="qp-title text-xl text-ink mb-4">Nouveau rôle</h2>
        <div className="space-y-4">
          <div>
            <label className="qp-overline mb-2 block">Nom du rôle *</label>
            <input
              name="name"
              required
              placeholder="ex. Éditeur, Modératrice…"
              className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
            />
          </div>
          <div>
            <label className="qp-overline mb-2 block">Description</label>
            <input
              name="description"
              placeholder="Description optionnelle"
              className="w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or"
            />
          </div>
          <button type="submit" className="qp-btn qp-btn--solid">
            Créer le rôle
          </button>
        </div>
      </form>

      {/* Matrice des permissions */}
      {rolesData.length === 0 ? (
        <div className="qp-card mt-8 p-10 text-center font-serif text-greypearl">
          Aucun rôle créé pour l&apos;instant. Commencez par créer un rôle ci-dessus.
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {rolesData.map((role) => (
            <section key={role.id} className="qp-card overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-or/10 px-6 py-4">
                <div>
                  <h2 className="qp-title text-2xl text-ink flex items-center gap-3">
                    {role.name}
                    {role.name === "Superadmin" && (
                      <span className="rounded-full border border-or/20 px-3 py-0.5 text-xs font-normal text-greypearl italic">
                        Rôle système — non modifiable
                      </span>
                    )}
                  </h2>
                  {role.description && (
                    <p className="mt-0.5 text-sm text-greypearl">{role.description}</p>
                  )}
                </div>
                {role.name !== "Superadmin" && (
                  <DeleteRoleButton id={role.id} name={role.name} action={deleteRole} />
                )}
              </div>

              <div className="grid gap-0 divide-y divide-or/10 px-6 py-4">
                <p className="qp-overline mb-3">Modules accessibles</p>
                <div className="grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-3">
                  {ALL_MODULES.map((mod) => {
                    const granted = role.permissions.has(mod.key);
                    const locked = role.name === "Superadmin";
                    return (
                      <form
                        key={mod.key}
                        action={locked ? undefined : togglePermission.bind(
                          null,
                          role.id,
                          mod.key as ModuleKey,
                          !granted,
                        )}
                      >
                        <button
                          type="submit"
                          disabled={locked}
                          className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition ${
                            granted
                              ? "border-or/40 bg-or/10 text-or-deep"
                              : "border-or/10 bg-transparent text-ink/40 hover:border-or/20 hover:text-ink/60"
                          } ${locked ? "cursor-default opacity-70" : ""}`}
                        >
                          <span
                            className={`h-4 w-4 shrink-0 rounded border transition ${
                              granted
                                ? "border-or bg-or"
                                : "border-ink/20 bg-transparent"
                            }`}
                          >
                            {granted && (
                              <svg viewBox="0 0 16 16" fill="none" className="text-white">
                                <path
                                  d="M3 8l3 3 7-6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          {mod.label}
                        </button>
                      </form>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
