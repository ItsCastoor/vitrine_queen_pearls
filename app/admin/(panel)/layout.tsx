import { requireAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getNavBadges } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();
  const badges = await getNavBadges();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar
        username={session.username ?? "Admin"}
        badges={badges}
        permissions={session.permissions ?? []}
      />
      <main className="flex-1 overflow-x-hidden px-6 py-8 lg:px-10 min-w-0">{children}</main>
    </div>
  );
}
