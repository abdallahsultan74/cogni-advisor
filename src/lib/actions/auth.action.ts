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

  let response = await fetch(LOGIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let errorData: { message?: string; error?: string } | null = null;
  if (!response.ok) {
    try {
      errorData = await response.json();
    } catch {
      // Fall back to null when the API doesn't return JSON.
    }

    if (
      (errorData?.message === "Missing authorization header" ||
        errorData?.error === "Missing authorization header" ||
        response.status === 401) &&
      LOGIN_API_URL.includes("supabase.co")
    ) {
      const fallbackUrl = LOGIN_API_URL.replace(
        API_BASE_URL,
        "https://cogni-advisor-backend.vercel.app"
      );
      response = await fetch(fallbackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }
      }
    }
  }

  if (!response.ok) {
    let message = "Login failed. Please check your credentials.";
    if (errorData?.message) {
      message = errorData.message;
    }
    throw new Error(message);
  }

  return (await response.json()) as LoginResponse;
}
