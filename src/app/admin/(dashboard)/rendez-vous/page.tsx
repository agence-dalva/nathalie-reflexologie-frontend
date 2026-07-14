"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  cancelBookingAdmin,
  getBookingsAdmin,
  type Booking,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { formatPrice } from "@/lib/format";
import { NewBookingModal } from "./new-booking-modal";
import { EditBookingModal } from "./edit-booking-modal";
import { BookingDetailModal } from "./booking-detail-modal";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

type Filter = "upcoming" | "past" | "all";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [confirmCancelBooking, setConfirmCancelBooking] = useState<Booking | null>(null);

  function refresh() {
    getBookingsAdmin()
      .then(setBookings)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger les rendez-vous."),
      );
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    if (!bookings) return null;
    const now = Date.now();
    return bookings
      .filter((b) => {
        if (filter === "upcoming") return new Date(b.startsAt).getTime() >= now;
        if (filter === "past") return new Date(b.startsAt).getTime() < now;
        return true;
      })
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [bookings, filter]);

  async function handleCancel(id: number) {
    setCancellingId(id);
    try {
      await cancelBookingAdmin(id);
      setViewingBooking(null);
      setConfirmCancelBooking(null);
      refresh();
    } catch {
      setError("L'annulation a échoué.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-sage-800 sm:text-3xl">
          Rendez-vous
        </h1>
        <Button type="button" onClick={() => setModalOpen(true)}>
          + Nouveau rendez-vous
        </Button>
      </div>

      <div className="mt-6 flex gap-2">
        {(
          [
            { key: "upcoming", label: "À venir" },
            { key: "past", label: "Passés" },
            { key: "all", label: "Tous" },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-sage-600 text-white"
                : "bg-white text-stone-500 hover:bg-sage-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!error && filtered === null && (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-sage-50" />
          ))}
        </div>
      )}

      {filtered !== null && filtered.length === 0 && (
        <p className="mt-10 text-center text-stone-400">
          Aucun rendez-vous {filter === "upcoming" ? "à venir" : filter === "past" ? "passé" : ""}.
        </p>
      )}

      {filtered !== null && filtered.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-sage-100 bg-white">
          <div className="hidden grid-cols-[1.4fr_1.4fr_1fr_0.8fr_10rem] gap-4 border-b border-sage-100 px-6 py-3 text-xs font-semibold tracking-wide text-stone-400 uppercase sm:grid">
            <span>Client</span>
            <span>Prestation</span>
            <span>Date</span>
            <span>Statut</span>
            <span />
          </div>
          <ul className="divide-y divide-sage-100">
            {filtered.map((booking) => (
              <li
                key={booking.id}
                onClick={() => setViewingBooking(booking)}
                className="grid cursor-pointer grid-cols-1 gap-2 px-6 py-4 transition-colors hover:bg-sage-50/60 sm:grid-cols-[1.4fr_1.4fr_1fr_0.8fr_10rem] sm:items-center sm:gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-stone-700">
                    {booking.customerFirstname} {booking.customerLastname}
                  </p>
                  <p className="text-xs text-stone-400">{booking.customerEmail}</p>
                  {booking.beneficiaryFirstname && (
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-terracotta-400/15 px-2 py-0.5 text-xs font-medium text-terracotta-600">
                      Pour {booking.beneficiaryFirstname} {booking.beneficiaryLastname}
                      {booking.beneficiaryPhone ? ` — ${booking.beneficiaryPhone}` : ""}
                    </p>
                  )}
                </div>
                <div className="text-sm text-stone-600">
                  {booking.service.name}
                  <span className="ml-2 text-xs text-stone-400">
                    {formatPrice(booking.service.price)}
                  </span>
                </div>
                <span className="text-sm text-stone-500 capitalize">
                  {dateFormatter.format(new Date(booking.startsAt))}
                </span>
                <span>
                  <StatusBadge status={booking.status} />
                </span>
                <span className="flex items-center gap-3">
                  {booking.status === "CONFIRMED" && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBooking(booking);
                        }}
                        className="cursor-pointer text-sm text-sage-600 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmCancelBooking(booking);
                        }}
                        disabled={cancellingId === booking.id}
                        className="cursor-pointer text-sm text-red-600 hover:underline"
                      >
                        {cancellingId === booking.id ? "…" : "Annuler"}
                      </button>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <NewBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
      />

      <EditBookingModal
        booking={editingBooking}
        onClose={() => setEditingBooking(null)}
        onUpdated={refresh}
      />

      <BookingDetailModal
        booking={viewingBooking}
        onClose={() => setViewingBooking(null)}
        onEdit={(booking) => {
          setViewingBooking(null);
          setEditingBooking(booking);
        }}
        onCancel={handleCancel}
        cancelling={cancellingId === viewingBooking?.id}
      />

      <ConfirmModal
        open={Boolean(confirmCancelBooking)}
        onClose={() => setConfirmCancelBooking(null)}
        onConfirm={() => confirmCancelBooking && handleCancel(confirmCancelBooking.id)}
        title="Annuler ce rendez-vous ?"
        description={
          confirmCancelBooking
            ? `Un email d'annulation sera envoyé à ${confirmCancelBooking.customerEmail}. Cette action est irréversible.`
            : ""
        }
        confirmLabel="Oui, annuler le rendez-vous"
        cancelLabel="Retour"
        loading={cancellingId === confirmCancelBooking?.id}
      />
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
