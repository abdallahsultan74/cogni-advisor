"use server";

import type { LoginRequest, LoginResponse } from "@/lib/types/auth";

export async function loginStudentAction(
  payload: LoginRequest
): Promise<LoginResponse> {
  const API_BASE_URL = process.env.COGNI_API_BASE_URL;
  if (!API_BASE_URL) {
    throw new Error("Missing COGNI_API_BASE_URL environment variable.");
  }

  const LOGIN_API_URL = `${API_BASE_URL}/api/auth/login`;

  const response = await fetch(LOGIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Login failed. Please check your credentials.";

    try {
      const errorData = (await response.json()) as { message?: string };

      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      // Fall back to the default message when the API doesn't return JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as LoginResponse;
}
