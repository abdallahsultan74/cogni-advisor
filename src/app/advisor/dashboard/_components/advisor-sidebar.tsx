"use client";

import {
  FileText,
  Gauge,
  MessageSquare,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";

type AdvisorSidebarProps = {
  advisorName: string;
};

const navItems = [
  { label: "Dashboard", icon: Gauge },
  { label: "Plan Requests", icon: FileText, isActive: true, badge: 2 },
  { label: "My Students", icon: Users },
  { label: "Messages", icon: MessageSquare },
  { label: "Settings", icon: Settings },
];

export default function AdvisorSidebar({ advisorName }: AdvisorSidebarProps) {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-gradient-to-b from-slate-700 to-slate-900 text-white">
      <div className="border-b border-white/20 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
            {advisorName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{advisorName}</p>
            <p className="text-xs text-white/70">Advisor</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 space-y-1 px-3">
        {navItems.map(({ label, icon: Icon, isActive, badge }) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base transition ${
              isActive
                ? "bg-white/20 font-medium"
                : "text-white/85 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {badge ? (
              <span className="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-2 text-xs font-semibold text-white">
                {badge}
              </span>
            ) : null}
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
