"use client";

import { Select } from "./select";

/**
 * Choix d'une heure au format "HH:mm" via deux listes déroulantes (heures /
 * minutes) plutôt que l'input time natif, dont l'apparence varie selon le
 * navigateur et jure avec le reste du back-office.
 */
export function TimeField({
  value,
  onChange,
  minuteStep = 5,
  minHour = 0,
  maxHour = 23,
  disabled = false,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
  minHour?: number;
  maxHour?: number;
  disabled?: boolean;
  /** Repris dans les aria-label des deux listes (ex: « Heure de début »). */
  label?: string;
}) {
  const [hourPart, minutePart] = value.split(":");
  const hour = Number(hourPart);
  const minute = Number(minutePart);

  const hourOptions = Array.from(
    { length: maxHour - minHour + 1 },
    (_, i) => minHour + i,
  );
  if (!hourOptions.includes(hour)) {
    hourOptions.push(hour);
    hourOptions.sort((a, b) => a - b);
  }

  const minuteOptions: number[] = [];
  for (let m = 0; m < 60; m += minuteStep) {
    minuteOptions.push(m);
  }
  // Une minute déjà enregistrée hors du pas reste sélectionnable, pour ne pas
  // décaler silencieusement un horaire existant.
  if (!minuteOptions.includes(minute)) {
    minuteOptions.push(minute);
    minuteOptions.sort((a, b) => a - b);
  }

  return (
    <div className="flex items-center gap-1.5">
      <Select
        value={hour}
        disabled={disabled}
        onChange={(e) => onChange(`${pad(Number(e.target.value))}:${pad(minute)}`)}
        aria-label={label ? `${label} — heures` : "Heures"}
        compact
        wrapperClassName="flex-1"
        className="w-full"
      >
        {hourOptions.map((h) => (
          <option key={h} value={h}>
            {pad(h)}
          </option>
        ))}
      </Select>

      <span className="text-sm text-stone-400">h</span>

      <Select
        value={minute}
        disabled={disabled}
        onChange={(e) => onChange(`${pad(hour)}:${pad(Number(e.target.value))}`)}
        aria-label={label ? `${label} — minutes` : "Minutes"}
        compact
        wrapperClassName="flex-1"
        className="w-full"
      >
        {minuteOptions.map((m) => (
          <option key={m} value={m}>
            {pad(m)}
          </option>
        ))}
      </Select>
    </div>
  );
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}
