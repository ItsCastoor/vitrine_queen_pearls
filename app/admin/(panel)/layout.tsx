import { requireAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar username={session.username ?? "Admin"} />
      <main className="flex-1 overflow-x-hidden px-6 py-8 lg:px-10">{children}</main>
    </div>
  );
}
