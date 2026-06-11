"use client";

import {
  PARTNERSHIP_FORM,
  PARTNERSHIP_FORM_INTRO,
} from "@/lib/partnership/partnership-form";
import { submitPartnership } from "@/app/actions/public";
import { RecruitmentWizard } from "@/components/recruitment/RecruitmentWizard";

export function PartnershipForm() {
  return (
    <RecruitmentWizard
      sections={PARTNERSHIP_FORM}
      formTitle={PARTNERSHIP_FORM_INTRO.title}
      action={submitPartnership}
      successTitle="Proposition envoyée 🤍"
      successMessage="Merci pour votre proposition ! Votre demande sera étudiée avec attention par l'équipe des Queen Pearls. À bientôt pour écrire un nouveau souvenir ensemble."
    />
  );
}
