/**
 * Découpe un CSV en lignes de cellules. Gère les guillemets (et les guillemets
 * doublés à l'intérieur), les retours à la ligne dans une cellule, le BOM des
 * exports Excel, et le point-virgule comme séparateur.
 */
export function parseCsv(text: string): string[][] {
  const content = text.replace(/^\uFEFF/, "");
  const separator = detectSeparator(content);

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (inQuotes) {
      if (char === '"') {
        if (content[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === separator) {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  // Une ligne vide en fin de fichier ne compte pas.
  return rows.filter((cells) => cells.some((value) => value.trim() !== ""));
}

/** Compare le nombre de virgules et de points-virgules sur la ligne d'en-tête. */
function detectSeparator(content: string): string {
  const firstLine = content.split(/\r?\n/, 1)[0] ?? "";
  const commas = (firstLine.match(/,/g) ?? []).length;
  const semicolons = (firstLine.match(/;/g) ?? []).length;
  return semicolons > commas ? ";" : ",";
}

/** Minuscules, sans accent ni ponctuation : pour reconnaître les en-têtes. */
export function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Renvoie l'index de la première colonne dont l'en-tête correspond à l'un des
 * alias, ou -1.
 */
export function findColumn(headers: string[], aliases: string[]): number {
  const normalized = headers.map(normalizeHeader);
  const wanted = aliases.map(normalizeHeader);
  return normalized.findIndex((header) => wanted.includes(header));
}
