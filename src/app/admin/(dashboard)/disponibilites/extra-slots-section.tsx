"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import {
  ApiError,
  createExtraSlots,
  deleteExtraSlot,
  deleteExtraSlotsByDate,
  getExtraSlots,
  getServicesAdmin,
  type ExtraSlot,
  type Service,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Modal } from "@/components/ui/modal";
import { TimeField } from "@/components/ui/time-field";
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

/** Midi pour éviter tout décalage de jour lié au fuseau horaire. */
function fromDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00`);
}

function formatLongDate(dateKey: string): string {
  return fromDateKey(dateKey).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(totalMinutes, 23 * 60 + 59));
  const hours = String(Math.floor(clamped / 60)).padStart(2, "0");
  const minutes = String(clamped % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function countLabel(count: number): string {
  return `${count} créneau${count > 1 ? "x" : ""} enregistré${count > 1 ? "s" : ""}`;
}

type Draft = {
  key: number;
  startTime: string;
  endTime: string;
  serviceIds: number[];
};

let draftKeySeed = 0;

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "10:00";

function createDraft(
  startTime = DEFAULT_START_TIME,
  endTime = DEFAULT_END_TIME,
  serviceIds: number[] = [],
): Draft {
  draftKeySeed += 1;
  return { key: draftKeySeed, startTime, endTime, serviceIds };
}

const dangerButtonClasses =
  "border-red-200! text-red-600! hover:border-red-300! hover:bg-red-50!";

export function ExtraSlotsSection() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const todayKey = useMemo(() => toDateKey(today), [today]);

  const [extraSlots, setExtraSlots] = useState<ExtraSlot[] | null>(null);
  const [services, setServices] = useState<Service[] | null>(null);
  const [date, setDate] = useState<Date>(today);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [drafts, setDrafts] = useState<Draft[]>(() => [createDraft()]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [panelDateKey, setPanelDateKey] = useState<string | null>(null);
  const [expandedSlotId, setExpandedSlotId] = useState<number | null>(null);
  const [confirmingSlotId, setConfirmingSlotId] = useState<number | null>(null);
  const [dateToClear, setDateToClear] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "deleting">("idle");
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const dateKey = toDateKey(date);

  function refresh() {
    return getExtraSlots()
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
      .catch(() => setError("Impossible de charger les prestations."));
  }, []);

  const activeServices = useMemo(
    () => (services ?? []).filter((service) => service.active),
    [services],
  );

  function windowMinutesOf(draft: Draft): number {
    return timeToMinutes(draft.endTime) - timeToMinutes(draft.startTime);
  }

  function handleSelectDate(next: Date) {
    setDate(next);
    setDrafts([createDraft()]);
    setSubmitAttempted(false);
    setFeedback(null);
    setError(null);
  }

  function handleTimeChange(
    key: number,
    field: "startTime" | "endTime",
    value: string,
  ) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.key === key ? { ...draft, [field]: value } : draft,
      ),
    );
  }

  function handleToggleService(key: number, serviceId: number) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.key === key
          ? {
              ...draft,
              serviceIds: draft.serviceIds.includes(serviceId)
                ? draft.serviceIds.filter((id) => id !== serviceId)
                : [...draft.serviceIds, serviceId],
            }
          : draft,
      ),
    );
  }

  function handleToggleAllServices(key: number, selectAll: boolean) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.key === key
          ? {
              ...draft,
              serviceIds: selectAll
                ? activeServices.map((service) => service.id)
                : [],
            }
          : draft,
      ),
    );
  }

  function handleAddDraft() {
    setDrafts((prev) => {
      // Le créneau suivant enchaîne sur le précédent, même durée, mêmes prestations.
      const last = prev.at(-1);
      const startTime = last ? last.endTime : DEFAULT_START_TIME;
      const length = last
        ? Math.max(timeToMinutes(last.endTime) - timeToMinutes(last.startTime), 15)
        : timeToMinutes(DEFAULT_END_TIME) - timeToMinutes(DEFAULT_START_TIME);
      return [
        ...prev,
        createDraft(startTime, minutesToTime(timeToMinutes(startTime) + length), [
          ...(last?.serviceIds ?? []),
        ]),
      ];
    });
  }

  function handleRemoveDraft(key: number) {
    setDrafts((prev) =>
      prev.length > 1 ? prev.filter((draft) => draft.key !== key) : prev,
    );
  }

  const draftErrors = drafts.map((draft) => {
    if (windowMinutesOf(draft) <= 0) {
      return "L'heure de fin doit être après l'heure de début.";
    }
    if (draft.serviceIds.length === 0) {
      return "Choisissez au moins une prestation.";
    }
    return null;
  });
  const draftsAreValid = draftErrors.every((message) => message === null);

  async function handleSave() {
    setSubmitAttempted(true);
    setFeedback(null);
    if (!draftsAreValid) return;

    setStatus("saving");
    setError(null);
    try {
      const saved = await createExtraSlots(
        drafts.map((draft) => ({
          date: dateKey,
          startTime: draft.startTime,
          endTime: draft.endTime,
          serviceIds: draft.serviceIds,
        })),
      );
      await refresh();
      setDrafts([createDraft()]);
      setSubmitAttempted(false);
      setFeedback(
        `${saved.length > 1 ? `${saved.length} créneaux enregistrés` : "Créneau enregistré"} pour le ${formatLongDate(dateKey)}.`,
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible d'enregistrer ces créneaux.",
      );
    } finally {
      setStatus("idle");
    }
  }

  async function handleDeleteSlot(slot: ExtraSlot) {
    setStatus("deleting");
    setError(null);
    try {
      await deleteExtraSlot(slot.id);
      const remaining = await getExtraSlots();
      setExtraSlots(remaining);
      setExpandedSlotId(null);
      setConfirmingSlotId(null);
      setFeedback("Créneau supprimé.");
      // Plus rien à afficher pour ce jour : le panel se referme.
      if (!remaining.some((item) => item.date === slot.date)) {
        setPanelDateKey(null);
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible de supprimer ce créneau.",
      );
    } finally {
      setStatus("idle");
    }
  }

  async function handleClearDate() {
    if (!dateToClear) return;
    setStatus("deleting");
    setError(null);
    try {
      const { count } = await deleteExtraSlotsByDate(dateToClear);
      await refresh();
      setFeedback(
        `${count} créneau${count > 1 ? "x" : ""} supprimé${count > 1 ? "s" : ""} pour le ${formatLongDate(dateToClear)}.`,
      );
      if (panelDateKey === dateToClear) setPanelDateKey(null);
      setDateToClear(null);
      setExpandedSlotId(null);
      setConfirmingSlotId(null);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible de supprimer ces créneaux.",
      );
    } finally {
      setStatus("idle");
    }
  }

  function openPanel(key: string) {
    setPanelDateKey(key);
    setExpandedSlotId(null);
    setConfirmingSlotId(null);
  }

  const slotsForDate = useMemo(
    () =>
      (extraSlots ?? [])
        .filter((slot) => slot.date === dateKey)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [extraSlots, dateKey],
  );

  const upcomingSlots = useMemo(
    () =>
      (extraSlots ?? [])
        .filter((slot) => slot.date >= todayKey)
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            a.startTime.localeCompare(b.startTime),
        ),
    [extraSlots, todayKey],
  );

  const markedDates = useMemo(
    () => upcomingSlots.map((slot) => fromDateKey(slot.date)),
    [upcomingSlots],
  );

  const upcomingDateKeys = useMemo(
    () => [...new Set(upcomingSlots.map((slot) => slot.date))],
    [upcomingSlots],
  );

  const panelSlots = useMemo(
    () =>
      panelDateKey === null
        ? []
        : (extraSlots ?? [])
            .filter((slot) => slot.date === panelDateKey)
            .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [extraSlots, panelDateKey],
  );

  function describeServices(serviceIds: number[]): string {
    if (
      activeServices.length > 0 &&
      activeServices.every((service) => serviceIds.includes(service.id))
    ) {
      return "Toutes les prestations";
    }
    const names = serviceIds
      .map((id) => services?.find((service) => service.id === id)?.name)
      .filter((name): name is string => Boolean(name));
    if (names.length === 0) return "—";
    // Au-delà de deux, la liste complète devient illisible sur une seule ligne :
    // elle reste visible en dépliant le créneau.
    if (names.length > 2) return `${names.length} prestations`;
    return names.join(", ");
  }

  return (
    <section className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-sage-100 bg-white p-5">
          <p className="text-sm font-semibold text-stone-700">Choisir un jour</p>
          <p className="mt-1 text-xs text-stone-400">
            Les jours cerclés portent déjà un ou plusieurs créneaux ponctuels.
          </p>

          <div className="mt-4">
            <Calendar
              month={visibleMonth}
              onMonthChange={setVisibleMonth}
              selected={date}
              onSelect={handleSelectDate}
              startMonth={today}
              marked={markedDates}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-sage-100 bg-white">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-sage-100 p-5">
            <p className="text-sm font-semibold text-stone-700">
              Ajouter un créneau — {formatLongDate(dateKey)}
            </p>
            {slotsForDate.length > 0 && (
              <button
                type="button"
                onClick={() => openPanel(dateKey)}
                className="cursor-pointer text-xs text-sage-700 underline decoration-sage-300 underline-offset-2 hover:decoration-sage-600"
              >
                {countLabel(slotsForDate.length)}
              </button>
            )}
          </div>

          <div className="p-5">
            <p className="text-xs text-stone-400">
              Une plage horaire, ouverte aux prestations cochées — même un jour
              de congé ou normalement fermé.
            </p>

            {activeServices.length === 0 && services !== null && (
              <p className="mt-4 rounded-xl bg-sage-50 px-3.5 py-3 text-sm text-stone-500">
                Aucune prestation active : activez-en une dans l&apos;onglet
                Prestations pour pouvoir ouvrir un créneau.
              </p>
            )}

            <div className="mt-4 space-y-4">
              {drafts.map((draft, index) => {
                const windowMinutes = windowMinutesOf(draft);
                const allSelected =
                  activeServices.length > 0 &&
                  activeServices.every((service) =>
                    draft.serviceIds.includes(service.id),
                  );
                const draftError = submitAttempted ? draftErrors[index] : null;

                return (
                  <div
                    key={draft.key}
                    className="rounded-2xl border border-sage-100 bg-sage-50/40 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
                        Créneau {index + 1}
                      </p>
                      {drafts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDraft(draft.key)}
                          aria-label={`Retirer le créneau ${index + 1}`}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-white hover:text-red-600"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-stone-600">
                          Heure de début
                        </label>
                        <TimeField
                          label="Heure de début"
                          value={draft.startTime}
                          onChange={(next) =>
                            handleTimeChange(draft.key, "startTime", next)
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-stone-600">
                          Heure de fin
                        </label>
                        <TimeField
                          label="Heure de fin"
                          value={draft.endTime}
                          onChange={(next) =>
                            handleTimeChange(draft.key, "endTime", next)
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="mb-1.5 block text-xs font-medium text-stone-600">
                          Prestations
                        </label>
                        {windowMinutes > 0 && (
                          <p className="text-xs text-stone-400">
                            Plage de {formatDuration(windowMinutes)}
                          </p>
                        )}
                      </div>

                      <label
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                          activeServices.length === 0
                            ? "cursor-not-allowed border-sage-100 opacity-50"
                            : "cursor-pointer border-sage-200 bg-white hover:border-sage-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={allSelected}
                          disabled={activeServices.length === 0}
                          onChange={(e) =>
                            handleToggleAllServices(draft.key, e.target.checked)
                          }
                          className="h-4 w-4 rounded border-sage-300 accent-sage-600 focus:ring-sage-500"
                        />
                        <span className="font-medium text-stone-700">
                          Toutes les prestations
                        </span>
                      </label>

                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {activeServices.map((service) => {
                          const checked = draft.serviceIds.includes(service.id);
                          // Purement informatif : la prestation reste réservable,
                          // la séance débordera simplement la fin de la plage.
                          const overrunMinutes =
                            windowMinutes > 0
                              ? service.durationMinutes - windowMinutes
                              : 0;
                          return (
                            <label
                              key={service.id}
                              className={`flex cursor-pointer items-start gap-2.5 rounded-xl border bg-white px-3 py-2.5 text-sm transition-colors ${
                                checked
                                  ? "border-sage-300"
                                  : "border-sage-100 hover:border-sage-200"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  handleToggleService(draft.key, service.id)
                                }
                                className="mt-0.5 h-4 w-4 rounded border-sage-300 accent-sage-600 focus:ring-sage-500"
                              />
                              <span className="min-w-0">
                                <span className="block truncate font-medium text-stone-700">
                                  {service.name}
                                </span>
                                <span className="block text-xs text-stone-400">
                                  {formatDuration(service.durationMinutes)}
                                  {overrunMinutes > 0 && (
                                    <span className="text-terracotta-600">
                                      {" "}
                                      · dépassera de {formatDuration(overrunMinutes)}
                                    </span>
                                  )}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {draftError && (
                      <p className="mt-3 text-xs text-red-600">{draftError}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddDraft}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-sage-300 px-3 py-3 text-sm font-medium text-sage-700 transition-colors hover:border-sage-500 hover:bg-sage-50"
            >
              <Plus size={16} />
              Nouveau créneau
            </button>

            <div className="mt-5 flex flex-col gap-3 border-t border-sage-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              {feedback ? (
                <p className="text-xs text-sage-700">{feedback}</p>
              ) : (
                <p className="text-xs text-stone-400">
                  Une fois enregistrés, ces créneaux sont réservables en ligne.
                </p>
              )}
              <Button
                type="button"
                onClick={handleSave}
                disabled={status === "saving" || activeServices.length === 0}
                withArrow={false}
                className="w-full sm:w-auto"
              >
                {status === "saving"
                  ? "Enregistrement…"
                  : drafts.length > 1
                    ? `Enregistrer les ${drafts.length} créneaux`
                    : "Enregistrer le créneau"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-sage-100 bg-white">
        <div className="border-b border-sage-100 p-5">
          <p className="text-sm font-semibold text-stone-700">
            Créneaux ponctuels à venir
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Cliquez sur une date pour voir ses créneaux et en supprimer un.
          </p>
        </div>

        {extraSlots === null ? (
          <div className="h-24 animate-pulse bg-sage-50" />
        ) : upcomingDateKeys.length === 0 ? (
          <p className="p-5 text-sm text-stone-400">
            Aucun créneau ponctuel à venir.
          </p>
        ) : (
          <ul className="divide-y divide-sage-100">
            {upcomingDateKeys.map((key) => {
              const slots = upcomingSlots.filter((slot) => slot.date === key);
              return (
                <li key={key} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => openPanel(key)}
                    className="flex min-w-0 flex-1 cursor-pointer flex-col gap-2 py-3.5 pl-5 text-left transition-colors hover:bg-sage-50/60 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <span className="text-sm font-medium text-stone-700">
                      {capitalize(formatLongDate(key))}
                    </span>
                    <span className="flex flex-wrap gap-1.5 sm:justify-end">
                      {slots.map((slot) => (
                        <span
                          key={slot.id}
                          className="rounded-full bg-sage-50 px-2.5 py-1 text-xs text-sage-700"
                        >
                          {slot.startTime} – {slot.endTime}
                        </span>
                      ))}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDateToClear(key)}
                    aria-label={`Supprimer tous les créneaux du ${formatLongDate(key)}`}
                    title="Supprimer tous les créneaux de ce jour"
                    className="mr-3 ml-2 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal
        open={panelDateKey !== null}
        onClose={() => setPanelDateKey(null)}
        title={panelDateKey ? capitalize(formatLongDate(panelDateKey)) : ""}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-stone-400">
            {countLabel(panelSlots.length)}
          </p>
          {panelSlots.length > 1 && panelDateKey && (
            <button
              type="button"
              onClick={() => setDateToClear(panelDateKey)}
              className="flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} />
              Tout supprimer
            </button>
          )}
        </div>

        <ul className="mt-4 space-y-2">
          {panelSlots.map((slot) => {
            const expanded = expandedSlotId === slot.id;
            return (
              <li
                key={slot.id}
                className="overflow-hidden rounded-xl border border-sage-100"
              >
                <button
                  type="button"
                  onClick={() => {
                    setExpandedSlotId(expanded ? null : slot.id);
                    setConfirmingSlotId(null);
                  }}
                  aria-expanded={expanded}
                  className={`flex w-full cursor-pointer items-center gap-3 px-3.5 py-3 text-left transition-colors ${
                    expanded ? "bg-sage-50" : "hover:bg-sage-50/60"
                  }`}
                >
                  <span className="text-sm font-medium text-sage-800">
                    {slot.startTime} – {slot.endTime}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-stone-400">
                    {describeServices(slot.serviceIds)}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-stone-400 transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expanded && (
                  <div className="border-t border-sage-100 px-3.5 py-4">
                    <p className="text-xs font-medium text-stone-600">
                      Prestations réservables sur ce créneau
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {slot.serviceIds.map((serviceId) => (
                        <li
                          key={serviceId}
                          className="rounded-full bg-sage-50 px-2.5 py-1 text-xs text-sage-700"
                        >
                          {services?.find((s) => s.id === serviceId)?.name ??
                            "Prestation supprimée"}
                        </li>
                      ))}
                    </ul>

                    {confirmingSlotId === slot.id ? (
                      <div className="mt-4 rounded-xl border border-red-100 bg-red-50/60 p-3.5">
                        <p className="text-xs text-red-700">
                          Ce créneau ne sera plus réservable. Les autres
                          créneaux de ce jour restent en place.
                        </p>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <Button
                            type="button"
                            variant="secondary"
                            withArrow={false}
                            onClick={() => setConfirmingSlotId(null)}
                            disabled={status === "deleting"}
                          >
                            Annuler
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            withArrow={false}
                            onClick={() => handleDeleteSlot(slot)}
                            disabled={status === "deleting"}
                            className={dangerButtonClasses}
                          >
                            {status === "deleting"
                              ? "Suppression…"
                              : "Confirmer la suppression"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="secondary"
                        withArrow={false}
                        onClick={() => setConfirmingSlotId(slot.id)}
                        className={`mt-4 w-full sm:w-auto ${dangerButtonClasses}`}
                      >
                        Supprimer ce créneau
                      </Button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Modal>

      {/* Rendue après le panel pour s'afficher par-dessus. */}
      <ConfirmModal
        open={dateToClear !== null}
        onClose={() => setDateToClear(null)}
        onConfirm={handleClearDate}
        loading={status === "deleting"}
        title="Supprimer tous les créneaux de ce jour ?"
        description={
          dateToClear
            ? `Les ${(extraSlots ?? []).filter((s) => s.date === dateToClear).length} créneaux du ${formatLongDate(dateToClear)} ne seront plus réservables. Vos horaires habituels et vos jours de congé ne changent pas.`
            : ""
        }
        confirmLabel="Tout supprimer"
      />
    </section>
  );
}
