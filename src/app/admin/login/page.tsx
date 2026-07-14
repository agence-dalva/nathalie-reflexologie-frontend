"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, login } from "@/lib/api";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      await login(email, password);
      router.push(searchParams.get("next") ?? "/admin/dashboard");
      router.refresh();
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof ApiError
          ? "Email ou mot de passe incorrect."
          : "Une erreur est survenue, merci de réessayer.",
      );
    }
  }

  return (
    <div className="w-full max-w-sm rounded-3xl border border-sage-100 bg-white p-8 sm:p-10">
      <p className="text-sm font-semibold tracking-[0.2em] text-sage-500 uppercase">
        Back-office
      </p>
      <h1 className="mt-2 font-display text-2xl text-sage-800">Connexion</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-stone-600"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none transition-colors focus:border-sage-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-stone-600"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none transition-colors focus:border-sage-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sage-50 px-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
