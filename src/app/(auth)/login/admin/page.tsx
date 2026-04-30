"use client";

import { Shield } from "lucide-react";

import RoleLoginForm from "../_components/role-login-form";

export default function AdminLoginPage() {
  return (
    <RoleLoginForm
      title="Admin Portal Login"
      description="Sign in to manage the platform"
      identifierLabel="Admin Email"
      identifierPlaceholder="admin@cogniadvisor.com"
      icon={Shield}
      accentClassName="bg-indigo-50 text-indigo-600 border-indigo-200"
      buttonClassName="from-indigo-500 to-indigo-700"
    />
  );
}
