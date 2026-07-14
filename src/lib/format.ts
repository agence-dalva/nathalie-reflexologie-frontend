export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours === 0) return `${remaining} min`;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h${String(remaining).padStart(2, "0")}`;
}

export function formatPrice(price: string | number): string {
  const value = typeof price === "string" ? Number(price) : price;
  return `${value % 1 === 0 ? value : value.toFixed(2)} €`;
}

export function formatReviewerName(fullName: string): string {
  const [first, ...rest] = fullName.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last.charAt(0)}.` : first;
}

export function formatPhoneNumberFR(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
