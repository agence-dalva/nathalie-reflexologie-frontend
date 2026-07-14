import { create } from "zustand";
import type { AdminUser } from "@/lib/api";

type AdminSessionState = {
  admin: AdminUser | null;
  setAdmin: (admin: AdminUser | null) => void;
};

export const useAdminSessionStore = create<AdminSessionState>((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
}));
