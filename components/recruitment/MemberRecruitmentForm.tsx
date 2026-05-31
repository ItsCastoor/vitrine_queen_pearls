"use client";

import { MEMBER_FORM, MEMBER_FORM_INTRO } from "@/lib/recruitment/member-form";
import { submitMemberRecruitment } from "@/app/actions/public";
import { RecruitmentWizard } from "./RecruitmentWizard";

export function MemberRecruitmentForm() {
  return (
    <RecruitmentWizard
      sections={MEMBER_FORM}
      formTitle={MEMBER_FORM_INTRO.title}
      action={submitMemberRecruitment}
    />
  );
}
