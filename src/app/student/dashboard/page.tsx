import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  Bell,
  BookOpenCheck,
  CalendarCheck,
  Check,
  Lightbulb,
  Search,
} from "lucide-react";

import { getStudentDataAction } from "@/lib/actions/student.action";
import { authOptions } from "@/lib/auth";
import StudentSidebar from "./_components/student-sidebar";

const getNumber = (value: unknown, fallback: number) => {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

const getString = (value: unknown, fallback: string) => {
  return typeof value === "string" && value.trim() ? value : fallback;
};

const getObject = (value: unknown) => {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
};

const getFirstObjectFromArray = (value: unknown) => {
  return Array.isArray(value) && value.length > 0 ? getObject(value[0]) : {};
};

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/login");
  }

  if (session.user.role?.toLowerCase() !== "student") {
    redirect("/advisor/dashboard");
  }

  const studentDataResult = await getStudentDataAction(session.accessToken);

  const payload =
    studentDataResult.status === "success" &&
    typeof studentDataResult.data === "object" &&
    studentDataResult.data !== null
      ? (studentDataResult.data as Record<string, unknown>)
      : {};

  const user = getObject(payload.user);
  const student = getObject(payload.student);
  const nestedData = getObject(payload.data);
  const nestedUser = getObject(nestedData.user);
  const nestedStudent = getObject(nestedData.student);
  const firstDataItem = getFirstObjectFromArray(payload.data);
  const firstNestedDataItem = getFirstObjectFromArray(nestedData.data);

  const candidateSources = [
    user,
    student,
    nestedUser,
    nestedStudent,
    firstDataItem,
    firstNestedDataItem,
  ];

  const getFromSources = (...keys: string[]) => {
    for (const source of candidateSources) {
      for (const key of keys) {
        const value = source[key];
        if (typeof value === "string" && value.trim()) {
          return value;
        }
      }
    }
    return "";
  };

  const emailFromPayload = getString(
    getFromSources("email") ??
      payload.email ??
      nestedData.email,
    ""
  );
  const emailFromSession = getString(session.user.email, "");
  const displayEmail = emailFromPayload || emailFromSession;
  const emailNameFallback = emailFromPayload
    ? emailFromPayload.split("@")[0]
    : emailFromSession
      ? emailFromSession.split("@")[0]
    : "";

  const fullNameFromParts = [
    getString(session.user.firstName, "") ||
      getString(getFromSources("first_name", "firstName"), ""),
    getString(session.user.lastName, "") ||
      getString(getFromSources("last_name", "lastName"), ""),
  ]
    .join(" ")
    .trim();

  const fullName = getString(
    fullNameFromParts ||
      getString(
        getFromSources("name") ?? session.user.name,
        ""
      ) ||
      emailNameFallback,
    "Student"
  );
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const currentGpa = getNumber(payload.currentGpa ?? payload.gpa, 0);
  const gpaDelta = getNumber(payload.gpaDelta, 0);
  const completedCourses = getNumber(payload.completedCourses, 0);
  const totalCredits = getNumber(payload.totalCredits, 120);
  const inProgressCourses = getNumber(payload.inProgressCourses, 0);
  const creditsEarned = getNumber(payload.creditsEarned, 0);
  const completionRate =
    totalCredits > 0 ? Math.round((creditsEarned / totalCredits) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <StudentSidebar studentName={fullName} />

        <section className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <p className="text-2xl font-bold">CogniAdvisor</p>

            <div className="flex w-full max-w-xl items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search courses, students..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-slate-500" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">
                  {initials || "ST"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{fullName}</p>
                  {displayEmail ? (
                    <p className="text-xs text-slate-500">{displayEmail}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-6">
            <div>
              <h1 className="text-4xl font-bold">Welcome back, {fullName}</h1>
              <p className="mt-1 text-lg text-slate-500">
                Here&apos;s your academic overview
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Current GPA</p>
                <p className="mt-6 text-4xl font-bold">{currentGpa.toFixed(2)}</p>
                <p className="mt-2 text-sm text-emerald-600">
                  {gpaDelta >= 0 ? "+" : ""}
                  {gpaDelta.toFixed(2)} from last semester
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Completed Courses</p>
                  <BookOpenCheck className="h-4 w-4 text-sky-600" />
                </div>
                <p className="mt-6 text-4xl font-bold">{completedCourses}</p>
                <p className="mt-2 text-sm text-slate-500">Out of {totalCredits} credits</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">In Progress</p>
                  <CalendarCheck className="h-4 w-4 text-orange-500" />
                </div>
                <p className="mt-6 text-4xl font-bold">{inProgressCourses}</p>
                <p className="mt-2 text-sm text-slate-500">This semester</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Credits Earned</p>
                  <Lightbulb className="h-4 w-4 text-violet-500" />
                </div>
                <p className="mt-6 text-4xl font-bold">{creditsEarned}</p>
                <p className="mt-2 text-sm text-slate-500">{completionRate}% complete</p>
              </article>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-2xl font-semibold">Quick Actions</h2>
                <div className="mt-5 space-y-3">
                  <button className="flex w-full items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-left text-sm font-medium hover:bg-slate-50">
                    <BookOpenCheck className="h-4 w-4 text-slate-500" />
                    Review Study Plan
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-left text-sm font-medium hover:bg-slate-50">
                    <Lightbulb className="h-4 w-4 text-slate-500" />
                    Get Recommendations
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-2xl font-semibold">Recent Activity</h2>
                <ul className="mt-5 space-y-4 text-sm">
                  <li className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <div>
                      <p>CS202 marked as completed</p>
                      <p className="text-slate-500">3 hours ago</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Lightbulb className="mt-0.5 h-4 w-4 text-sky-600" />
                    <div>
                      <p>New recommendation: Advanced Algorithms</p>
                      <p className="text-slate-500">2 hours ago</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CalendarCheck className="mt-0.5 h-4 w-4 text-orange-500" />
                    <div>
                      <p>Study plan submitted for review</p>
                      <p className="text-slate-500">1 hour ago</p>
                    </div>
                  </li>
                </ul>
              </section>
            </div>

            {studentDataResult.status === "error" ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {studentDataResult.errorMessage}
              </div>
            ) : null}

            {studentDataResult.status === "success" ? (
              <details className="rounded-xl border border-slate-300 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                  Student API payload
                </summary>
                <pre className="mt-3 overflow-auto rounded-md bg-slate-50 p-3 text-xs text-slate-700">
                  {JSON.stringify(studentDataResult.data, null, 2)}
                </pre>
              </details>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
