"use client";

import { User, Users } from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";

export function StepFor() {
  const setBookingFor = useBookingStore((s) => s.setBookingFor);

  return (
    <div>
      <p className="text-center text-sm leading-relaxed text-stone-500">
        Cette information permet à Nathalie de préparer au mieux votre
        rendez-vous et de savoir qui elle va accueillir.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setBookingFor("self")}
          className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-sage-100 bg-white p-8 text-center transition-all hover:border-sage-300 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700 transition-colors group-hover:bg-sage-600 group-hover:text-white">
            <User className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="font-display text-lg text-sage-900">
            C&apos;est pour moi
          </span>
        </button>

        <button
          type="button"
          onClick={() => setBookingFor("other")}
          className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-sage-100 bg-white p-8 text-center transition-all hover:border-sage-300 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700 transition-colors group-hover:bg-sage-600 group-hover:text-white">
            <Users className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="font-display text-lg text-sage-900">
            C&apos;est pour quelqu&apos;un d&apos;autre
          </span>
        </button>
      </div>
    </div>
  );
}
