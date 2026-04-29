import type { LoginRequest, LoginResponse } from "@/lib/types/auth";

const LOGIN_API_URL = "https://cogni-advisor-backend.vercel.app/api/auth/login";

export async function loginStudentAction(
  payload: LoginRequest
): Promise<LoginResponse> {
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
