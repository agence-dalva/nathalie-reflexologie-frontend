"use client";

import { useState } from "react";
import { ExtraSlotsSection } from "./extra-slots-section";
import { LeaveSection } from "./leave-section";

const TABS = [
  { id: "slots", label: "Créneaux ponctuels" },
  { id: "leave", label: "Jours de congé" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminDisponibilitesPage() {
  const [tab, setTab] = useState<TabId>("slots");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-sage-800 sm:text-3xl">
          Congés &amp; créneaux
        </h1>
        <p className="mt-2 text-stone-500">
          {tab === "slots"
            ? "Ouvrez des créneaux à la volée, en plus de vos horaires habituels."
            : "Posez vos jours de congé, vos vacances et vos jours fériés."}
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Type de disponibilité"
        className="flex rounded-xl bg-sage-50 p-1 text-sm sm:max-w-md"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 cursor-pointer rounded-lg px-3 py-2 transition-colors ${
              tab === item.id
                ? "bg-white text-sage-800 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "slots" ? <ExtraSlotsSection /> : <LeaveSection />}
    </div>
  );
}
