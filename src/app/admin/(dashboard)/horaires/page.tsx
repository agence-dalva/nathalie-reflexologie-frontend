"use client";

import { useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  ApiError,
  createAvailability,
  createException,
  createExceptionRange,
  deleteAvailability,
  deleteException,
  getAvailabilities,
  getExceptions,
  importFrenchHolidays,
  removeAllExceptions,
  type Availability,
  type Exception,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar, RangeCalendar } from "@/components/ui/calendar";

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

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

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
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
              <select
                value={weekday}
                onChange={(e) => setWeekday(Number(e.target.value))}
                className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
              >
                {WEEKDAYS.map((label, i) => (
                  <option key={label} value={i}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium text-stone-600">
                  Début
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium text-stone-600">
                  Fin
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAdd}
              disabled={status === "loading"}
              className="w-full"
            >
              Ajouter
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-sage-100 bg-white p-5">
          <p className="text-sm font-semibold text-stone-700">
            Résumé de la semaine
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Vue d&apos;ensemble de vos horaires récurrents actuels.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-sage-50 p-4">
              <p className="text-2xl font-semibold text-sage-800">
                {openDaysCount}
                <span className="text-sm font-normal text-stone-500">/7</span>
              </p>
              <p className="mt-1 text-xs text-stone-500">
                jour{openDaysCount > 1 ? "s" : ""} ouvert
                {openDaysCount > 1 ? "s" : ""} par semaine
              </p>
            </div>
            <div className="rounded-xl bg-sage-50 p-4">
              <p className="text-2xl font-semibold text-sage-800">
                {weeklyHours}h
                {weeklyRemainderMinutes > 0 &&
                  String(weeklyRemainderMinutes).padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                ouvertes par semaine
              </p>
            </div>
          </div>

          {openDaysCount === 0 && (
            <p className="mt-4 text-sm text-stone-400">
              Aucun horaire récurrent défini pour l&apos;instant.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function ExceptionsSection() {
  const [exceptions, setExceptions] = useState<Exception[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRange, setIsRange] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [isClosed, setIsClosed] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [importYear, setImportYear] = useState(new Date().getFullYear());
  const [importStatus, setImportStatus] = useState<"idle" | "loading">("idle");

  const today = useMemo(() => startOfDay(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const holidayYearOptions = useMemo(() => {
    const currentYear = today.getFullYear();
    return [currentYear, currentYear + 1, currentYear + 2];
  }, [today]);

  function refresh() {
    getExceptions()
      .then(setExceptions)
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger les exceptions.",
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
      if (isRange) {
        if (!selectedRange?.from || !selectedRange.to) return;
        await createExceptionRange({
          startDate: toDateKey(selectedRange.from),
          endDate: toDateKey(selectedRange.to),
          isClosed,
          startTime: isClosed ? undefined : startTime,
          endTime: isClosed ? undefined : endTime,
        });
        setSelectedRange(undefined);
      } else {
        if (!selectedDate) return;
        await createException({
          date: toDateKey(selectedDate),
          isClosed,
          startTime: isClosed ? undefined : startTime,
          endTime: isClosed ? undefined : endTime,
        });
        setSelectedDate(undefined);
      }
      refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible d'ajouter cette exception.",
      );
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

  async function handleImportHolidays() {
    setImportStatus("loading");
    setError(null);
    try {
      await importFrenchHolidays(importYear);
      refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible d'importer les jours fériés.",
      );
    } finally {
      setImportStatus("idle");
    }
  }

  async function handleRemoveAll() {
    if (!exceptions?.length) return;
    if (
      !window.confirm(
        `Supprimer les ${exceptions.length} exception(s) enregistrée(s) (jours fériés, congés, périodes) ? Cette action est irréversible.`,
      )
    ) {
      return;
    }
    setImportStatus("loading");
    setError(null);
    try {
      await removeAllExceptions();
      refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible de supprimer les exceptions.",
      );
    } finally {
      setImportStatus("idle");
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

      <div className="mt-6">
        <div className="rounded-2xl border border-sage-100 bg-white p-5">
          <p className="text-sm font-semibold text-stone-700">
            Ajouter une exception
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Un jour férié, un jour de congé, ou une période de vacances.
          </p>

          <div className="mt-4 flex rounded-xl bg-sage-50 p-1 text-sm">
            <button
              type="button"
              onClick={() => setIsRange(false)}
              className={`flex-1 cursor-pointer rounded-lg px-3 py-1.5 transition-colors ${
                !isRange
                  ? "bg-white text-sage-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Jour unique
            </button>
            <button
              type="button"
              onClick={() => setIsRange(true)}
              className={`flex-1 cursor-pointer rounded-lg px-3 py-1.5 transition-colors ${
                isRange
                  ? "bg-white text-sage-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Période (du / au)
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-sage-100 p-2">
              {isRange ? (
                <RangeCalendar
                  month={visibleMonth}
                  onMonthChange={setVisibleMonth}
                  selected={selectedRange}
                  onSelect={setSelectedRange}
                  startMonth={today}
                />
              ) : (
                <Calendar
                  month={visibleMonth}
                  onMonthChange={setVisibleMonth}
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  startMonth={today}
                />
              )}
            </div>

            {isRange && selectedRange?.from && (
              <p className="text-sm text-stone-600">
                Du{" "}
                <span className="font-medium text-sage-800">
                  {selectedRange.from.toLocaleDateString("fr-FR")}
                </span>{" "}
                au{" "}
                <span className="font-medium text-sage-800">
                  {selectedRange.to
                    ? selectedRange.to.toLocaleDateString("fr-FR")
                    : "…"}
                </span>
              </p>
            )}

            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={isClosed}
                onChange={(e) => setIsClosed(e.target.checked)}
                className="h-4 w-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
              />
              Jour fermé toute la journée
            </label>

            {!isClosed && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">
                    Début
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">
                    Fin
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
                  />
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={handleAdd}
              disabled={
                status === "loading" ||
                (isRange
                  ? !selectedRange?.from || !selectedRange.to
                  : !selectedDate)
              }
              className="w-full"
            >
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-sage-100 bg-white">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-sage-100 p-5">
          <div>
            <p className="text-sm font-semibold text-stone-700">
              Jours fériés français
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Importe automatiquement les 11 jours fériés de l&apos;année
              choisie (fermé toute la journée). Chaque jour reste ensuite
              modifiable ou supprimable individuellement ci-dessous.
            </p>
          </div>

          <div className="flex items-end gap-2">
            <select
              value={importYear}
              onChange={(e) => setImportYear(Number(e.target.value))}
              className="rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
            >
              {holidayYearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              onClick={handleImportHolidays}
              disabled={importStatus === "loading"}
              withArrow={false}
            >
              Importer
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleRemoveAll}
              disabled={importStatus === "loading" || !exceptions?.length}
              withArrow={false}
            >
              Tout supprimer
            </Button>
          </div>
        </div>

        {sortedExceptions === null && (
          <div className="h-24 animate-pulse bg-sage-50" />
        )}

        {sortedExceptions !== null && sortedExceptions.length === 0 && (
          <p className="p-5 text-sm text-stone-400">
            Aucune exception enregistrée.
          </p>
        )}

        {sortedExceptions !== null && sortedExceptions.length > 0 && (
          <ul className="divide-y divide-sage-100">
            {sortedExceptions.map((exception) => (
              <li
                key={exception.id}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <div>
                  <span className="font-medium text-stone-700">
                    {new Date(exception.date + "T12:00:00").toLocaleDateString(
                      "fr-FR",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
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
      </div>
    </section>
  );
}
