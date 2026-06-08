"use client";

import { changeAdminRole, linkStaffProfile } from "./actions";

export function RoleSelect({
  adminId,
  currentRoleId,
  roles,
}: {
  adminId: number;
  currentRoleId: number | null;
  roles: { id: number; name: string }[];
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await changeAdminRole(String(adminId), String(fd.get("roleId") ?? ""));
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        name="roleId"
        defaultValue={currentRoleId ?? ""}
        className="rounded-lg border border-or/30 bg-white/80 px-3 py-1.5 text-sm outline-none focus:border-or"
      >
        <option value="">— Aucun rôle —</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      <button type="submit" className="qp-btn !py-1.5 !px-3 !text-xs">
        Appliquer
      </button>
    </form>
  );
}

export function StaffSelect({
  adminId,
  currentStaffId,
  staffList,
}: {
  adminId: number;
  currentStaffId: number | null;
  staffList: { id: number; name: string }[];
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await linkStaffProfile(String(adminId), String(fd.get("staffId") ?? ""));
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        name="staffId"
        defaultValue={currentStaffId ?? ""}
        className="rounded-lg border border-or/30 bg-white/80 px-3 py-1.5 text-sm outline-none focus:border-or"
      >
        <option value="">— Aucune fiche —</option>
        {staffList.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <button type="submit" className="qp-btn !py-1.5 !px-3 !text-xs">
        Lier
      </button>
    </form>
  );
}
