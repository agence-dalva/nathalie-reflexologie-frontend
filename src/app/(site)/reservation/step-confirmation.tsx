"use client";

import { useState } from "react";
import { ApiError, createBooking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatDuration, formatPrice } from "@/lib/format";
import { useBookingStore } from "@/stores/booking-store";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
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

export function StepConfirmation() {
  const {
    service,
    selectedSlot,
    bookingFor,
    beneficiary,
    customer,
    idempotencyKey,
    goBack,
    reset,
  } = useBookingStore();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!service || !selectedSlot) return null;

  async function handleConfirm() {
    setStatus("loading");
    setErrorMessage("");
    try {
      await createBooking(
        {
          serviceId: service!.id,
          startsAt: selectedSlot!.startsAt,
          customerFirstname: customer.firstname,
          customerLastname: customer.lastname,
          customerEmail: customer.email,
          customerPhone: customer.phone || undefined,
          beneficiaryFirstname:
            bookingFor === "other" ? beneficiary.firstname || undefined : undefined,
          beneficiaryLastname:
            bookingFor === "other" ? beneficiary.lastname || undefined : undefined,
          beneficiaryPhone:
            bookingFor === "other" ? beneficiary.phone || undefined : undefined,
          notes: customer.notes || undefined,
        },
        idempotencyKey,
      );
      setConfirmed(true);
    } catch (error) {
      setStatus("idle");
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Une erreur est survenue, merci de réessayer.",
      );
    }
  }

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-sage-200 bg-sage-50 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-600 text-2xl text-white">
          ✓
        </div>
        <p className="mt-6 font-display text-2xl text-sage-800">
          Rendez-vous confirmé !
        </p>
        <p className="mt-2 text-stone-500">
          Un email de confirmation vient de vous être envoyé à {customer.email}.
        </p>
        <Button onClick={reset} variant="secondary" className="mt-8">
          Prendre un autre rendez-vous
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 rounded-2xl border border-sage-100 bg-white p-6 sm:p-8">
        <Row label="Prestation" value={service.name} />
        <Row
          label="Date"
          value={dateFormatter.format(new Date(selectedSlot.startsAt))}
        />
        <Row
          label="Heure"
          value={`${timeFormatter.format(new Date(selectedSlot.startsAt))} — ${formatDuration(service.durationMinutes)}`}
        />
        <Row label="Tarif" value={formatPrice(service.price)} />
        {bookingFor === "other" && beneficiary.firstname && (
          <div className="border-t border-sage-100 pt-4">
            <p className="text-[0.68rem] font-medium tracking-wide text-terracotta-600 uppercase">
              Rendez-vous pour
            </p>
            <div className="mt-2 space-y-1">
              <Row
                label="Nom"
                value={`${beneficiary.firstname} ${beneficiary.lastname}`}
              />
              {beneficiary.phone && (
                <Row label="Téléphone" value={beneficiary.phone} />
              )}
            </div>
          </div>
        )}
        <div className="border-t border-sage-100 pt-4">
          <p className="text-[0.68rem] font-medium tracking-wide text-stone-400 uppercase">
            {bookingFor === "other" ? "Contact principal" : "Vos coordonnées"}
          </p>
          <div className="mt-2 space-y-1">
            <Row label="Nom" value={`${customer.firstname} ${customer.lastname}`} />
            <Row label="Email" value={customer.email} />
            {customer.phone && <Row label="Téléphone" value={customer.phone} />}
          </div>
        </div>
        {customer.notes && (
          <div className="border-t border-sage-100 pt-4">
            <p className="text-[0.68rem] font-medium tracking-wide text-stone-400 uppercase">
              Message
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">
              {customer.notes}
            </p>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          onClick={goBack}
          disabled={status === "loading"}
        >
          Retour
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={status === "loading"}
          size="lg"
          className="flex-1"
        >
          {status === "loading" ? "Confirmation en cours…" : "Confirmer le rendez-vous"}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-stone-400">{label}</span>
      <span className="font-medium text-stone-700">{value}</span>
    </div>
  );
}
