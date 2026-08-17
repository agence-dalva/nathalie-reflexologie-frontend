"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ApiError,
  createAvailability,
  deleteAvailability,
  getAvailabilities,
  type Availability,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TimeField } from "@/components/ui/time-field";

const WEEKDAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export default function AdminAvailabilityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-sage-800 sm:text-3xl">
          Horaires
        </h1>
        <p className="mt-2 text-stone-500">
          Vos horaires d&apos;ouverture récurrents, qui se répètent chaque
          semaine. Les jours de congé et les créneaux ponctuels se gèrent dans
          l&apos;onglet{" "}
          <Link
            href="/admin/disponibilites"
            className="text-sage-700 underline decoration-sage-300 underline-offset-2 hover:decoration-sage-600"
          >
            Congés &amp; créneaux
          </Link>
          .
        </p>
      </div>

      <RecurringSection />
    </div>
  );
}

function RecurringSection() {
  const [availabilities, setAvailabilities] = useState<Availability[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [weekday, setWeekday] = useState(0);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  function refresh() {
    getAvailabilities()
      .then(setAvailabilities)
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger les horaires.",
        ),
      );
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd() {
    setStatus("loading");
    setError(null);
    try {
      await createAvailability({ weekday, startTime, endTime });
      refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible d'ajouter ce créneau.",
      );
    } finally {
      setStatus("idle");
    }
  }

  async function handleRemove(id: number) {
    try {
      await deleteAvailability(id);
      refresh();
    } catch {
      setError("Impossible de supprimer ce créneau.");
    }
  }

  const openDaysCount = new Set(availabilities?.map((a) => a.weekday)).size;
  const weeklyMinutes = (availabilities ?? []).reduce((total, a) => {
    const [startH, startM] = a.startTime.split(":").map(Number);
    const [endH, endM] = a.endTime.split(":").map(Number);
    return total + (endH * 60 + endM - (startH * 60 + startM));
  }, 0);
  const weeklyHours = Math.floor(weeklyMinutes / 60);
  const weeklyRemainderMinutes = weeklyMinutes % 60;

  return (
    <section className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-sage-100 bg-white p-5">
          <p className="text-2xl font-semibold text-sage-800">
            {openDaysCount}
            <span className="text-sm font-normal text-stone-500">/7</span>
          </p>
          <p className="mt-1 text-xs text-stone-500">
            jour{openDaysCount > 1 ? "s" : ""} ouvert
            {openDaysCount > 1 ? "s" : ""} par semaine
          </p>
        </div>
        <div className="rounded-2xl border border-sage-100 bg-white p-5">
          <p className="text-2xl font-semibold text-sage-800">
            {weeklyHours}h
            {weeklyRemainderMinutes > 0 &&
              String(weeklyRemainderMinutes).padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-stone-500">ouvertes par semaine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-sage-100 bg-white p-5">
          <p className="text-sm font-semibold text-stone-700">
            Ajouter un créneau récurrent
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Se répète chaque semaine sur le jour choisi.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-stone-600">
                Jour
              </label>
              <Select
                value={weekday}
                onChange={(e) => setWeekday(Number(e.target.value))}
              >
                {WEEKDAYS.map((label, i) => (
                  <option key={label} value={i}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-600">
                  Début
                </label>
                <TimeField
                  label="Début"
                  value={startTime}
                  onChange={setStartTime}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-600">
                  Fin
                </label>
                <TimeField label="Fin" value={endTime} onChange={setEndTime} />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAdd}
              disabled={status === "loading"}
              withArrow={false}
              className="w-full"
            >
              {status === "loading" ? "Ajout…" : "Ajouter"}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-sage-100 bg-white p-5">
          <p className="text-sm font-semibold text-stone-700">Semaine type</p>
          <p className="mt-1 text-xs text-stone-400">
            Vos plages d&apos;ouverture, jour par jour.
          </p>

          <div className="mt-4 space-y-2.5">
            {WEEKDAYS.map((label, weekdayIndex) => {
              const dayAvailabilities =
                availabilities?.filter((a) => a.weekday === weekdayIndex) ?? [];
              return (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 rounded-xl bg-sage-50 px-3.5 py-2.5"
                >
                  <p className="pt-0.5 text-xs font-semibold text-stone-700">
                    {label}
                  </p>
                  {dayAvailabilities.length === 0 ? (
                    <p className="text-xs text-stone-400">Fermé</p>
                  ) : (
                    <ul className="flex flex-wrap justify-end gap-1.5">
                      {dayAvailabilities.map((a) => (
                        <li
                          key={a.id}
                          className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs text-sage-700 shadow-sm"
                        >
                          <span>
                            {a.startTime} – {a.endTime}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemove(a.id)}
                            className="cursor-pointer text-stone-400 hover:text-red-600"
                            aria-label="Supprimer"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
