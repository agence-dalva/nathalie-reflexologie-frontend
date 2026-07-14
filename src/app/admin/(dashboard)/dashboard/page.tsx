"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ApiError, getDashboardOverview, type DashboardOverview } from "@/lib/api";
import { formatPrice } from "@/lib/format";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardOverview()
      .then(setData)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger le tableau de bord."),
      );
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-sage-800 sm:text-3xl">
        Tableau de bord
      </h1>

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!error && !data && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-sage-50" />
          ))}
        </div>
      )}

      {data && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Rendez-vous à venir" value={String(data.upcomingCount)} />
            <StatCard
              label="Chiffre d'affaires à venir"
              value={formatPrice(data.upcomingRevenue)}
            />
            <StatCard
              label="Rendez-vous ce mois-ci"
              value={String(data.monthBookingsCount)}
            />
            <StatCard
              label="Chiffre d'affaires du mois"
              value={formatPrice(data.monthRevenue)}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-2xl border border-sage-100 bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-sage-800">
                  Prochains rendez-vous
                </h2>
                <Link
                  href="/admin/rendez-vous"
                  className="text-sm text-sage-600 hover:text-sage-700"
                >
                  Tout voir
                </Link>
              </div>

              {data.nextBookings.length === 0 ? (
                <p className="mt-6 text-sm text-stone-400">
                  Aucun rendez-vous à venir.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-sage-100">
                  {data.nextBookings.map((booking) => (
                    <li
                      key={booking.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-700">
                          {booking.customerFirstname} {booking.customerLastname}
                        </p>
                        <p className="text-xs text-stone-400">
                          {booking.service.name}
                        </p>
                      </div>
                      <span className="text-sm text-stone-500 capitalize">
                        {dateFormatter.format(new Date(booking.startsAt))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-sage-100 bg-white p-6">
              <h2 className="font-display text-lg text-sage-800">
                Réservations à venir par prestation
              </h2>
              {data.bookingsByService.length === 0 ? (
                <p className="mt-6 text-sm text-stone-400">Aucune donnée.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.bookingsByService.map((item) => (
                    <li
                      key={item.serviceName}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-stone-600">{item.serviceName}</span>
                      <span className="font-semibold text-sage-700">
                        {item.count}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-sage-100 bg-white p-6">
      <p className="text-sm text-stone-400">{label}</p>
      <p className="mt-2 font-display text-3xl text-sage-800">{value}</p>
    </div>
  );
}
