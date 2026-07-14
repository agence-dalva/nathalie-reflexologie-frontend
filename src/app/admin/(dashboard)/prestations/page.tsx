"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  deleteService,
  getServicesAdmin,
  type Service,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatDuration, formatPrice } from "@/lib/format";
import { ServiceFormModal } from "./service-form-modal";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function refresh() {
    getServicesAdmin()
      .then(setServices)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger les prestations."),
      );
  }

  useEffect(() => {
    refresh();
  }, []);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setModalOpen(true);
  }

  async function handleDelete(service: Service) {
    if (!confirm(`Supprimer « ${service.name} » ?`)) return;
    setDeletingId(service.id);
    setDeleteError(null);
    try {
      await deleteService(service.id);
      refresh();
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : "Impossible de supprimer cette prestation.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-sage-800 sm:text-3xl">
          Prestations
        </h1>
        <Button type="button" onClick={openCreate}>
          + Nouvelle prestation
        </Button>
      </div>

      {error && <p className="mt-6 text-red-600">{error}</p>}
      {deleteError && <p className="mt-4 text-red-600">{deleteError}</p>}

      {!error && services === null && (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-sage-50" />
          ))}
        </div>
      )}

      {services && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-sage-100 bg-white">
          <table className="w-full min-w-180 text-left text-sm">
            <thead>
              <tr className="border-b border-sage-100 text-xs font-semibold tracking-wide text-stone-400 uppercase">
                <th className="px-6 py-3 font-semibold">Nom</th>
                <th className="px-6 py-3 font-semibold">Description</th>
                <th className="px-6 py-3 font-semibold">Durée</th>
                <th className="px-6 py-3 font-semibold">Prix</th>
                <th className="px-6 py-3 font-semibold">Statut</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 font-medium text-stone-700">
                    {service.name}
                  </td>
                  <td className="max-w-xs px-6 py-4 text-stone-500">
                    {service.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-stone-500">
                    {formatDuration(service.durationMinutes)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-stone-700">
                    {formatPrice(service.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.active ? (
                      <span className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(service)}
                        className="text-sage-600 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(service)}
                        disabled={deletingId === service.id}
                        className="text-red-600 hover:underline"
                      >
                        {deletingId === service.id ? "…" : "Supprimer"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ServiceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={refresh}
        service={editing}
      />
    </div>
  );
}
