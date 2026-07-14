"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Modal } from "@/components/ui/modal";
import { formatDuration, formatPrice } from "@/lib/format";
import type { Booking } from "@/lib/api";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});
const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export function BookingDetailModal({
  booking,
  onClose,
  onEdit,
  onCancel,
  cancelling,
}: {
  booking: Booking | null;
  onClose: () => void;
  onEdit: (booking: Booking) => void;
  onCancel: (id: number) => void;
  cancelling: boolean;
}) {
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  useEffect(() => {
    setConfirmingCancel(false);
  }, [booking?.id]);

  if (!booking) return null;

  function handleClose() {
    setConfirmingCancel(false);
    onClose();
  }

  return (
    <>
      <Modal
        open={Boolean(booking)}
        onClose={handleClose}
        title="Détail du rendez-vous"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6">
          <StatusBadge status={booking.status} />

          <div className="rounded-2xl border border-sage-100 bg-sage-50/50 p-6">
            <p className="text-[0.68rem] font-medium tracking-wide text-stone-400 uppercase">
              Rendez-vous
            </p>
            <div className="mt-3 space-y-2">
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
          </div>

          <div className="rounded-2xl border border-sage-100 bg-sage-50/50 p-6">
            {booking.beneficiaryFirstname && (
              <div className="mb-5">
                <p className="text-[0.68rem] font-medium tracking-wide text-terracotta-600 uppercase">
                  Rendez-vous pour
                </p>
                <div className="mt-3 space-y-2">
                  <Row
                    label="Nom"
                    value={`${booking.beneficiaryFirstname} ${booking.beneficiaryLastname ?? ""}`.trim()}
                  />
                  {booking.beneficiaryPhone && (
                    <Row label="Téléphone" value={booking.beneficiaryPhone} />
                  )}
                </div>
              </div>
            )}

            <div>
              <p className="text-[0.68rem] font-medium tracking-wide text-stone-400 uppercase">
                {booking.beneficiaryFirstname ? "Contact principal" : "Client"}
              </p>
              <div className="mt-3 space-y-2">
                <Row
                  label="Nom"
                  value={`${booking.customerFirstname} ${booking.customerLastname}`}
                />
                <Row label="Email" value={booking.customerEmail} />
                {booking.customerPhone && (
                  <Row label="Téléphone" value={booking.customerPhone} />
                )}
              </div>
            </div>
          </div>

          {booking.notes && (
            <div className="rounded-2xl border border-sage-100 bg-sage-50/50 p-6">
              <p className="text-[0.68rem] font-medium tracking-wide text-stone-400 uppercase">
                Message
              </p>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                {booking.notes}
              </p>
            </div>
          )}

          {booking.status === "CONFIRMED" && (
            <div className="flex flex-col-reverse gap-3 border-t border-sage-100 pt-6 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                withArrow={false}
                onClick={() => setConfirmingCancel(true)}
                className="border-red-300! bg-red-50! text-red-600! hover:border-red-400! hover:bg-red-100!"
              >
                Annuler le rendez-vous
              </Button>
              <Button
                type="button"
                withArrow={false}
                onClick={() => onEdit(booking)}
                className="flex-1"
              >
                Modifier
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        open={confirmingCancel}
        onClose={() => setConfirmingCancel(false)}
        onConfirm={() => onCancel(booking.id)}
        title="Annuler ce rendez-vous ?"
        description={`Un email d'annulation sera envoyé à ${booking.customerEmail}. Cette action est irréversible.`}
        confirmLabel="Oui, annuler le rendez-vous"
        cancelLabel="Retour"
        loading={cancelling}
      />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-stone-400">{label}</span>
      <span className="text-right font-medium text-stone-700">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  if (status === "CONFIRMED") {
    return (
      <span className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700">
        Confirmé
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
      Annulé
    </span>
  );
}
