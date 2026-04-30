type AdvisorDataResult =
  | {
      status: "error";
      errorMessage: string;
    }
  | {
      status: "success";
      data: unknown;
    };

export async function getAdvisorDataAction(
  accessToken: string
): Promise<AdvisorDataResult> {
  const apiBaseUrl = process.env.COGNI_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("Missing COGNI_API_BASE_URL environment variable.");
  }

  let response = await fetch(`${apiBaseUrl}/api/users/advisors`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  const isSupabaseError =
    !response.ok &&
    response.status === 401 &&
    apiBaseUrl.includes("supabase.co");

  if (isSupabaseError) {
    const fallbackUrl = "https://cogni-advisor-backend.vercel.app/api/users/advisors";
    response = await fetch(fallbackUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (response.status === 403) {
    return {
      status: "success",
      data: {},
    };
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : "Failed to load advisor data.";

    return {
      status: "error",
      errorMessage: message,
    };
  }

  return {
    status: "success",
    data,
  };
}
