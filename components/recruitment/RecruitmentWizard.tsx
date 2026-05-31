"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import type { FormSection, Question } from "@/lib/recruitment/member-form";
import type { ActionState } from "@/app/actions/public";

const initial: ActionState = { ok: false };

type Answers = Record<string, string | string[]>;

const inputClass =
  "w-full rounded-lg border border-or/30 bg-white/70 px-4 py-3 outline-none transition focus:border-or";

function isQuestionRequired(question: Question, allAnswers: Answers): boolean {
  let isRequired = question.required ?? false;
  if (!isRequired && question.requiredIf) {
    const condValue = allAnswers[question.requiredIf.field];
    const expectedValue = question.requiredIf.value;
    if (Array.isArray(expectedValue)) {
      isRequired = Array.isArray(condValue)
        ? expectedValue.some((v) => condValue.includes(v))
        : expectedValue.includes(String(condValue));
    } else {
      isRequired = condValue === expectedValue;
    }
  }
  return isRequired;
}

function QuestionField({
  question,
  value,
  onChange,
  error,
  allAnswers,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  error?: string;
  allAnswers: Answers;
}) {
  const isRequired = isQuestionRequired(question, allAnswers);

  return (
    <fieldset className="space-y-2">
      <legend className="whitespace-pre-line font-serif text-lg text-ink">
        {question.label}
        {isRequired && <span className="text-rose-pearl"> *</span>}
      </legend>
      {question.help && (
        <p className="text-sm text-greypearl">{question.help}</p>
      )}

      {question.type === "short" && (
        <input
          className={inputClass}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.type === "para" && (
        <textarea
          rows={4}
          className={inputClass}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.type === "radio" && (
        <div className="space-y-2">
          {question.options?.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                value === opt
                  ? "border-or bg-or/10"
                  : "border-or/20 bg-white/50 hover:border-or/50"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                className="accent-or"
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              <span className="text-ink/80">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === "checkbox" && (
        <div className="space-y-2">
          {question.options?.map((opt) => {
            const arr = Array.isArray(value) ? value : [];
            const checked = arr.includes(opt);
            return (
              <label
                key={opt}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition ${
                  checked
                    ? "border-or bg-or/10"
                    : "border-or/20 bg-white/50 hover:border-or/50"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 accent-or"
                  checked={checked}
                  onChange={() =>
                    onChange(
                      checked ? arr.filter((x) => x !== opt) : [...arr, opt],
                    )
                  }
                />
                <span className="text-ink/80">{opt}</span>
              </label>
            );
          })}
        </div>
      )}

      {error && <p className="text-sm text-rose-pearl">{error}</p>}
    </fieldset>
  );
}

export function RecruitmentWizard({
  sections,
  formTitle,
  action,
  formId,
  successTitle = "Candidature envoyée 🤍",
  successMessage = "Merci pour ta candidature aux Queen Pearls. Le staff l'étudiera avec soin et reviendra vers toi sur Discord.",
}: {
  sections: FormSection[];
  formTitle: string;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  formId?: string;
  successTitle?: string;
  successMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const total = sections.length;
  const section = sections[step];
  const isLast = step === total - 1;
  const payload = useMemo(() => JSON.stringify(answers), [answers]);

  function setAnswer(id: string, v: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: v }));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function validateSection(): boolean {
    const next: Record<string, string> = {};
    for (const q of section.questions) {
      if (!isQuestionRequired(q, answers)) continue;

      const v = answers[q.id];
      if (q.type === "checkbox") {
        const arr = Array.isArray(v) ? v : [];
        if (q.requireAll && arr.length < (q.options?.length ?? 0)) {
          next[q.id] = "Merci de cocher toutes les cases.";
        } else if (!q.requireAll && arr.length === 0) {
          next[q.id] = "Merci de sélectionner au moins une option.";
        }
      } else if (typeof v !== "string" || v.trim().length === 0) {
        next[q.id] = "Cette réponse est obligatoire.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (validateSection()) {
      setStep((s) => Math.min(s + 1, total - 1));
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (state.ok) {
    return (
      <div className="qp-card p-10 text-center">
        <span className="qp-pearl mx-auto mb-5 block" />
        <h3 className="qp-title text-2xl text-ink">{successTitle}</h3>
        <p className="mt-3 font-serif text-lg text-ink/80">{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => {
        if (!validateSection()) {
          e.preventDefault();
        }
      }}
      className="qp-card p-6 sm:p-8"
    >
      <input type="hidden" name="payload" value={payload} />
      {formId && <input type="hidden" name="formId" value={formId} />}

      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <p className="qp-overline">
            Étape {step + 1} / {total}
          </p>
          <p className="text-xs text-greypearl">{formTitle}</p>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-or/15">
          <div
            className="h-full rounded-full bg-or transition-all duration-500"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
        <h3 className="qp-title mt-5 text-2xl text-ink">{section.title}</h3>
      </div>

      <div className="space-y-7">
        {section.questions.map((q) => (
          <QuestionField
            key={q.id}
            question={q}
            value={answers[q.id]}
            error={errors[q.id]}
            onChange={(v) => setAnswer(q.id, v)}
            allAnswers={answers}
          />
        ))}
      </div>

      {state.error && (
        <p className="mt-6 text-sm text-rose-pearl">{state.error}</p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-or/10 pt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="qp-btn disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Précédent
        </button>

        {isLast ? (
          <button
            type="submit"
            disabled={pending}
            className="qp-btn qp-btn--solid"
          >
            {pending ? "Envoi…" : "Envoyer ma candidature"}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="qp-btn qp-btn--solid"
          >
            Suivant →
          </button>
        )}
      </div>
    </form>
  );
}
