"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  createService,
  updateService,
  type Service,
  type ServiceInput,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

function toFormState(service: Service | null): ServiceInput {
  return {
    name: service?.name ?? "",
    description: service?.description ?? "",
    durationMinutes: service?.durationMinutes ?? 60,
    bufferMinutes: service?.bufferMinutes ?? 15,
    price: service ? Number(service.price) : 0,
    active: service?.active ?? true,
  };
}

export function ServiceFormModal({
  open,
  onClose,
  onSaved,
  service,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  service: Service | null;
}) {
  const [form, setForm] = useState<ServiceInput>(toFormState(service));
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(toFormState(service));
      setError(null);
    }
  }, [open, service]);

  async function handleSubmit() {
    setStatus("loading");
    setError(null);
    try {
      if (service) {
        await updateService(service.id, form);
      } else {
        await createService(form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Impossible d'enregistrer la prestation.",
      );
    } finally {
      setStatus("idle");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={service ? "Modifier la prestation" : "Nouvelle prestation"}
    >
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-600">
            Nom
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-600">
            Description
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-600">
              Durée (min)
            </label>
            <input
              type="number"
              min={5}
              value={form.durationMinutes}
              onChange={(e) =>
                setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))
              }
              className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-600">
              Battement (min)
            </label>
            <input
              type="number"
              min={0}
              value={form.bufferMinutes}
              onChange={(e) =>
                setForm((f) => ({ ...f, bufferMinutes: Number(e.target.value) }))
              }
              className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-600">
              Prix (€)
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="h-4 w-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
          />
          Prestation active (visible sur le site)
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!form.name || status === "loading"}
          className="w-full"
        >
          {status === "loading" ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </Modal>
  );
}
