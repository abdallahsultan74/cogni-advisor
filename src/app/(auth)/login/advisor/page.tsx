"use client";

import { UserRound } from "lucide-react";

import RoleLoginForm from "../_components/role-login-form";

export default function AdvisorLoginPage() {
  return (
    <RoleLoginForm
      title="Advisor Portal Login"
      description="Sign in to manage your students"
      identifierLabel="Advisor ID"
      identifierPlaceholder="ADV-2026-01"
      icon={UserRound}
      accentClassName="bg-slate-50 text-slate-600 border-slate-200"
      buttonClassName="from-slate-700 to-slate-900"
    />
  );
}
