"use client";

import { useBookingStore } from "@/stores/booking-store";
import { formatDuration, formatPrice } from "@/lib/format";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris",
});
const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export function BookingSummaryBar() {
  const service = useBookingStore((s) => s.service);
  const selectedSlot = useBookingStore((s) => s.selectedSlot);
  const bookingFor = useBookingStore((s) => s.bookingFor);
  const beneficiary = useBookingStore((s) => s.beneficiary);

  if (!service) return null;

  const items = [
    { label: "Prestation", value: service.name },
    ...(selectedSlot
      ? [
          {
            label: "Créneau",
            value: `${dateFormatter.format(new Date(selectedSlot.startsAt))} — ${timeFormatter.format(new Date(selectedSlot.startsAt))}`,
          },
        ]
      : []),
    ...(bookingFor === "other" && beneficiary.firstname
      ? [
          {
            label: "Pour",
            value: `${beneficiary.firstname} ${beneficiary.lastname}`,
            accent: true,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-sage-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex flex-1 flex-wrap gap-x-8 gap-y-3">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <p className="text-[0.65rem] font-medium tracking-widest-plus text-sage-400 uppercase">
              {item.label}
            </p>
            <p
              className={`mt-0.5 truncate text-sm font-medium ${
                item.accent ? "text-terracotta-600" : "text-stone-700"
              }`}
              title={item.value}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-sage-100 pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
        <span className="text-sm text-stone-400">Total</span>
        <span className="font-display text-xl font-light text-sage-800">
          {formatPrice(service.price)}
        </span>
      </div>
    </div>
  );
}
