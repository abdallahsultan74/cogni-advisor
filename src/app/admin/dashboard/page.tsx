import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  Bell,
  Check,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import AdminSidebar from "./_components/admin-sidebar";

const getNumber = (value: unknown, fallback: number) => {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

const getString = (value: unknown, fallback: string) => {
  return typeof value === "string" && value.trim() ? value : fallback;
};

export default async function AdminDashboardPage() {
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

  const totalUsers = getNumber(undefined, 120);
  const totalAdvisors = getNumber(undefined, 24);
  const flaggedAccounts = getNumber(undefined, 3);
  const activeSessions = getNumber(undefined, 58);

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

          <div className="space-y-6 p-6">
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="mt-1 text-lg text-slate-500">
                Platform operations and system overview
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">Total Users</p>
                  <Users className="h-4 w-4 text-sky-600" />
                </div>
                <p className="mt-6 text-4xl font-bold">{totalUsers}</p>
                <p className="mt-2 text-sm text-slate-500">Across all roles</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">Advisors</p>
                  <UserCog className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="mt-6 text-4xl font-bold">{totalAdvisors}</p>
                <p className="mt-2 text-sm text-slate-500">Active advisors</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">Flagged Accounts</p>
                  <ShieldAlert className="h-4 w-4 text-rose-600" />
                </div>
                <p className="mt-6 text-4xl font-bold text-rose-600">{flaggedAccounts}</p>
                <p className="mt-2 text-sm text-slate-500">Need admin review</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">Active Sessions</p>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="mt-6 text-4xl font-bold">{activeSessions}</p>
                <p className="mt-2 text-sm text-slate-500">Users online now</p>
              </article>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-3xl font-semibold">Recent Admin Activity</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <div>
                    <p>User role updated successfully</p>
                    <p className="text-slate-500">15 minutes ago</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <ShieldAlert className="mt-0.5 h-4 w-4 text-rose-600" />
                  <div>
                    <p>Suspicious account flagged by system</p>
                    <p className="text-slate-500">1 hour ago</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <UserCog className="mt-0.5 h-4 w-4 text-indigo-600" />
                  <div>
                    <p>New advisor profile approved</p>
                    <p className="text-slate-500">Today</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
