"use client";

import { useFormStatus } from "react-dom";
import type { FieldDef } from "@/lib/admin/registry";
import { ImageField } from "./ImageField";

function toDateTimeLocal(value: unknown): string {
  if (!value) return "";
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function toDateLocal(value: unknown): string {
  if (!value) return "";
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="qp-btn qp-btn--solid">
      {pending ? "Enregistrement…" : "Enregistrer"}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none focus:border-or";

export function ResourceForm({
  action,
  fields,
  values,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: FieldDef[];
  values: Record<string, unknown>;
}) {
  return (
    <form action={action} className="qp-card max-w-2xl space-y-6 p-8">
      {fields.map((f) => {
        const v = values[f.name];
        return (
          <div key={f.name}>
            <label className="qp-overline mb-2 block">
              {f.label} {f.required && "*"}
            </label>

            {f.type === "textarea" && (
              <textarea
                name={f.name}
                rows={4}
                required={f.required}
                defaultValue={(v as string) ?? ""}
                className={inputClass}
              />
            )}

            {f.type === "markdown" && (
              <textarea
                name={f.name}
                rows={10}
                required={f.required}
                defaultValue={(v as string) ?? ""}
                className={`${inputClass} font-mono text-sm`}
              />
            )}

            {f.type === "text" && (
              <input
                name={f.name}
                type="text"
                required={f.required}
                defaultValue={(v as string) ?? ""}
                className={inputClass}
              />
            )}

            {f.type === "number" && (
              <input
                name={f.name}
                type="number"
                required={f.required}
                defaultValue={(v as number) ?? 0}
                className={inputClass}
              />
            )}

            {f.type === "boolean" && (
              <label className="flex items-center gap-3">
                <input
                  name={f.name}
                  type="checkbox"
                  defaultChecked={Boolean(v)}
                  className="h-5 w-5 accent-[color:var(--qp-or)]"
                />
                <span className="text-sm text-ink/70">Oui</span>
              </label>
            )}

            {f.type === "datetime" && (
              <input
                name={f.name}
                type="datetime-local"
                defaultValue={toDateTimeLocal(v)}
                className={inputClass}
              />
            )}

            {f.type === "date" && (
              <input
                name={f.name}
                type="date"
                defaultValue={toDateLocal(v)}
                className={inputClass}
              />
            )}

            {f.type === "select" && (
              <select
                name={f.name}
                defaultValue={(v as string) ?? f.options?.[0]?.value ?? ""}
                className={inputClass}
              >
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}

            {f.type === "image" && (
              <ImageField
                name={f.name}
                defaultValue={(v as string) ?? ""}
                category={f.uploadCategory}
              />
            )}

            {f.help && <p className="mt-1 text-xs text-greypearl">{f.help}</p>}
          </div>
        );
      })}

      <SubmitButton />
    </form>
  );
}
