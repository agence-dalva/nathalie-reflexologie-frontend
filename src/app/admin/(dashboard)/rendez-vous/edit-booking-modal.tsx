"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  getServicesAdmin,
  getTimeslots,
  updateBookingAdmin,
  type Booking,
  type Service,
  type Timeslot,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { formatDuration, formatPrice } from "@/lib/format";

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function EditBookingModal({
  booking,
  onClose,
  onUpdated,
}: {
  booking: Booking | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Timeslot[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Timeslot | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!booking) return;
    getServicesAdmin().then(setServices).catch(() => setServices([]));
    setServiceId(booking.serviceId);
    setDate(toDateKey(new Date(booking.startsAt)));
    setSelectedSlot({ startsAt: booking.startsAt, endsAt: booking.endsAt });
    setError(null);
  }, [booking]);

  useEffect(() => {
    if (!booking || !serviceId || !date) return;
    setSlots(null);
    getTimeslots(serviceId, date)
      .then((fetched) => {
        // On garde le créneau actuel du RDV dans la liste même s'il n'apparaît
        // pas comme "disponible" (puisqu'il est déjà occupé par ce RDV lui-même).
        const currentDateKey = toDateKey(new Date(booking.startsAt));
        const hasCurrentSlot = fetched.some((s) => s.startsAt === booking.startsAt);
        if (currentDateKey === date && !hasCurrentSlot) {
          setSlots([{ startsAt: booking.startsAt, endsAt: booking.endsAt }, ...fetched]);
        } else {
          setSlots(fetched);
        }
      })
      .catch(() => setSlots([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking, serviceId, date]);

  async function handleSubmit() {
    if (!booking || !serviceId || !selectedSlot) return;
    setStatus("loading");
    setError(null);
    try {
      await updateBookingAdmin(booking.id, {
        serviceId,
        startsAt: selectedSlot.startsAt,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Impossible de modifier ce rendez-vous.",
      );
    } finally {
      setStatus("idle");
    }
  }

  if (!booking) return null;

  return (
    <Modal open={Boolean(booking)} onClose={onClose} title="Modifier le rendez-vous">
      <div className="space-y-5">
        <p className="text-sm text-stone-500">
          {booking.customerFirstname} {booking.customerLastname} —{" "}
          {booking.customerEmail}
        </p>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-600">
            Prestation
          </label>
          <select
            value={serviceId ?? ""}
            onChange={(e) => setServiceId(Number(e.target.value) || null)}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {formatDuration(s.durationMinutes)} — {formatPrice(s.price)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-600">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSelectedSlot(null);
            }}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-sage-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-600">
            Créneau
          </label>
          {slots === null && <p className="text-sm text-stone-400">Chargement…</p>}
          {slots !== null && slots.length === 0 && (
            <p className="text-sm text-stone-400">Aucun créneau disponible ce jour-là.</p>
          )}
          {slots !== null && slots.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.startsAt}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`cursor-pointer rounded-xl border px-2 py-2 text-sm font-medium transition-colors ${
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedSlot || status === "loading"}
          className="w-full"
        >
          {status === "loading" ? "Enregistrement…" : "Enregistrer les modifications"}
        </Button>
      </div>
    </Modal>
  );
}
