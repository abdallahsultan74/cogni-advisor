"use client";

import {
  GraduationCap,
  Gauge,
  LogOut,
  PlusCircle,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type AdminSidebarProps = {
  adminName: string;
};

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Gauge },
  { label: "Add Student", href: "/admin/add-student", icon: GraduationCap },
  { label: "Add Advisor", href: "/admin/add-advisor", icon: PlusCircle },
  { label: "Users Management", icon: Users },
  { label: "Advisors", icon: UserCog },
  { label: "Permissions", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
];

export default function AdminSidebar({ adminName }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-gradient-to-b from-indigo-700 to-indigo-900 text-white">
      <div className="border-b border-white/20 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
            {adminName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{adminName}</p>
            <p className="text-xs text-white/70">Admin</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 space-y-1 px-3">
        {navItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href ?? "#"}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base transition ${
              href && pathname === href
                ? "bg-white/20 font-medium"
                : "text-white/85 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
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
