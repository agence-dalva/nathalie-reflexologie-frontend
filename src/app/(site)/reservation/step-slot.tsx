"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  ApiError,
  getAvailabilityDays,
  getTimeslots,
  type Timeslot,
} from "@/lib/api";
import { useBookingStore } from "@/stores/booking-store";

// Construit la clé YYYY-MM-DD à partir des composants LOCAUX de la date
// (toISOString() convertit en UTC et décale le jour selon l'heure/le fuseau).
function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Sur-couvre volontairement 6 semaines (lundi-dimanche) même si le mois n'en affiche que 5 — simple marge de sécurité pour le fetch, react-day-picker n'affiche que les semaines réellement nécessaires. */
function monthRangeDays(monthDate: Date): number {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // 0=lundi
  return firstWeekday + 42;
}

function monthGridStart(monthDate: Date): Date {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // 0=lundi
  const start = new Date(firstOfMonth);
  start.setDate(start.getDate() - firstWeekday);
  return start;
}

const dateHeadingFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
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

  const today = useMemo(() => startOfDay(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [slots, setSlots] = useState<Timeslot[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableDays, setAvailableDays] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (!service) return;
    setAvailableDays(null);
    const gridStart = monthGridStart(visibleMonth);
    getAvailabilityDays(service.id, toDateKey(gridStart), monthRangeDays(visibleMonth))
      .then((result) => setAvailableDays(new Set(result)))
      .catch(() => setAvailableDays(new Set()));
  }, [service, visibleMonth]);

  useEffect(() => {
    if (!availableDays || selectedDate) return;
    const firstAvailable = [...availableDays].sort()[0];
    if (firstAvailable) {
      setSelectedDate(firstAvailable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableDays]);

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

  const isLoadingAvailability = availableDays === null;
  const selectedAsDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`)
    : undefined;

  return (
    <div className="w-full">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-sage-100 bg-white sm:flex-row">
        {/* Calendrier */}
        <div className="p-6 sm:w-[60%] sm:p-8">
          <DayPicker
            mode="single"
            locale={undefined}
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            startMonth={new Date(today.getFullYear(), today.getMonth(), 1)}
            endMonth={new Date(today.getFullYear(), today.getMonth() + 2, 1)}
            selected={selectedAsDate}
            onSelect={(date) => date && setSelectedDate(toDateKey(date))}
            disabled={(date) => {
              const day = startOfDay(date);
              if (day < today) return true;
              if (isLoadingAvailability) return false;
              return !availableDays.has(toDateKey(day));
            }}
            showOutsideDays
            weekStartsOn={1}
            formatters={{
              formatWeekdayName: (date) =>
                date.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""),
              formatCaption: (date) =>
                date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                ) : (
                  <ChevronRight className="h-5 w-5" strokeWidth={2} />
                ),
            }}
            className={isLoadingAvailability ? "animate-pulse" : undefined}
            classNames={{
              root: "rdp-root w-full",
              month_caption:
                "relative flex items-center justify-center pt-1 pb-5 text-base font-semibold capitalize text-sage-800",
              nav: "absolute inset-x-0 top-0 z-10 flex items-center justify-between",
              button_previous:
                "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sage-600 transition-colors hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent",
              button_next:
                "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sage-600 transition-colors hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent",
              month_grid: "mt-2 w-full table-fixed border-collapse",
              weekday:
                "pb-3 text-center text-xs font-medium tracking-wide text-stone-400 uppercase",
              day: "p-1.5 text-center",
              day_button:
                "mx-auto flex aspect-square w-full max-w-12 cursor-pointer items-center justify-center rounded-full text-base font-medium text-sage-700 transition-colors hover:bg-sage-100",
              selected:
                "[&>button]:bg-sage-600 [&>button]:text-white [&>button]:font-semibold [&>button]:hover:bg-sage-600",
              today:
                "[&>button]:relative [&>button]:after:absolute [&>button]:after:bottom-1.5 [&>button]:after:h-1 [&>button]:after:w-1 [&>button]:after:rounded-full [&>button]:after:bg-terracotta-500",
              outside: "[&>button]:text-transparent [&>button]:pointer-events-none",
              disabled:
                "[&>button]:cursor-not-allowed [&>button]:text-stone-300 [&>button]:hover:bg-transparent",
            }}
          />
        </div>

        {/* Créneaux horaires */}
        <div className="border-t border-sage-100 bg-sage-50/50 p-6 sm:w-[40%] sm:border-t-0 sm:border-l sm:p-8">
          <p className="text-sm font-semibold capitalize text-sage-800">
            {selectedDate
              ? dateHeadingFormatter.format(new Date(`${selectedDate}T00:00:00`))
              : "Sélectionnez une date"}
          </p>

          <div className="mt-5">
            {error && <p className="text-center text-red-600">{error}</p>}

            {!error && slots === null && (
              <div className="grid grid-cols-2 gap-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-11 animate-pulse rounded-xl bg-white" />
                ))}
              </div>
            )}

            {slots !== null && slots.length === 0 && (
              <p className="py-8 text-center text-sm text-stone-500">
                Aucun créneau disponible ce jour-là. Essayez une autre date.
              </p>
            )}

            {slots !== null && slots.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5">
                {slots.map((slot, i) => (
                  <motion.button
                    key={slot.startsAt}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelectedSlot(slot)}
                    className="cursor-pointer rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-600 hover:text-white"
                  >
                    {timeFormatter.format(new Date(slot.startsAt))}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
