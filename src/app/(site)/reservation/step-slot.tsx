"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ApiError, getTimeslots, type Timeslot } from "@/lib/api";
import { useBookingStore } from "@/stores/booking-store";

// Construit la clé YYYY-MM-DD à partir des composants LOCAUX de la date
// (toISOString() convertit en UTC et décale le jour selon l'heure/le fuseau).
function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildUpcomingDays(count: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });
}

const dayFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  timeZone: "Europe/Paris",
});
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/Paris",
});
const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export function StepSlot() {
  const service = useBookingStore((s) => s.service);
  const selectedDate = useBookingStore((s) => s.selectedDate);
  const setSelectedDate = useBookingStore((s) => s.setSelectedDate);
  const setSelectedSlot = useBookingStore((s) => s.setSelectedSlot);

  const days = useMemo(() => buildUpcomingDays(21), []);
  const [slots, setSlots] = useState<Timeslot[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate && days.length > 0) {
      setSelectedDate(toDateKey(days[0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!service || !selectedDate) return;
    setSlots(null);
    setError(null);
    getTimeslots(service.id, selectedDate)
      .then(setSlots)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger les créneaux."),
      );
  }, [service, selectedDate]);

  if (!service) return null;

  return (
    <div>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        {days.map((day) => {
          const key = toDateKey(day);
          const isSelected = key === selectedDate;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDate(key)}
              className={`flex shrink-0 cursor-pointer flex-col items-center rounded-xl px-4 py-3 transition-colors ${
                isSelected
                  ? "bg-sage-600 text-white"
                  : "bg-sage-50 text-stone-600 hover:bg-sage-100"
              }`}
            >
              <span className="text-xs capitalize opacity-80">
                {dayFormatter.format(day)}
              </span>
              <span className="mt-1 text-sm font-semibold">
                {dateFormatter.format(day)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {error && <p className="text-center text-red-600">{error}</p>}

        {!error && slots === null && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-sage-50" />
            ))}
          </div>
        )}

        {slots !== null && slots.length === 0 && (
          <p className="py-8 text-center text-stone-500">
            Aucun créneau disponible ce jour-là. Essayez une autre date.
          </p>
        )}

        {slots !== null && slots.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {slots.map((slot, i) => (
              <motion.button
                key={slot.startsAt}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => setSelectedSlot(slot)}
                className="cursor-pointer rounded-xl border border-sage-200 bg-white px-3 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-600 hover:text-white"
              >
                {timeFormatter.format(new Date(slot.startsAt))}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
