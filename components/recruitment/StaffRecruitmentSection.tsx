"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { STAFF_FORMS } from "@/lib/recruitment/staff-forms";
import { submitStaffRecruitment } from "@/app/actions/public";
import { RecruitmentWizard } from "./RecruitmentWizard";

export function StaffRecruitmentSection({ staffOpen = {} }: { staffOpen?: Record<string, boolean> }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const active = STAFF_FORMS.find((f) => f.id === activeId) ?? null;

  function select(id: string) {
    setActiveId(id);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {STAFF_FORMS.map((form) => {
          const isActive = form.id === activeId;
          const isOpen = staffOpen[form.id];

          return (
            <article
              key={form.id}
              className={`qp-card overflow-hidden transition ${
                isOpen && isActive ? "ring-2 ring-or" : ""
              }`}
            >
              <div className="relative aspect-4/5 w-full overflow-hidden">
                <Image
                  src={form.image}
                  alt={`Instructrice de ${form.discipline}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 text-center">
                <p className="qp-overline">Instructrice</p>
                <h3 className="qp-title mt-1 text-2xl text-ink">
                  {form.discipline}
                </h3>
                {isOpen ? (
                  <button
                    type="button"
                    onClick={() => select(form.id)}
                    className={`qp-btn mt-5 w-full ${
                      isActive ? "" : "qp-btn--solid"
                    }`}
                  >
                    {isActive ? "Formulaire ouvert ↓" : "Nous rejoindre"}
                  </button>
                ) : (
                  <div className="mt-5 px-4 py-2.5 rounded-lg bg-rose/20 text-rose-pearl text-sm font-medium border border-rose-pearl/30">
                    Candidature fermée
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div ref={formRef} className="scroll-mt-24">
        {active && staffOpen[active.id] && (
          <div className="mx-auto mt-12 max-w-2xl">
            <h3 className="qp-title text-center text-3xl text-ink">
              {active.title}
            </h3>
            <p className="mt-2 text-center font-serif text-lg text-greypearl">
              {active.intro}
            </p>
            <div className="mt-8">
              <RecruitmentWizard
                key={active.id}
                sections={active.sections}
                formTitle={active.title}
                action={submitStaffRecruitment}
                formId={active.id}
                successMessage={active.successMessage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
