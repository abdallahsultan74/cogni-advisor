"use client";

import {
  Bell,
  BookOpen,
  Gauge,
  Lightbulb,
  LineChart,
  LogOut,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";

type StudentSidebarProps = {
  studentName: string;
};

const navItems = [
  { label: "Dashboard", icon: Gauge, isActive: true },
  { label: "My Study Plan", icon: BookOpen },
  { label: "Recommendations", icon: Lightbulb },
  { label: "Academic Progress", icon: LineChart },
  { label: "Notifications", icon: Bell },
  { label: "Profile", icon: User },
];

export default function StudentSidebar({ studentName }: StudentSidebarProps) {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-gradient-to-b from-sky-600 to-indigo-700 text-white">
      <div className="border-b border-white/20 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
            {studentName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{studentName}</p>
            <p className="text-xs text-white/70">Student</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 space-y-1 px-3">
        {navItems.map(({ label, icon: Icon, isActive }) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base transition ${
              isActive
                ? "bg-white/20 font-medium"
                : "text-white/85 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-3 pb-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base text-white/85 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
