"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ApiError, getClient, type ClientWithBookings } from "@/lib/api";
import { formatPrice } from "@/lib/format";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export default function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [client, setClient] = useState<ClientWithBookings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getClient(Number(id))
      .then(setClient)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger ce client."),
      );
  }, [id]);

  return (
    <div>
      <Link
        href="/admin/clients"
        className="text-sm text-sage-600 hover:underline"
      >
        ← Tous les clients
      </Link>

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!error && client === null && (
        <div className="mt-8 space-y-3">
          <div className="h-20 animate-pulse rounded-2xl bg-sage-50" />
          <div className="h-40 animate-pulse rounded-2xl bg-sage-50" />
        </div>
      )}

      {client && (
        <>
          <div className="mt-4 rounded-2xl border border-sage-100 bg-white p-6">
            <h1 className="font-display text-2xl text-sage-800">
              {client.firstname} {client.lastname}
            </h1>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium tracking-wide text-stone-400 uppercase">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-stone-700">{client.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wide text-stone-400 uppercase">
                  Téléphone
                </dt>
                <dd className="mt-1 text-sm text-stone-700">{client.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wide text-stone-400 uppercase">
                  Client depuis
                </dt>
                <dd className="mt-1 text-sm text-stone-700">
                  {new Date(client.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-xl text-sage-800">
              Historique des rendez-vous ({client.bookings.length})
            </h2>

            {client.bookings.length === 0 ? (
              <p className="mt-4 text-stone-400">Aucun rendez-vous pour ce client.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-sage-100 bg-white">
                <ul className="divide-y divide-sage-100">
                  {client.bookings.map((booking) => (
                    <li
                      key={booking.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-700">
                          {booking.service.name}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-400 capitalize">
                          {dateFormatter.format(new Date(booking.startsAt))}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-sage-700">
                          {formatPrice(booking.service.price)}
                        </span>
                        {booking.status === "CONFIRMED" ? (
                          <span className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700">
                            Confirmé
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
                            Annulé
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
