"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarClock,
  CalendarPlus,
  Clock,
  LayoutDashboard,
  LogOut,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";
import { logout } from "@/lib/api";
import { useAdminSessionStore } from "@/stores/admin-session-store";

const links = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/rendez-vous", label: "Rendez-vous", icon: CalendarClock },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/prestations", label: "Prestations", icon: Sparkles },
  { href: "/admin/horaires", label: "Horaires", icon: Clock },
  {
    href: "/admin/disponibilites",
    label: "Congés & créneaux",
    icon: CalendarPlus,
  },
  { href: "/admin/emails", label: "Emails", icon: Mail },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useAdminSessionStore((s) => s.admin);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sage-100 bg-white">
      <div className="border-b border-sage-100 px-6 py-6">
        <p className="font-display text-lg text-sage-700">Nathalie OHL</p>
        <p className="text-xs tracking-wide text-stone-400 uppercase">
          Back-office
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sage-50 text-sage-700"
                  : "text-stone-500 hover:bg-sage-50 hover:text-sage-700"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2 : 1.75}
                className={`shrink-0 ${active ? "text-sage-600" : "text-stone-400"}`}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sage-100 px-4 py-4">
        {admin && (
          <p className="truncate px-2 text-xs text-stone-400">{admin.email}</p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-2 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} strokeWidth={1.75} className="shrink-0" />
          {loggingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </div>
    </aside>
  );
}
