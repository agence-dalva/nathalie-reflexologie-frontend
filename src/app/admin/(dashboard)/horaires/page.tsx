"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  createAvailability,
  createException,
  deleteAvailability,
  deleteException,
  getAvailabilities,
  getExceptions,
  type Availability,
  type Exception,
} from "@/lib/api";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-2xl text-sage-800 sm:text-3xl">
          Horaires
        </h1>
        <p className="mt-2 text-stone-500">
          Gérez vos horaires d&apos;ouverture récurrents et les exceptions
          (jours fériés, vacances, horaires modifiés).
        </p>
      </div>

      <RecurringSection />
      <ExceptionsSection />
    </div>
  );
}

function RecurringSection() {
  const [availabilities, setAvailabilities] = useState<Availability[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [weekday, setWeekday] = useState(0);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  function refresh() {
    getAvailabilities()
      .then(setAvailabilities)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger les horaires."),
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
      setError(err instanceof ApiError ? err.message : "Impossible d'ajouter ce créneau.");
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

  return (
    <section>
      <h2 className="font-display text-xl text-sage-800">
        Horaires récurrents
      </h2>

      {error && <p className="mt-3 text-red-600">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-7">
        {WEEKDAYS.map((label, weekdayIndex) => {
          const dayAvailabilities =
            availabilities?.filter((a) => a.weekday === weekdayIndex) ?? [];
          return (
            <div
              key={label}
              className="rounded-2xl border border-sage-100 bg-white p-4"
            >
              <p className="text-sm font-semibold text-stone-700">{label}</p>
              {dayAvailabilities.length === 0 ? (
                <p className="mt-3 text-xs text-stone-400">Fermé</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {dayAvailabilities.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between rounded-lg bg-sage-50 px-2.5 py-1.5 text-xs text-sage-700"
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

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-sage-100 bg-white p-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-600">
            Jour
          </label>
          <select
            value={weekday}
            onChange={(e) => setWeekday(Number(e.target.value))}
            className="rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
          >
            {WEEKDAYS.map((label, i) => (
              <option key={label} value={i}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-600">
            Début
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-600">
            Fin
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
          />
        </div>
        <Button type="button" onClick={handleAdd} disabled={status === "loading"}>
          Ajouter
        </Button>
      </div>
    </section>
  );
}

function ExceptionsSection() {
  const [exceptions, setExceptions] = useState<Exception[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [isClosed, setIsClosed] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  function refresh() {
    getExceptions()
      .then(setExceptions)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger les exceptions."),
      );
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd() {
    if (!date) return;
    setStatus("loading");
    setError(null);
    try {
      await createException({
        date,
        isClosed,
        startTime: isClosed ? undefined : startTime,
        endTime: isClosed ? undefined : endTime,
      });
      setDate("");
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible d'ajouter cette exception.");
    } finally {
      setStatus("idle");
    }
  }

  async function handleRemove(id: number) {
    try {
      await deleteException(id);
      refresh();
    } catch {
      setError("Impossible de supprimer cette exception.");
    }
  }

  const sortedExceptions = exceptions
    ? [...exceptions].sort((a, b) => a.date.localeCompare(b.date))
    : null;

  return (
    <section>
      <h2 className="font-display text-xl text-sage-800">
        Exceptions (jours fériés, vacances, horaires modifiés)
      </h2>

      {error && <p className="mt-3 text-red-600">{error}</p>}

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-sage-100 bg-white p-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-600">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
          />
        </div>

        <label className="flex items-center gap-2 pb-2.5 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={isClosed}
            onChange={(e) => setIsClosed(e.target.checked)}
            className="h-4 w-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
          />
          Jour fermé
        </label>

        {!isClosed && (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-stone-600">
                Début
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-stone-600">
                Fin
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
              />
            </div>
          </>
        )}

        <Button
          type="button"
          onClick={handleAdd}
          disabled={!date || status === "loading"}
        >
          Ajouter
        </Button>
      </div>

      {sortedExceptions === null && (
        <div className="mt-6 h-24 animate-pulse rounded-2xl bg-sage-50" />
      )}

      {sortedExceptions !== null && sortedExceptions.length === 0 && (
        <p className="mt-6 text-sm text-stone-400">Aucune exception enregistrée.</p>
      )}

      {sortedExceptions !== null && sortedExceptions.length > 0 && (
        <ul className="mt-6 divide-y divide-sage-100 overflow-hidden rounded-2xl border border-sage-100 bg-white">
          {sortedExceptions.map((exception) => (
            <li
              key={exception.id}
              className="flex items-center justify-between px-5 py-3 text-sm"
            >
              <div>
                <span className="font-medium text-stone-700">
                  {new Date(exception.date + "T12:00:00").toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="ml-3 text-stone-400">
                  {exception.isClosed
                    ? "Fermé"
                    : `${exception.startTime} – ${exception.endTime}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(exception.id)}
                className="cursor-pointer text-stone-400 hover:text-red-600"
                aria-label="Supprimer"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
