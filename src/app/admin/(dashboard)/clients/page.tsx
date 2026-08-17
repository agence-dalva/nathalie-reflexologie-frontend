"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { ApiError, getClients, type ClientListItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ImportClientsModal } from "./import-clients-modal";

const PAGE_SIZE = 20;

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [importOpen, setImportOpen] = useState(false);

  function refresh() {
    return getClients()
      .then(setClients)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger les clients."),
      );
  }

  useEffect(() => {
    refresh();
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

  const pageCount = Math.max(1, Math.ceil((filtered?.length ?? 0) / PAGE_SIZE));
  // Borné pendant le rendu : la liste peut rétrécir (recherche, import, refresh).
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const pageClients = filtered?.slice(firstIndex, firstIndex + PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-sage-800 sm:text-3xl">
          Clients
          {clients && (
            <span className="ml-3 align-middle text-sm font-normal text-stone-400">
              {clients.length}
            </span>
          )}
        </h1>

        <Button
          type="button"
          variant="secondary"
          withArrow={false}
          onClick={() => setImportOpen(true)}
          className="gap-2"
        >
          <Upload size={16} />
          Importer un CSV
        </Button>
      </div>
      <p className="mt-2 text-stone-500">
        Chaque prise de rendez-vous crée ou met à jour automatiquement une fiche
        client. Vous pouvez aussi importer un fichier CSV, par exemple l&apos;export
        de votre ancien outil.
      </p>

      <div className="mt-6">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
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

      <ImportClientsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={refresh}
        existingEmails={
          new Set((clients ?? []).map((c) => c.email.toLowerCase()))
        }
      />

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
              {pageClients?.map((client) => {
                const imported = client.importedBookingsCount ?? 0;
                const total = client._count.bookings + imported;
                return (
                  <tr key={client.id}>
                    <td className="px-6 py-4 font-medium text-stone-700">
                      {client.firstname} {client.lastname}
                    </td>
                    <td className="px-6 py-4 text-stone-500">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-stone-500">
                      {client.phone ?? "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-stone-500">
                      {total}
                      {imported > 0 && (
                        <span
                          className="ml-1.5 text-xs text-stone-400"
                          title={`${imported} séance${imported > 1 ? "s" : ""} reprise${imported > 1 ? "s" : ""} de l'ancien outil`}
                        >
                          {client._count.bookings === 0
                            ? "repris"
                            : `dont ${imported} repris`}
                        </span>
                      )}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered && filtered.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-stone-400">
            Client{filtered.length > 1 ? "s" : ""} {firstIndex + 1}–
            {Math.min(firstIndex + PAGE_SIZE, filtered.length)} sur{" "}
            {filtered.length}
            {search.trim() && clients && ` (${clients.length} au total)`}
          </p>

          {pageCount > 1 && (
            <div className="flex items-center gap-1">
              <PagerButton
                label="Page précédente"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft size={18} />
              </PagerButton>
              <p className="px-2 text-xs text-stone-500">
                Page {currentPage} sur {pageCount}
              </p>
              <PagerButton
                label="Page suivante"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRight size={18} />
              </PagerButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PagerButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sage-600 transition-colors hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
