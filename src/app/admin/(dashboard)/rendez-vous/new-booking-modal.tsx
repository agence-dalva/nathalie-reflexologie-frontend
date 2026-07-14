"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  createBookingAdmin,
  getServicesAdmin,
  getTimeslots,
  type Service,
  type Timeslot,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PhoneInput } from "@/components/ui/phone-input";
import { formatDuration, formatPrice } from "@/lib/format";

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

function todayDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function NewBookingModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [date, setDate] = useState(todayDateKey());
  const [slots, setSlots] = useState<Timeslot[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Timeslot | null>(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    getServicesAdmin().then(setServices).catch(() => setServices([]));
  }, [open]);

  useEffect(() => {
    if (!open || !serviceId || !date) return;
    setSlots(null);
    setSelectedSlot(null);
    getTimeslots(serviceId, date)
      .then(setSlots)
      .catch(() => setSlots([]));
  }, [open, serviceId, date]);

  function reset() {
    setServiceId(null);
    setDate(todayDateKey());
    setSlots(null);
    setSelectedSlot(null);
    setFirstname("");
    setLastname("");
    setEmail("");
    setPhone("");
    setError(null);
  }

  async function handleSubmit() {
    if (!serviceId || !selectedSlot) return;
    setStatus("loading");
    setError(null);
    try {
      await createBookingAdmin({
        serviceId,
        startsAt: selectedSlot.startsAt,
        customerFirstname: firstname,
        customerLastname: lastname,
        customerEmail: email,
        customerPhone: phone || undefined,
      });
      reset();
      onCreated();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Impossible de créer le rendez-vous.",
      );
    } finally {
      setStatus("idle");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nouveau rendez-vous">
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-600">
            Prestation
          </label>
          <select
            value={serviceId ?? ""}
            onChange={(e) => setServiceId(Number(e.target.value) || null)}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
          >
            <option value="">Sélectionner…</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {formatDuration(s.durationMinutes)} — {formatPrice(s.price)}
              </option>
            ))}
          </select>
        </div>

        {serviceId && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-600">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
            />
          </div>
        )}

        {serviceId && date && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-600">
              Créneau
            </label>
            {slots === null && (
              <p className="text-sm text-stone-400">Chargement…</p>
            )}
            {slots !== null && slots.length === 0 && (
              <p className="text-sm text-stone-400">Aucun créneau disponible.</p>
            )}
            {slots !== null && slots.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.startsAt}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl border px-2 py-2 text-sm font-medium transition-colors ${
                      selectedSlot?.startsAt === slot.startsAt
                        ? "border-sage-600 bg-sage-600 text-white"
                        : "border-sage-200 bg-white text-sage-700 hover:bg-sage-50"
                    }`}
                  >
                    {timeFormatter.format(new Date(slot.startsAt))}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedSlot && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600">
                  Prénom
                </label>
                <input
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600">
                  Nom
                </label>
                <input
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600">
                  Téléphone
                </label>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
                />
              </div>
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={
            !selectedSlot || !firstname || !lastname || !email || status === "loading"
          }
          className="w-full"
        >
          {status === "loading" ? "Création…" : "Créer le rendez-vous"}
        </Button>
      </div>
    </Modal>
  );
}
