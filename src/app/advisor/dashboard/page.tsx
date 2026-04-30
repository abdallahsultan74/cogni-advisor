import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  Check,
  X,
  Search,
  Users,
} from "lucide-react";

import { getAdvisorDataAction } from "@/lib/actions/advisor.action";
import { authOptions } from "@/lib/auth";
import AdvisorSidebar from "./_components/advisor-sidebar";

const getNumber = (value: unknown, fallback: number) => {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

const getString = (value: unknown, fallback: string) => {
  return typeof value === "string" && value.trim() ? value : fallback;
};

export default async function AdvisorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/login");
  }

  if (session.user.role?.toLowerCase() !== "advisor") {
    redirect("/student/dashboard");
  }

  const advisorDataResult = await getAdvisorDataAction(session.accessToken);
  const payload =
    advisorDataResult.status === "success" &&
    typeof advisorDataResult.data === "object" &&
    advisorDataResult.data !== null
      ? (advisorDataResult.data as Record<string, unknown>)
      : {};

  const advisorName = getString(
    [session.user.firstName ?? "", session.user.lastName ?? ""].join(" ").trim() ||
      session.user.name,
    "Advisor"
  );
  const initials = advisorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const activeStudents = getNumber(payload.activeStudents, 0);
  const pendingReviews = getNumber(payload.pendingReviews, 0);
  const atRiskStudents = getNumber(payload.atRiskStudents, 3);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <AdvisorSidebar advisorName={advisorName} />

        <section className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <p className="text-2xl font-bold">CogniAdvisor</p>

            <div className="flex w-full max-w-xl items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search students, plans..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-slate-500" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
                  {initials || "AD"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{advisorName}</p>
                  {session.user.email ? (
                    <p className="text-xs text-slate-500">{session.user.email}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-6">
            <div>
              <h1 className="text-4xl font-bold">Advisor Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">Pending Requests</p>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </div>
                <p className="mt-6 text-4xl font-bold text-orange-500">{pendingReviews}</p>
                <p className="mt-2 text-sm text-slate-500">Awaiting review</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">Total Students</p>
                  <Users className="h-4 w-4 text-sky-600" />
                </div>
                <p className="mt-6 text-4xl font-bold">{activeStudents}</p>
                <p className="mt-2 text-sm text-slate-500">Assigned to you</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">At-Risk Students</p>
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                </div>
                <p className="mt-6 text-4xl font-bold text-rose-600">{atRiskStudents}</p>
                <p className="mt-2 text-sm text-slate-500">Need attention</p>
              </article>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-3xl font-semibold">Recent Plan Requests</h2>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="px-2 py-3 font-semibold">Student</th>
                      <th className="px-2 py-3 font-semibold">GPA</th>
                      <th className="px-2 py-3 font-semibold">Credits</th>
                      <th className="px-2 py-3 font-semibold">Date</th>
                      <th className="px-2 py-3 font-semibold">Status</th>
                      <th className="px-2 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="px-2 py-3">
                        <p className="font-medium text-slate-900">Alice Johnson</p>
                        <p className="text-slate-500">S2024001</p>
                      </td>
                      <td className="px-2 py-3">3.85</td>
                      <td className="px-2 py-3">15</td>
                      <td className="px-2 py-3">2025-01-15</td>
                      <td className="px-2 py-3">
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          Pending
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <button className="rounded-lg border border-emerald-300 p-2 text-emerald-600 hover:bg-emerald-50">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg border border-rose-300 p-2 text-rose-600 hover:bg-rose-50">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b border-slate-200">
                      <td className="px-2 py-3">
                        <p className="font-medium text-slate-900">Bob Smith</p>
                        <p className="text-slate-500">S2024002</p>
                      </td>
                      <td className="px-2 py-3">3.20</td>
                      <td className="px-2 py-3">12</td>
                      <td className="px-2 py-3">2025-01-14</td>
                      <td className="px-2 py-3">
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          Pending
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <button className="rounded-lg border border-emerald-300 p-2 text-emerald-600 hover:bg-emerald-50">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg border border-rose-300 p-2 text-rose-600 hover:bg-rose-50">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-2 py-3">
                        <p className="font-medium text-slate-900">Carol Williams</p>
                        <p className="text-slate-500">S2024003</p>
                      </td>
                      <td className="px-2 py-3">2.95</td>
                      <td className="px-2 py-3">18</td>
                      <td className="px-2 py-3">2025-01-13</td>
                      <td className="px-2 py-3">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Approved
                        </span>
                      </td>
                      <td className="px-2 py-3 text-slate-400">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {advisorDataResult.status === "error" ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {advisorDataResult.errorMessage}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
