"use client";

import { useEffect, useRef, useState } from "react";
import { getServices } from "@/lib/api";
import { useBookingStore } from "@/stores/booking-store";

/**
 * Applique le service passé en `?service=` quelle que soit l'étape courante
 * du booking. Doit être appelé depuis un composant TOUJOURS monté (le flow
 * racine), pas depuis l'étape "service" — sinon un `?service=` reçu pendant
 * que le client est déjà à une étape ultérieure (ex: retour navigateur vers
 * /tarifs puis nouveau clic "Réserver") est silencieusement ignoré, car le
 * composant qui l'écoutait n'est plus monté.
 */
export function usePreselectedService(preselectedServiceId: number | undefined) {
  const applyPreselectedService = useBookingStore((s) => s.applyPreselectedService);
  const lastAppliedId = useRef<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(!!preselectedServiceId);

  useEffect(() => {
    if (!preselectedServiceId) {
      setIsLoading(false);
      return;
    }
    if (lastAppliedId.current === preselectedServiceId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    getServices()
      .then((services) => {
        if (cancelled) return;
        const match = services.find((s) => s.id === preselectedServiceId);
        if (match) {
          applyPreselectedService(match);
          lastAppliedId.current = preselectedServiceId;
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [preselectedServiceId, applyPreselectedService]);

  return { isApplyingPreselection: isLoading };
}
