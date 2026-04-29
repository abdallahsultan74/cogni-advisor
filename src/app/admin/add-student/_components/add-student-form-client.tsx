"use client";

import { useMemo } from "react";
import CreateUserForm from "@/app/admin/_components/create-user-form";
import { useCreateStudentMutation } from "@/app/admin/_hooks/use-create-user-mutations";
import { extractCreatedUser } from "@/app/admin/_utils/extract-created-user";

export default function AddStudentFormClient() {
  const mutation = useCreateStudentMutation();
  const createdUser = useMemo(
    () => extractCreatedUser(mutation.data, "Student"),
    [mutation.data]
  );

  return (
    <CreateUserForm
      title="Add Student"
      description="Create a new student account and assign initial profile details."
      submitLabel="Create Student"
      successMessage="Student created successfully."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      error={mutation.error instanceof Error ? mutation.error : null}
      createdUser={createdUser}
      onSubmit={(values) => mutation.mutate(values)}
      onCreateAnother={() => mutation.reset()}
    />
  );
}
