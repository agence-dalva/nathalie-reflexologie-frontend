"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/api";
import { useAdminSessionStore } from "@/stores/admin-session-store";

const links = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: "◧" },
  { href: "/admin/rendez-vous", label: "Rendez-vous", icon: "◷" },
  { href: "/admin/clients", label: "Clients", icon: "◐" },
  { href: "/admin/prestations", label: "Prestations", icon: "◈" },
  { href: "/admin/horaires", label: "Horaires", icon: "▤" },
  { href: "/admin/emails", label: "Emails", icon: "✉" },
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
              <span className="text-base">{link.icon}</span>
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
          className="mt-2 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          {loggingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </div>
    </aside>
  );
}
