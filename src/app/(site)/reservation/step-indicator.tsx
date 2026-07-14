"use client";

import { motion } from "framer-motion";
import type { BookingStep } from "@/stores/booking-store";

const steps: { key: BookingStep; label: string }[] = [
  { key: "service", label: "Prestation" },
  { key: "slot", label: "Créneau" },
  { key: "for", label: "Bénéficiaire" },
  { key: "details", label: "Coordonnées" },
  { key: "confirmation", label: "Confirmation" },
];

export function StepIndicator({ current }: { current: BookingStep }) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.key} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:h-9 sm:w-9 ${
                  isDone
                    ? "bg-sage-600 text-white"
                    : isActive
                      ? "bg-sage-600 text-white"
                      : "bg-sage-100 text-sage-400"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={`hidden text-center text-xs font-medium sm:block ${
                  isActive ? "text-sage-700" : "text-stone-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-sage-100">
                <motion.div
                  className="h-full bg-sage-600"
                  initial={false}
                  animate={{ width: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
