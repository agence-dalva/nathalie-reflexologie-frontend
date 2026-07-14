"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
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
const dateHeadingFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
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
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date());
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Timeslot[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Timeslot | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!booking) return;
    getServicesAdmin().then(setServices).catch(() => setServices([]));
    setServiceId(booking.serviceId);
    const bookingDate = new Date(booking.startsAt);
    setDate(toDateKey(bookingDate));
    setVisibleMonth(new Date(bookingDate.getFullYear(), bookingDate.getMonth(), 1));
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

  const selectedAsDate = date ? new Date(`${date}T00:00:00`) : undefined;

  return (
    <Modal
      open={Boolean(booking)}
      onClose={onClose}
      title="Modifier le rendez-vous"
      maxWidth="max-w-3xl"
    >
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

        <div className="flex flex-col overflow-hidden rounded-2xl border border-sage-100 sm:flex-row">
          {/* Calendrier */}
          <div className="p-5 sm:w-[58%] sm:p-6">
            <DayPicker
              mode="single"
              locale={undefined}
              month={visibleMonth}
              onMonthChange={setVisibleMonth}
              selected={selectedAsDate}
              onSelect={(newDate) => {
                if (!newDate) return;
                setDate(toDateKey(newDate));
                setSelectedSlot(null);
              }}
              showOutsideDays
              weekStartsOn={1}
              formatters={{
                formatWeekdayName: (d) =>
                  d.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""),
                formatCaption: (d) =>
                  d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
              }}
              components={{
                Chevron: ({ orientation }) =>
                  orientation === "left" ? (
                    <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                  ) : (
                    <ChevronRight className="h-5 w-5" strokeWidth={2} />
                  ),
              }}
              classNames={{
                root: "rdp-root w-full",
                month_caption:
                  "relative flex items-center justify-center pt-1 pb-5 text-base font-semibold capitalize text-sage-800",
                nav: "absolute inset-x-0 top-0 z-10 flex items-center justify-between",
                button_previous:
                  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sage-600 transition-colors hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent",
                button_next:
                  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sage-600 transition-colors hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent",
                month_grid: "mt-2 w-full table-fixed border-collapse",
                weekday:
                  "pb-3 text-center text-xs font-medium tracking-wide text-stone-400 uppercase",
                day: "p-1 text-center",
                day_button:
                  "mx-auto flex aspect-square w-full max-w-11 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-sage-700 transition-colors hover:bg-sage-100",
                selected:
                  "[&>button]:bg-sage-600 [&>button]:text-white [&>button]:font-semibold [&>button]:hover:bg-sage-600",
                today:
                  "[&>button]:relative [&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:h-1 [&>button]:after:w-1 [&>button]:after:rounded-full [&>button]:after:bg-terracotta-500",
                outside: "[&>button]:text-transparent [&>button]:pointer-events-none",
              }}
            />
          </div>

          {/* Créneaux horaires */}
          <div className="border-t border-sage-100 bg-sage-50/50 p-5 sm:w-[42%] sm:border-t-0 sm:border-l sm:p-6">
            <p className="text-sm font-semibold capitalize text-sage-800">
              {selectedAsDate
                ? dateHeadingFormatter.format(selectedAsDate)
                : "Sélectionnez une date"}
            </p>

            <div className="mt-4">
              {slots === null && (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-xl bg-white" />
                  ))}
                </div>
              )}
              {slots !== null && slots.length === 0 && (
                <p className="py-6 text-center text-sm text-stone-400">
                  Aucun créneau disponible ce jour-là.
                </p>
              )}
              {slots !== null && slots.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
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
          </div>
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
