import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Bell, Search } from "lucide-react";

import { authOptions } from "@/lib/auth";
import AdminSidebar from "../dashboard/_components/admin-sidebar";
import AddAdvisorFormClient from "./_components/add-advisor-form-client";

const getString = (value: unknown, fallback: string) => {
  return typeof value === "string" && value.trim() ? value : fallback;
};

export default async function AddAdvisorPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const adminName = getString(
    [session.user.firstName ?? "", session.user.lastName ?? ""].join(" ").trim() ||
      session.user.name,
    "Admin"
  );
  const initials = adminName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <AdminSidebar adminName={adminName} />

        <section className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <p className="text-2xl font-bold">CogniAdvisor</p>

            <div className="flex w-full max-w-xl items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search users, advisors..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-slate-500" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-700 text-xs font-semibold text-white">
                  {initials || "AD"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{adminName}</p>
                  {session.user.email ? (
                    <p className="text-xs text-slate-500">{session.user.email}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            <AddAdvisorFormClient />
          </div>
        </section>
      </div>
    </main>
  );
}
