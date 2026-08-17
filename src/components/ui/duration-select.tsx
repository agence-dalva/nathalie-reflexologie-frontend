"use client";

import { formatDuration } from "@/lib/format";
import { Select } from "./select";

/** Durées de séance courantes, en minutes. */
export const DURATION_OPTIONS = [
  10, 15, 20, 25, 30, 40, 45, 50, 60, 75, 80, 90, 105, 120, 150, 180,
];

/** Battements courants entre deux rendez-vous, en minutes. */
export const BUFFER_OPTIONS = [0, 5, 10, 15, 20, 30, 45, 60];

/**
 * Liste déroulante de durées, affichées en heures/minutes lisibles ("1h20")
 * plutôt qu'en champ nombre avec ses flèches.
 */
export function DurationSelect({
  value,
  onChange,
  options = DURATION_OPTIONS,
  zeroLabel,
  disabled = false,
}: {
  value: number;
  onChange: (minutes: number) => void;
  options?: number[];
  /** Libellé pour 0 minute (ex: « Aucun » pour un battement). */
  zeroLabel?: string;
  disabled?: boolean;
}) {
  // Une durée déjà enregistrée hors de la liste reste sélectionnable.
  const allOptions = options.includes(value)
    ? options
    : [...options, value].sort((a, b) => a - b);

  return (
    <Select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {allOptions.map((minutes) => (
        <option key={minutes} value={minutes}>
          {minutes === 0 && zeroLabel ? zeroLabel : formatDuration(minutes)}
        </option>
      ))}
    </Select>
  );
}
