import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { admins } from "@/lib/db/schema";
import { SetupForm } from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const [admin] = await db
    .select({ id: admins.id, username: admins.username, isEnabled: admins.isEnabled })
    .from(admins)
    .where(eq(admins.setupToken, token))
    .limit(1);

  if (!admin) notFound();

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="qp-pearl mx-auto mb-4 block" />
          <h1 className="qp-title text-4xl text-ink">Bienvenue, {admin.username}</h1>
          <p className="mt-3 font-serif text-lg text-greypearl">
            Choisissez votre mot de passe pour accéder à l&apos;espace admin.
          </p>
        </div>
        {!admin.isEnabled ? (
          <div className="qp-card p-8 text-center font-serif text-greypearl">
            Ce compte est désactivé. Contactez un administrateur.
          </div>
        ) : (
          <SetupForm token={token} />
        )}
      </div>
    </div>
  );
}
