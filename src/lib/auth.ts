import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE_URL =
  "https://kqpvsncbbjuxzlmsysri.supabase.co/functions/v1";
const JSON_HEADER = { "Content-Type": "application/json" };

type LoginRole = "student" | "advisor" | "admin";

type BackendLoginResponse = {
  token: string;
  email?: string;
  user?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  message?: string;
};

type AuthorizedUser = {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: LoginRole;
  token: string;
};

const resolveEndpointByRole = (role: LoginRole) => {
  if (role === "admin") {
    return `${API_BASE_URL}/api/auth/login/admin`;
  }

  return role === "advisor"
    ? `${API_BASE_URL}/api/auth/login/advisor`
    : `${API_BASE_URL}/api/auth/login/student`;
};

const parseRole = (rawRole?: string): LoginRole | null => {
  if (rawRole === "student" || rawRole === "advisor" || rawRole === "admin") {
    return rawRole;
  }
  return null;
};

const authorizeWithBackend = async (params: {
  email: string;
  password: string;
  role: LoginRole;
}): Promise<AuthorizedUser> => {
  const response = await fetch(resolveEndpointByRole(params.role), {
    method: "POST",
    body: JSON.stringify({ email: params.email, password: params.password }),
    headers: JSON_HEADER,
  });

  let payload: BackendLoginResponse | null = null;
  try {
    payload = (await response.json()) as BackendLoginResponse;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      payload?.message ?? "Login failed. Please check your credentials."
    );
  }

  if (!payload?.token) {
    throw new Error("Login succeeded but no token was returned.");
  }

  return {
    id: `${params.role}-${params.email}`,
    email: payload.email ?? payload.user?.email ?? params.email,
    name:
      [payload.user?.first_name ?? "", payload.user?.last_name ?? ""]
        .join(" ")
        .trim() || undefined,
    firstName: payload.user?.first_name ?? undefined,
    lastName: payload.user?.last_name ?? undefined,
    role: params.role,
    token: payload.token,
  };
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;
        const role = parseRole(credentials?.role);

        if (!email || !password || !role) {
          throw new Error("Email, password, and role are required.");
        }

        return authorizeWithBackend({ email, password, role });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name ?? undefined;
        token.firstName = user.firstName ?? undefined;
        token.lastName = user.lastName ?? undefined;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        email: token.email as string,
        name: (token.name as string | undefined) ?? session.user?.name,
        firstName:
          (token.firstName as string | undefined) ?? session.user?.firstName,
        lastName: (token.lastName as string | undefined) ?? session.user?.lastName,
        role: token.role as LoginRole,
      };
      session.accessToken = token.accessToken as string;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
