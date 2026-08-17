"use client";

import { useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  ApiError,
  createException,
  createExceptionRange,
  deleteException,
  getExceptions,
  importFrenchHolidays,
  removeAllExceptions,
  type Exception,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar, RangeCalendar } from "@/components/ui/calendar";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Select } from "@/components/ui/select";
import { TimeField } from "@/components/ui/time-field";

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

export function LeaveSection() {
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
  const [bulkDelete, setBulkDelete] = useState<{
    source: "MANUAL" | "HOLIDAY";
    count: number;
  } | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const holidayYearOptions = useMemo(() => {
    const currentYear = today.getFullYear();
    return [currentYear, currentYear + 1, currentYear + 2];
  }, [today]);

  function refresh() {
    return getExceptions()
      .then(setExceptions)
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger les jours de congé.",
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
          : "Impossible d'ajouter ce congé.",
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
      setError("Impossible de supprimer ce jour.");
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

  async function handleConfirmBulkDelete() {
    if (!bulkDelete) return;
    setImportStatus("loading");
    setError(null);
    try {
      await removeAllExceptions(bulkDelete.source);
      await refresh();
      setBulkDelete(null);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible de supprimer ces jours.",
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
    <section className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-sage-100 bg-white p-5">
          <p className="text-sm font-semibold text-stone-700">
            Poser un jour de congé
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Un jour isolé, ou une période complète de vacances.
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
                className="h-4 w-4 rounded border-sage-300 accent-sage-600 focus:ring-sage-500"
              />
              Fermé toute la journée
            </label>

            {!isClosed && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">
                    Ouvert de
                  </label>
                  <TimeField
                    label="Ouvert de"
                    value={startTime}
                    onChange={setStartTime}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">
                    à
                  </label>
                  <TimeField label="Jusqu'à" value={endTime} onChange={setEndTime} />
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
              withArrow={false}
              className="w-full"
            >
              {status === "loading" ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-sage-100 bg-white">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-sage-100 p-5">
              <div>
                <p className="text-sm font-semibold text-stone-700">
                  Congés et fermetures
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  Jours de congé, périodes de vacances ou horaires modifiés.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setBulkDelete({
                    source: "MANUAL",
                    count: manualExceptions?.length ?? 0,
                  })
                }
                disabled={importStatus === "loading" || !manualExceptions?.length}
                withArrow={false}
              >
                Tout supprimer
              </Button>
            </div>

            <ExceptionList
              exceptions={manualExceptions}
              emptyLabel="Aucun jour de congé enregistré."
              onRemove={handleRemove}
            />
          </div>

          <div className="rounded-2xl border border-sage-100 bg-white">
            <div className="border-b border-sage-100 p-5">
              <p className="text-sm font-semibold text-stone-700">
                Jours fériés français
              </p>
              <p className="mt-1 text-xs text-stone-400">
                Importe automatiquement les 11 jours fériés de l&apos;année
                choisie (fermé toute la journée). Chaque jour reste ensuite
                supprimable individuellement ci-dessous.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
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
                    setBulkDelete({
                      source: "HOLIDAY",
                      count: holidayExceptions?.length ?? 0,
                    })
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
        </div>
      </div>

      <ConfirmModal
        open={bulkDelete !== null}
        onClose={() => setBulkDelete(null)}
        onConfirm={handleConfirmBulkDelete}
        loading={importStatus === "loading"}
        title={
          bulkDelete?.source === "HOLIDAY"
            ? "Supprimer tous les jours fériés ?"
            : "Supprimer tous les congés ?"
        }
        description={
          bulkDelete
            ? `${bulkDelete.count} ${
                bulkDelete.source === "HOLIDAY"
                  ? "jour(s) férié(s)"
                  : "jour(s) de congé"
              } seront supprimés. Cette action est irréversible.`
            : ""
        }
        confirmLabel="Tout supprimer"
      />
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
          className="flex items-center justify-between gap-3 px-5 py-3 text-sm"
        >
          <div className="min-w-0">
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
            className="shrink-0 cursor-pointer text-stone-400 hover:text-red-600"
            aria-label="Supprimer"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
