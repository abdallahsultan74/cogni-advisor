"use client";

import { useMemo } from "react";
import CreateUserForm from "@/app/admin/_components/create-user-form";
import { useCreateAdvisorMutation } from "@/app/admin/_hooks/use-create-user-mutations";
import { extractCreatedUser } from "@/app/admin/_utils/extract-created-user";

export default function AddAdvisorFormClient() {
  const mutation = useCreateAdvisorMutation();
  const createdUser = useMemo(
    () => extractCreatedUser(mutation.data, "Advisor"),
    [mutation.data]
  );

  return (
    <CreateUserForm
      title="Add Advisor"
      description="Create a new advisor account and set required profile information."
      submitLabel="Create Advisor"
      successMessage="Advisor created successfully."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      error={mutation.error instanceof Error ? mutation.error : null}
      createdUser={createdUser}
      onSubmit={(values) => mutation.mutate(values)}
      onCreateAnother={() => mutation.reset()}
    />
  );
}
