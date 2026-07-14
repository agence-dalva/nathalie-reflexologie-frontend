"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ApiError, getCurrentAdmin } from "@/lib/api";
import { useAdminSessionStore } from "@/stores/admin-session-store";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const admin = useAdminSessionStore((s) => s.admin);
  const setAdmin = useAdminSessionStore((s) => s.setAdmin);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getCurrentAdmin()
      .then((user) => {
        setAdmin(user);
        setStatus("ready");
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/admin/login");
          return;
        }
        setStatus("ready");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading" || !admin) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage-200 border-t-sage-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <AdminSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="flex items-center border-b border-sage-100 bg-white px-5 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sage-700"
          >
            <span className="block h-4 w-6">
              <span className="block h-0.5 w-6 bg-current" />
              <span className="mt-1.5 block h-0.5 w-6 bg-current" />
              <span className="mt-1.5 block h-0.5 w-6 bg-current" />
            </span>
          </button>
          <p className="ml-3 font-display text-sage-700">Back-office</p>
        </div>

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
