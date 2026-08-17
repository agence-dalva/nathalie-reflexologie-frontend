"use client";

import { useRef, useState } from "react";
import { CircleAlert, CircleCheck, FileUp } from "lucide-react";
import {
  ApiError,
  importClients,
  type ClientImportInput,
  type ClientImportResult,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { findColumn, normalizeHeader, parseCsv } from "@/lib/csv";
import { formatPhoneNumberFR } from "@/lib/format";

const COLUMN_ALIASES = {
  firstname: ["prénom", "prenom", "firstname", "first name"],
  lastname: ["nom de famille", "nom", "lastname", "last name"],
  email: ["courrier électronique", "email", "e-mail", "mail", "adresse email"],
  phone: ["téléphone", "telephone", "phone", "mobile", "portable"],
  bookingsCount: [
    "total des réservations",
    "total des reservations",
    "nombre de réservations",
    "total bookings",
    "bookings",
  ],
  lastBooking: [
    "dernière réservation",
    "derniere reservation",
    "dernier rendez-vous",
    "last booking",
    "last appointment",
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MONTHS = [
  ["january", "janvier", "janv", "jan"],
  ["february", "février", "fevrier", "févr", "fevr", "feb", "fev"],
  ["march", "mars", "mar"],
  ["april", "avril", "avr", "apr"],
  ["may", "mai"],
  ["june", "juin", "jun"],
  ["july", "juillet", "juil", "jul"],
  ["august", "août", "aout", "aug"],
  ["september", "septembre", "sept", "sep"],
  ["october", "octobre", "oct"],
  ["november", "novembre", "nov"],
  ["december", "décembre", "decembre", "déc", "dec"],
];

/**
 * Lit une date d'export du type « 10 July 2023 16 h 00 min » (mois en anglais
 * ou en français, heure facultative) et renvoie un ISO. Les composants sont
 * interprétés dans le fuseau du navigateur, celui de l'institut.
 */
function parseExportedDate(raw: string): string | undefined {
  const match = raw
    .trim()
    .match(
      /^(\d{1,2})\s+([^\s\d]+)\.?\s+(\d{4})(?:\D+(\d{1,2})\s*h\s*(\d{1,2}))?/i,
    );
  if (!match) return undefined;

  const [, day, monthLabel, year, hours, minutes] = match;
  const normalized = normalizeHeader(monthLabel);
  const monthIndex = MONTHS.findIndex((names) =>
    names.some((name) => normalizeHeader(name) === normalized),
  );
  if (monthIndex === -1) return undefined;

  const date = new Date(
    Number(year),
    monthIndex,
    Number(day),
    Number(hours ?? 12),
    Number(minutes ?? 0),
  );
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

type SkippedRow = { line: number; label: string; reason: string };

type ParsedFile = {
  fileName: string;
  totalRows: number;
  rows: ClientImportInput[];
  skipped: SkippedRow[];
  unusedColumns: string[];
};

/**
 * Remet un numéro français au format utilisé partout dans l'app
 * ("06 12 34 56 78") ; un numéro étranger garde sa forme internationale.
 */
function normalizePhone(raw: string): string | undefined {
  const compact = raw.replace(/[\s.\-()]/g, "");
  if (!compact) return undefined;
  const french = compact.match(/^(?:\+33|0033)(\d{9})$/);
  if (french) return formatPhoneNumberFR(`0${french[1]}`);
  if (/^0\d{9}$/.test(compact)) return formatPhoneNumberFR(compact);
  return compact;
}

function parseClientsCsv(fileName: string, text: string): ParsedFile {
  const table = parseCsv(text);
  if (table.length < 2) {
    throw new Error("Ce fichier ne contient aucune ligne exploitable.");
  }

  const headers = table[0];
  const index = {
    firstname: findColumn(headers, COLUMN_ALIASES.firstname),
    lastname: findColumn(headers, COLUMN_ALIASES.lastname),
    email: findColumn(headers, COLUMN_ALIASES.email),
    phone: findColumn(headers, COLUMN_ALIASES.phone),
    bookingsCount: findColumn(headers, COLUMN_ALIASES.bookingsCount),
    lastBooking: findColumn(headers, COLUMN_ALIASES.lastBooking),
  };

  if (index.email === -1) {
    throw new Error(
      "Aucune colonne d'email trouvée. Attendu : « Courrier électronique » ou « Email ».",
    );
  }
  if (index.firstname === -1 && index.lastname === -1) {
    throw new Error(
      "Aucune colonne de nom trouvée. Attendu : « Prénom » et « Nom de famille ».",
    );
  }

  const used = new Set(Object.values(index).filter((i) => i !== -1));
  const unusedColumns = headers
    .map((header, i) => ({ header: header.trim(), i }))
    .filter(({ header, i }) => header !== "" && !used.has(i))
    .map(({ header }) => header);

  const rows: ClientImportInput[] = [];
  const skipped: SkippedRow[] = [];
  const seenEmails = new Set<string>();

  table.slice(1).forEach((cells, i) => {
    const line = i + 2; // +1 pour l'en-tête, +1 pour partir de 1
    const cell = (at: number) => (at === -1 ? "" : (cells[at] ?? "").trim());

    const firstname = cell(index.firstname);
    const lastname = cell(index.lastname);
    const email = cell(index.email).toLowerCase();
    const label = [firstname, lastname].filter(Boolean).join(" ") || email || "—";

    if (!email) {
      skipped.push({ line, label, reason: "email manquant" });
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      skipped.push({ line, label, reason: "email invalide" });
      return;
    }
    if (seenEmails.has(email)) {
      skipped.push({ line, label, reason: "email en doublon dans le fichier" });
      return;
    }
    if (!firstname && !lastname) {
      skipped.push({ line, label, reason: "nom manquant" });
      return;
    }

    const bookingsCount = Number.parseInt(cell(index.bookingsCount), 10);
    const lastBooking = parseExportedDate(cell(index.lastBooking));

    seenEmails.add(email);
    rows.push({
      firstname: firstname || lastname,
      lastname: lastname || firstname,
      email,
      phone: normalizePhone(cell(index.phone)),
      importedBookingsCount: Number.isNaN(bookingsCount)
        ? undefined
        : bookingsCount,
      importedLastBookingAt: lastBooking,
    });
  });

  return {
    fileName,
    totalRows: table.length - 1,
    rows,
    skipped,
    unusedColumns,
  };
}

export function ImportClientsModal({
  open,
  onClose,
  onImported,
  existingEmails,
}: {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
  existingEmails: Set<string>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [result, setResult] = useState<ClientImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "importing">("idle");

  function reset() {
    setParsed(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    try {
      const text = await file.text();
      setParsed(parseClientsCsv(file.name, text));
    } catch (err) {
      setParsed(null);
      setError(
        err instanceof Error ? err.message : "Ce fichier n'a pas pu être lu.",
      );
    }
  }

  async function handleImport() {
    if (!parsed) return;
    setStatus("importing");
    setError(null);
    try {
      setResult(await importClients(parsed.rows));
      onImported();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "L'import a échoué, merci de réessayer.",
      );
    } finally {
      setStatus("idle");
    }
  }

  const newCount = parsed
    ? parsed.rows.filter((row) => !existingEmails.has(row.email)).length
    : 0;
  const knownCount = parsed ? parsed.rows.length - newCount : 0;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importer des clients"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {!result && (
          <p className="text-sm leading-relaxed text-stone-600">
            Depuis un fichier CSV contenant les colonnes{" "}
            <span className="font-medium text-stone-700">Prénom</span>,{" "}
            <span className="font-medium text-stone-700">Nom de famille</span>,{" "}
            <span className="font-medium text-stone-700">
              Courrier électronique
            </span>{" "}
            et <span className="font-medium text-stone-700">Téléphone</span>. Si
            le fichier contient aussi le total des réservations et la date de la
            dernière, ils sont reportés sur la fiche client. Les fiches déjà
            présentes ne sont pas écrasées.
          </p>
        )}

        {!result && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
              className="sr-only"
              id="clients-csv"
            />
            <label
              htmlFor="clients-csv"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-sage-300 px-4 py-8 text-center transition-colors hover:border-sage-500 hover:bg-sage-50"
            >
              <FileUp size={22} className="text-sage-600" />
              <span className="text-sm font-medium text-sage-700">
                {parsed ? "Choisir un autre fichier" : "Choisir un fichier CSV"}
              </span>
              {parsed && (
                <span className="text-xs text-stone-400">{parsed.fileName}</span>
              )}
            </label>
          </div>
        )}

        {error && (
          <p className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/60 px-3.5 py-3 text-sm text-red-700">
            <CircleAlert size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        {parsed && !result && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <Stat value={newCount} label="nouvelles fiches" highlight />
              <Stat value={knownCount} label="déjà présentes" />
              <Stat value={parsed.skipped.length} label="lignes ignorées" />
            </div>

            {parsed.rows.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-sage-100">
                <table className="w-full min-w-120 text-left text-sm">
                  <thead>
                    <tr className="border-b border-sage-100 text-xs font-semibold tracking-wide text-stone-400 uppercase">
                      <th className="px-4 py-2.5 font-semibold">Nom</th>
                      <th className="px-4 py-2.5 font-semibold">Email</th>
                      <th className="px-4 py-2.5 font-semibold">Téléphone</th>
                      <th className="px-4 py-2.5 font-semibold">Séances</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-100">
                    {parsed.rows.slice(0, 5).map((row) => (
                      <tr key={row.email}>
                        <td className="px-4 py-2.5 whitespace-nowrap text-stone-700">
                          {row.firstname} {row.lastname}
                        </td>
                        <td className="max-w-56 truncate px-4 py-2.5 text-stone-500">
                          {row.email}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-stone-500">
                          {row.phone ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-stone-500">
                          {row.importedBookingsCount ?? "—"}
                          {row.importedLastBookingAt && (
                            <span className="ml-1.5 text-xs text-stone-400">
                              {new Date(
                                row.importedLastBookingAt,
                              ).toLocaleDateString("fr-FR", {
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.rows.length > 5 && (
                  <p className="border-t border-sage-100 px-4 py-2.5 text-xs text-stone-400">
                    … et {parsed.rows.length - 5} autres lignes.
                  </p>
                )}
              </div>
            )}

            {parsed.skipped.length > 0 && (
              <details className="rounded-xl border border-sage-100 px-4 py-3">
                <summary className="cursor-pointer text-xs font-medium text-stone-600">
                  {parsed.skipped.length} ligne
                  {parsed.skipped.length > 1 ? "s" : ""} ignorée
                  {parsed.skipped.length > 1 ? "s" : ""}
                </summary>
                <ul className="mt-2 space-y-1">
                  {parsed.skipped.map((row) => (
                    <li key={row.line} className="text-xs text-stone-500">
                      Ligne {row.line} — {row.label} :{" "}
                      <span className="text-terracotta-600">{row.reason}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {parsed.unusedColumns.length > 0 && (
              <p className="text-xs text-stone-400">
                Colonnes non reprises : {parsed.unusedColumns.join(", ")}. Le
                nombre de séances et la date de la dernière sont repris sur la
                fiche client, mais le détail de chaque rendez-vous (prestation,
                horaire) n&apos;est pas dans ce fichier.
              </p>
            )}

            <Button
              type="button"
              onClick={handleImport}
              disabled={status === "importing" || parsed.rows.length === 0}
              withArrow={false}
              className="w-full"
            >
              {status === "importing"
                ? "Import en cours…"
                : `Importer ${parsed.rows.length} client${parsed.rows.length > 1 ? "s" : ""}`}
            </Button>
          </>
        )}

        {result && (
          <>
            <p className="flex items-start gap-2 rounded-xl border border-sage-200 bg-sage-50 px-3.5 py-3 text-sm text-sage-800">
              <CircleCheck size={16} className="mt-0.5 shrink-0" />
              Import terminé.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Stat value={result.created} label="fiches créées" highlight />
              <Stat value={result.updated} label="fiches complétées" />
              <Stat value={result.unchanged} label="fiches inchangées" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                withArrow={false}
                onClick={reset}
                className="flex-1"
              >
                Importer un autre fichier
              </Button>
              <Button
                type="button"
                withArrow={false}
                onClick={handleClose}
                className="flex-1"
              >
                Fermer
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

function Stat({
  value,
  label,
  highlight = false,
}: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3.5 py-3 ${
        highlight ? "border-sage-200 bg-sage-50" : "border-sage-100"
      }`}
    >
      <p className="text-xl font-semibold text-sage-800">{value}</p>
      <p className="mt-0.5 text-xs text-stone-500">{label}</p>
    </div>
  );
}
