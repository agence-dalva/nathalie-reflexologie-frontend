"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useBookingStore } from "@/stores/booking-store";
import { usePreselectedService } from "./use-preselected-service";
import { StepIndicator } from "./step-indicator";
import { StepService } from "./step-service";
import { StepSlot } from "./step-slot";
import { StepFor } from "./step-for";
import { StepDetails } from "./step-details";
import { StepConfirmation } from "./step-confirmation";
import { BookingSummaryBar } from "./booking-summary-bar";

const titles: Record<string, string> = {
  service: "Choisissez votre prestation",
  slot: "Choisissez votre créneau",
  for: "Pour qui est ce rendez-vous ?",
  details: "Vos coordonnées",
  confirmation: "Vérifiez votre rendez-vous",
};

export function ReservationFlow({
  preselectedServiceId,
}: {
  preselectedServiceId?: number;
}) {
  const step = useBookingStore((s) => s.step);
  const history = useBookingStore((s) => s.history);
  const goBack = useBookingStore((s) => s.goBack);

  usePreselectedService(preselectedServiceId);

  const topRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Ramène doucement le haut du flow en vue à chaque changement d'étape,
  // pour éviter l'effet de "jump" quand une étape plus courte remplace une
  // étape plus longue (ou l'inverse).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const canGoBack = history.length > 0;

  return (
    <section ref={topRef} className="py-10 scroll-mt-28 sm:py-16">
      <Container className="max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-sage-500 uppercase">
            Réservation en ligne
          </p>
          <h1 className="mt-3 font-display text-2xl text-sage-800 sm:text-4xl">
            {titles[step]}
          </h1>
        </div>

        <div className="mt-8 sm:mt-10">
          <StepIndicator current={step} />
        </div>

        {canGoBack && (
          <button
            type="button"
            onClick={goBack}
            className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-sm text-sage-600 transition-colors hover:text-sage-800"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Retour
          </button>
        )}

        {step !== "service" && (
          <div className="mt-6">
            <BookingSummaryBar />
          </div>
        )}

        <div className="mt-8 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === "service" && <StepService />}
              {step === "slot" && <StepSlot />}
              {step === "for" && <StepFor />}
              {step === "details" && <StepDetails />}
              {step === "confirmation" && <StepConfirmation />}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
