"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  cancelBookingByToken,
  getBookingByCancelToken,
  type Booking,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatDuration, formatPrice } from "@/lib/format";

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

export function CancellationView({ token }: { token: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    getBookingByCancelToken(token)
      .then(setBooking)
      .catch((err) =>
        setError(
          err instanceof ApiError && err.status === 404
            ? "Ce lien d'annulation n'est plus valide."
            : "Impossible de charger votre réservation.",
        ),
      );
  }, [token]);

  async function handleCancel() {
    setStatus("loading");
    try {
      const updated = await cancelBookingByToken(token);
      setBooking(updated);
    } catch {
      setError("L'annulation a échoué, merci de réessayer ou de nous contacter.");
    } finally {
      setStatus("idle");
    }
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!booking) {
    return <div className="h-40 animate-pulse rounded-2xl bg-sage-50" />;
  }

  if (booking.status === "CANCELLED") {
    return (
      <div className="rounded-2xl border border-sage-200 bg-sage-50 p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl text-sage-800">
          Rendez-vous annulé
        </h2>
        <p className="mt-2 text-stone-500">
          Votre rendez-vous du {dateFormatter.format(new Date(booking.startsAt))} a
          bien été annulé.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 rounded-2xl border border-sage-100 bg-white p-6 sm:p-8">
        <Row label="Prestation" value={booking.service.name} />
        <Row
          label="Date"
          value={dateFormatter.format(new Date(booking.startsAt))}
        />
        <Row
          label="Heure"
          value={`${timeFormatter.format(new Date(booking.startsAt))} — ${formatDuration(booking.service.durationMinutes)}`}
        />
        <Row label="Tarif" value={formatPrice(booking.service.price)} />
      </div>

      <p className="mt-6 text-center text-sm text-stone-500">
        Vous souhaitez annuler ce rendez-vous ?
      </p>
      <div className="mt-4 flex justify-center">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={status === "loading"}
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          {status === "loading" ? "Annulation…" : "Annuler mon rendez-vous"}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-stone-400">{label}</span>
      <span className="font-medium text-stone-700">{value}</span>
    </div>
  );
}
