import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Connexion — Queen Pearls",
};

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="qp-overline text-or">Espace privé</p>
          <h1 className="qp-serif mt-2 text-3xl text-ink">Queen Pearls</h1>
          <p className="mt-2 text-sm text-ink/60">
            Connectez-vous pour gérer le contenu du site.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
