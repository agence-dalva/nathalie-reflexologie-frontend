"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
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
const dateHeadingFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris",
});

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
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
  const today = startOfDay(new Date());
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [date, setDate] = useState(toDateKey(today));
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
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setDate(toDateKey(today));
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

  const selectedAsDate = date ? new Date(`${date}T00:00:00`) : undefined;

  return (
    <Modal open={open} onClose={onClose} title="Nouveau rendez-vous" maxWidth="max-w-3xl">
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
          <div className="flex flex-col overflow-hidden rounded-2xl border border-sage-100 sm:flex-row">
            {/* Calendrier */}
            <div className="p-5 sm:w-[58%] sm:p-6">
              <DayPicker
                mode="single"
                locale={undefined}
                month={visibleMonth}
                onMonthChange={setVisibleMonth}
                startMonth={new Date(today.getFullYear(), today.getMonth(), 1)}
                selected={selectedAsDate}
                onSelect={(newDate) => newDate && setDate(toDateKey(newDate))}
                disabled={(d) => startOfDay(d) < today}
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
                  disabled:
                    "[&>button]:cursor-not-allowed [&>button]:text-stone-300 [&>button]:hover:bg-transparent",
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
                    Aucun créneau disponible.
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
