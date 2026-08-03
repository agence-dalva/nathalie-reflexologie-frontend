"use client";

import { useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  ApiError,
  createAvailability,
  createException,
  createExceptionRange,
  createExtraSlot,
  deleteAvailability,
  deleteException,
  deleteExtraSlot,
  getAvailabilities,
  getExceptions,
  getExtraSlots,
  getServicesAdmin,
  importFrenchHolidays,
  removeAllExceptions,
  type Availability,
  type Exception,
  type ExtraSlot,
  type Service,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar, RangeCalendar } from "@/components/ui/calendar";
import { Select } from "@/components/ui/select";
import { formatDuration } from "@/lib/format";

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

      <div className="mt-6 grid grid-cols-2 gap-4">
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

      <div className="mt-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
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

          <div className="mt-5 space-y-3 border-t border-sage-100 pt-5">
            {WEEKDAYS.map((label, weekdayIndex) => {
              const dayAvailabilities =
                availabilities?.filter((a) => a.weekday === weekdayIndex) ??
                [];
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

        <ExtraSlotsWidget />
      </div>
    </section>
  );
}

function ExtraSlotsWidget() {
  const [extraSlots, setExtraSlots] = useState<ExtraSlot[] | null>(null);
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const today = useMemo(() => startOfDay(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const availableMinutes = useMemo(() => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    return endH * 60 + endM - (startH * 60 + startM);
  }, [startTime, endTime]);

  const compatibleServices = useMemo(() => {
    return (services ?? [])
      .filter((s) => s.durationMinutes + s.bufferMinutes <= availableMinutes)
      .sort((a, b) => a.durationMinutes - b.durationMinutes);
  }, [services, availableMinutes]);

  const serviceId = compatibleServices.some((s) => s.id === selectedServiceId)
    ? selectedServiceId
    : (compatibleServices[0]?.id ?? null);

  function refresh() {
    getExtraSlots()
      .then(setExtraSlots)
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger les créneaux ponctuels.",
        ),
      );
  }

  useEffect(() => {
    refresh();
    getServicesAdmin()
      .then(setServices)
      .catch(() => {});
  }, []);

  async function handleAdd() {
    if (!date || !serviceId) return;
    setStatus("loading");
    setError(null);
    try {
      await createExtraSlot({
        date: toDateKey(date),
        startTime,
        endTime,
        serviceId,
      });
      setDate(undefined);
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
      await deleteExtraSlot(id);
      refresh();
    } catch {
      setError("Impossible de supprimer ce créneau.");
    }
  }

  const sortedExtraSlots = extraSlots
    ? [...extraSlots].sort(
        (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
      )
    : null;
  const upcomingExtraSlots = sortedExtraSlots?.filter(
    (s) => s.date >= toDateKey(new Date()),
  );

  return (
    <div className="rounded-2xl border border-sage-100 bg-white p-5">
      <p className="text-sm font-semibold text-stone-700">
        Ajouter un créneau ponctuel
      </p>
      <p className="mt-1 text-xs text-stone-400">
        Une place précise, pour une prestation précise, en plus des horaires
        habituels (même un jour normalement fermé).
      </p>

      {error && <p className="mt-3 text-red-600">{error}</p>}

      <div className="mt-4 space-y-4">
        <div className="rounded-xl border border-sage-100 p-2">
          <Calendar
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            selected={date}
            onSelect={setDate}
            startMonth={today}
          />
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

        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-600">
            Prestation
          </label>
          <Select
            value={serviceId ?? ""}
            onChange={(e) => setSelectedServiceId(Number(e.target.value))}
            disabled={compatibleServices.length === 0}
          >
            {compatibleServices.length === 0 && (
              <option value="">Aucune prestation ne rentre dans ce créneau</option>
            )}
            {compatibleServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — {formatDuration(service.durationMinutes)}
              </option>
            ))}
          </Select>
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          disabled={status === "loading" || !date || !serviceId}
          className="w-full"
        >
          Ajouter
        </Button>
      </div>

      {upcomingExtraSlots && upcomingExtraSlots.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-sage-100 pt-4">
          {upcomingExtraSlots.map((slot) => {
            const service = services?.find((s) => s.id === slot.serviceId);
            return (
              <li
                key={slot.id}
                className="flex items-center justify-between rounded-lg bg-sage-50 px-2.5 py-1.5 text-xs text-sage-700"
              >
                <span>
                  {new Date(slot.date + "T12:00:00").toLocaleDateString(
                    "fr-FR",
                    { day: "numeric", month: "long" },
                  )}{" "}
                  · {slot.startTime} – {slot.endTime}
                  {service ? ` · ${service.name}` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(slot.id)}
                  className="cursor-pointer text-stone-400 hover:text-red-600"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {upcomingExtraSlots && upcomingExtraSlots.length === 0 && (
        <p className="mt-4 text-sm text-stone-400">
          Aucun créneau ponctuel à venir.
        </p>
      )}
    </div>
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

  async function handleRemoveAll(
    source: "MANUAL" | "HOLIDAY",
    items: Exception[],
  ) {
    if (!items.length) return;
    const label = source === "HOLIDAY" ? "jour(s) férié(s)" : "fermeture(s)";
    if (
      !window.confirm(
        `Supprimer les ${items.length} ${label} enregistré(s) ? Cette action est irréversible.`,
      )
    ) {
      return;
    }
    setImportStatus("loading");
    setError(null);
    try {
      await removeAllExceptions(source);
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

  const manualExceptions = exceptions
    ? [...exceptions]
        .filter((e) => e.source === "MANUAL")
        .sort((a, b) => a.date.localeCompare(b.date))
    : null;
  const holidayExceptions = exceptions
    ? [...exceptions]
        .filter((e) => e.source === "HOLIDAY")
        .sort((a, b) => a.date.localeCompare(b.date))
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
              Fermetures
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Jours de congé, périodes de vacances ou horaires modifiés,
              ajoutés manuellement ci-dessus.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              handleRemoveAll("MANUAL", manualExceptions ?? [])
            }
            disabled={importStatus === "loading" || !manualExceptions?.length}
            withArrow={false}
          >
            Tout supprimer
          </Button>
        </div>

        <ExceptionList
          exceptions={manualExceptions}
          emptyLabel="Aucune fermeture enregistrée."
          onRemove={handleRemove}
        />
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
              supprimable individuellement ci-dessous.
            </p>
          </div>

          <div className="flex items-end gap-2">
            <Select
              value={importYear}
              onChange={(e) => setImportYear(Number(e.target.value))}
              className="w-auto"
            >
              {holidayYearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
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
              onClick={() =>
                handleRemoveAll("HOLIDAY", holidayExceptions ?? [])
              }
              disabled={
                importStatus === "loading" || !holidayExceptions?.length
              }
              withArrow={false}
            >
              Tout supprimer
            </Button>
          </div>
        </div>

        <ExceptionList
          exceptions={holidayExceptions}
          emptyLabel="Aucun jour férié importé."
          onRemove={handleRemove}
        />
      </div>
    </section>
  );
}

function ExceptionList({
  exceptions,
  emptyLabel,
  onRemove,
}: {
  exceptions: Exception[] | null;
  emptyLabel: string;
  onRemove: (id: number) => void;
}) {
  if (exceptions === null) {
    return <div className="h-24 animate-pulse bg-sage-50" />;
  }

  if (exceptions.length === 0) {
    return <p className="p-5 text-sm text-stone-400">{emptyLabel}</p>;
  }

  return (
    <ul className="divide-y divide-sage-100">
      {exceptions.map((exception) => (
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
            onClick={() => onRemove(exception.id)}
            className="cursor-pointer text-stone-400 hover:text-red-600"
            aria-label="Supprimer"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
