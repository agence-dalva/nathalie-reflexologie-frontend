"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ApiError, getClients, type ClientListItem } from "@/lib/api";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger les clients."),
      );
  }, []);

  const filtered = clients?.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.firstname.toLowerCase().includes(q) ||
      c.lastname.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone ?? "").includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-sage-800 sm:text-3xl">
          Clients
        </h1>
      </div>
      <p className="mt-2 text-stone-500">
        Chaque prise de rendez-vous crée ou met à jour automatiquement une fiche client.
      </p>

      <div className="mt-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un nom, un email, un téléphone…"
          className="w-full max-w-sm rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
        />
      </div>

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!error && clients === null && (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-sage-50" />
          ))}
        </div>
      )}

      {filtered && filtered.length === 0 && (
        <p className="mt-10 text-center text-stone-400">Aucun client trouvé.</p>
      )}

      {filtered && filtered.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-sage-100 bg-white">
          <table className="w-full min-w-140 text-left text-sm">
            <thead>
              <tr className="border-b border-sage-100 text-xs font-semibold tracking-wide text-stone-400 uppercase">
                <th className="px-6 py-3 font-semibold">Nom</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Téléphone</th>
                <th className="px-6 py-3 font-semibold">Rendez-vous</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {filtered.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 font-medium text-stone-700">
                    {client.firstname} {client.lastname}
                  </td>
                  <td className="px-6 py-4 text-stone-500">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-stone-500">
                    {client.phone ?? "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-stone-500">
                    {client._count.bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="text-sage-600 hover:underline"
                    >
                      Voir la fiche
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
