const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type Service = {
  id: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  bufferMinutes: number;
  price: string;
  active: boolean;
};

export type Timeslot = {
  startsAt: string;
  endsAt: string;
};

export type Booking = {
  id: number;
  serviceId: number;
  customerFirstname: string;
  customerLastname: string;
  customerEmail: string;
  customerPhone: string | null;
  beneficiaryFirstname: string | null;
  beneficiaryLastname: string | null;
  beneficiaryPhone: string | null;
  notes: string | null;
  startsAt: string;
  endsAt: string;
  status: "CONFIRMED" | "CANCELLED";
  cancelToken: string;
  service: Service;
};

export type AdminUser = {
  userId: number;
  email: string;
};

export type Exception = {
  id: number;
  date: string;
  isClosed: boolean;
  startTime: string | null;
  endTime: string | null;
};

export type Availability = {
  id: number;
  weekday: number;
  startTime: string;
  endTime: string;
};

export type DashboardOverview = {
  upcomingCount: number;
  upcomingRevenue: number;
  monthBookingsCount: number;
  monthRevenue: number;
  nextBookings: Booking[];
  bookingsByService: { serviceName: string; count: number }[];
};

export type Client = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientWithBookings = Client & {
  bookings: Booking[];
};

export type ClientListItem = Client & {
  _count: { bookings: number };
};

export type EmailTemplateType =
  "CONFIRMATION" | "CANCELLATION" | "MODIFICATION";

export type EmailTemplate = {
  type: EmailTemplateType;
  subject: string;
  title: string;
  body: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const AUTH_PATHS = ["/auth/login", "/auth/refresh", "/auth/logout"];

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  allowRefreshRetry = true,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (res.status === 401 && allowRefreshRetry && !AUTH_PATHS.includes(path)) {
    const refreshed = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshed.ok) {
      return apiFetch<T>(path, init, false);
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.message ?? res.statusText, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  // Un DELETE peut répondre 200 avec un corps vide (NestJS ne renvoie pas
  // 204 par défaut) : res.json() lèverait une SyntaxError sur ce corps vide,
  // faisant passer une suppression réussie pour une erreur côté UI.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function getServices() {
  return apiFetch<Service[]>("/services", { next: { revalidate: 300 } });
}

export function getTimeslots(serviceId: number, date: string) {
  return apiFetch<Timeslot[]>(
    `/bookings/timeslots?serviceId=${serviceId}&date=${date}`,
    { cache: "no-store" },
  );
}

export function getAvailabilityDays(
  serviceId: number,
  from: string,
  days: number,
) {
  // Léger cache : cette vue "jour dispo/pas dispo" tolère 60s de latence
  // (contrairement aux créneaux horaires exacts, qui restent no-store),
  // et évite de refaire ~21 requêtes internes à chaque retour sur l'étape.
  return apiFetch<string[]>(
    `/bookings/availability-days?serviceId=${serviceId}&from=${from}&days=${days}`,
    { next: { revalidate: 60 } },
  );
}

export function createBooking(
  payload: {
    serviceId: number;
    startsAt: string;
    customerFirstname: string;
    customerLastname: string;
    customerEmail: string;
    customerPhone?: string;
    beneficiaryFirstname?: string;
    beneficiaryLastname?: string;
    beneficiaryPhone?: string;
    notes?: string;
  },
  idempotencyKey: string,
) {
  return apiFetch<Booking>("/bookings", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(payload),
  });
}

export function getBookingByCancelToken(token: string) {
  return apiFetch<Booking>(`/bookings/cancel/${token}`, { cache: "no-store" });
}

export function cancelBookingByToken(token: string) {
  return apiFetch<Booking>(`/bookings/cancel/${token}`, { method: "PATCH" });
}

export function submitContactMessage(payload: {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return apiFetch<{ success: true }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// --- Auth admin ---

export function login(email: string, password: string) {
  return apiFetch<{ success: true }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return apiFetch<{ success: true }>("/auth/logout", { method: "POST" });
}

export function getCurrentAdmin() {
  return apiFetch<AdminUser>("/auth/me", { cache: "no-store" });
}

// --- Services (admin) ---

export function getServicesAdmin() {
  return apiFetch<Service[]>("/services/admin", { cache: "no-store" });
}

export type ServiceInput = {
  name: string;
  description?: string;
  durationMinutes: number;
  bufferMinutes?: number;
  price: number;
  active?: boolean;
};

export function createService(payload: ServiceInput) {
  return apiFetch<Service>("/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateService(id: number, payload: Partial<ServiceInput>) {
  return apiFetch<Service>(`/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteService(id: number) {
  return apiFetch<void>(`/services/${id}`, { method: "DELETE" });
}

// --- Availability (admin) ---

export function getAvailabilities() {
  return apiFetch<Availability[]>("/availability/recurring", {
    cache: "no-store",
  });
}

export function createAvailability(payload: {
  weekday: number;
  startTime: string;
  endTime: string;
}) {
  return apiFetch<Availability>("/availability/recurring", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteAvailability(id: number) {
  return apiFetch<void>(`/availability/recurring/${id}`, { method: "DELETE" });
}

export function getExceptions() {
  return apiFetch<Exception[]>("/availability/exceptions", {
    cache: "no-store",
  });
}

export function createException(payload: {
  date: string;
  isClosed: boolean;
  startTime?: string;
  endTime?: string;
}) {
  return apiFetch<Exception>("/availability/exceptions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteException(id: number) {
  return apiFetch<void>(`/availability/exceptions/${id}`, { method: "DELETE" });
}

export function createExceptionRange(payload: {
  startDate: string;
  endDate: string;
  isClosed: boolean;
  startTime?: string;
  endTime?: string;
}) {
  return apiFetch<Exception[]>("/availability/exceptions/range", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function importFrenchHolidays(year: number) {
  return apiFetch<Exception[]>(
    "/availability/exceptions/import-french-holidays",
    {
      method: "POST",
      body: JSON.stringify({ year }),
    },
  );
}

export function removeAllExceptions() {
  return apiFetch<{ count: number }>("/availability/exceptions", {
    method: "DELETE",
  });
}

// --- Bookings (admin) ---

export function getBookingsAdmin(params?: { from?: string; to?: string }) {
  const query = new URLSearchParams();
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);
  const qs = query.toString();
  return apiFetch<Booking[]>(`/bookings/admin${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
}

export function getBookingAdmin(id: number) {
  return apiFetch<Booking>(`/bookings/admin/${id}`, { cache: "no-store" });
}

export function createBookingAdmin(payload: {
  serviceId: number;
  startsAt: string;
  customerFirstname: string;
  customerLastname: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
}) {
  return apiFetch<Booking>("/bookings/admin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function cancelBookingAdmin(id: number) {
  return apiFetch<Booking>(`/bookings/admin/${id}/cancel`, { method: "PATCH" });
}

export function updateBookingAdmin(
  id: number,
  payload: { serviceId?: number; startsAt?: string },
) {
  return apiFetch<Booking>(`/bookings/admin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// --- Dashboard ---

export function getDashboardOverview() {
  return apiFetch<DashboardOverview>("/dashboard/overview", {
    cache: "no-store",
  });
}

// --- Clients (admin) ---

export function getClients() {
  return apiFetch<ClientListItem[]>("/clients", { cache: "no-store" });
}

export function getClient(id: number) {
  return apiFetch<ClientWithBookings>(`/clients/${id}`, { cache: "no-store" });
}

// --- Email templates (admin) ---

export function getEmailTemplates() {
  return apiFetch<EmailTemplate[]>("/email-templates", { cache: "no-store" });
}

export function getEmailTemplate(type: EmailTemplateType) {
  return apiFetch<EmailTemplate>(`/email-templates/${type}`, {
    cache: "no-store",
  });
}

export function updateEmailTemplate(
  type: EmailTemplateType,
  payload: { subject: string; title: string; body: string },
) {
  return apiFetch<EmailTemplate>(`/email-templates/${type}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function previewEmailTemplate(
  type: EmailTemplateType,
  payload: { subject: string; title: string; body: string },
) {
  return apiFetch<{ subject: string; html: string }>(
    `/email-templates/${type}/preview`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
