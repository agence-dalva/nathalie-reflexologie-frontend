"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ApiError, getServices, type Service } from "@/lib/api";
import { formatDuration, formatPrice } from "@/lib/format";
import { useBookingStore } from "@/stores/booking-store";

// La prise en compte du `?service=` de l'URL est gérée une fois pour toutes
// dans ReservationFlow (toujours monté, quelle que soit l'étape courante) —
// voir usePreselectedService. Ce composant ne fait que lister/sélectionner
// manuellement une prestation.
export function StepService() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setService = useBookingStore((s) => s.setService);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger les prestations."),
      );
  }, []);

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!services) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-sage-50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {services.map((service, i) => (
        <motion.button
          key={service.id}
          type="button"
          onClick={() => setService(service)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="flex cursor-pointer flex-col rounded-2xl border border-sage-100 bg-white p-6 text-left transition-all hover:border-sage-300 hover:shadow-md"
        >
          <span className="font-display text-lg text-sage-800">
            {service.name}
          </span>
          <span className="mt-2 flex-1 text-sm text-stone-500">
            {service.description}
          </span>
          <div className="mt-4 flex items-center justify-between border-t border-sage-100 pt-4">
            <span className="text-sm text-stone-400">
              {formatDuration(service.durationMinutes)}
            </span>
            <span className="font-display text-xl text-sage-700">
              {formatPrice(service.price)}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
