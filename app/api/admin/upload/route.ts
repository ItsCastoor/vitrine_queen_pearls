import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { saveUpload, isUploadCategory } from "@/lib/uploads";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const categoryRaw = String(form.get("category") ?? "misc");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
  }

  const category = isUploadCategory(categoryRaw) ? categoryRaw : "misc";

  try {
    const saved = await saveUpload(file, category);
    return NextResponse.json(saved);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Échec de l'upload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
