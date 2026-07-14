import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// La session est un cookie posé par le backend Railway, sur un domaine
// distinct du frontend Vercel. Ce middleware tourne côté serveur Vercel et
// ne voit donc jamais ce cookie cross-domain — impossible de garder les
// routes /admin ici. La protection réelle se fait côté client dans
// AdminShell (src/app/admin/(dashboard)/admin-shell.tsx), qui appelle
// /auth/me avec credentials: include (le navigateur, lui, envoie bien le
// cookie cross-origin) et redirige vers /admin/login si la session est
// invalide.
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
