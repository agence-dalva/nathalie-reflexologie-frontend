import { create } from "zustand";
import type { Service, Timeslot } from "@/lib/api";

export type BookingStep = "service" | "slot" | "for" | "details" | "confirmation";

export type BookingFor = "self" | "other";

export type CustomerDetails = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  notes: string;
};

export type BeneficiaryDetails = {
  firstname: string;
  lastname: string;
  phone: string;
};

type BookingState = {
  step: BookingStep;
  history: BookingStep[];
  service: Service | null;
  selectedDate: string | null;
  selectedSlot: Timeslot | null;
  bookingFor: BookingFor | null;
  beneficiary: BeneficiaryDetails;
  customer: CustomerDetails;
  idempotencyKey: string;

  setService: (service: Service) => void;
  setSelectedDate: (date: string) => void;
  setSelectedSlot: (slot: Timeslot) => void;
  setBookingFor: (value: BookingFor) => void;
  setBeneficiary: (beneficiary: Partial<BeneficiaryDetails>) => void;
  setCustomer: (customer: Partial<CustomerDetails>) => void;
  /** Avance vers une étape en empilant l'étape courante dans l'historique (pour goBack). */
  goToStep: (step: BookingStep) => void;
  /** Revient à l'étape précédente réellement visitée (pas toujours "service"). */
  goBack: () => void;
  reset: () => void;
  /** Force-réapplique une prestation présélectionnée (ex: lien "Réserver" depuis /tarifs) même si un booking était déjà en cours. */
  applyPreselectedService: (service: Service) => void;
};

const emptyCustomer: CustomerDetails = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  notes: "",
};

const emptyBeneficiary: BeneficiaryDetails = {
  firstname: "",
  lastname: "",
  phone: "",
};

function newIdempotencyKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  step: "service",
  history: [],
  service: null,
  selectedDate: null,
  selectedSlot: null,
  bookingFor: null,
  beneficiary: emptyBeneficiary,
  customer: emptyCustomer,
  idempotencyKey: newIdempotencyKey(),

  setService: (service) =>
    set((state) => ({
      service,
      selectedDate: null,
      selectedSlot: null,
      step: "slot",
      history: [...state.history, state.step],
    })),
  setSelectedDate: (selectedDate) => set({ selectedDate, selectedSlot: null }),
  setSelectedSlot: (selectedSlot) =>
    set((state) => ({
      selectedSlot,
      step: "for",
      history: [...state.history, state.step],
    })),
  setBookingFor: (bookingFor) =>
    set((state) => ({
      bookingFor,
      beneficiary: emptyBeneficiary,
      step: "details",
      history: [...state.history, state.step],
    })),
  setBeneficiary: (partial) =>
    set((state) => ({ beneficiary: { ...state.beneficiary, ...partial } })),
  setCustomer: (partial) =>
    set((state) => ({ customer: { ...state.customer, ...partial } })),
  goToStep: (step) =>
    set((state) => ({ step, history: [...state.history, state.step] })),
  goBack: () => {
    const { history } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({ step: previous, history: history.slice(0, -1) });
  },
  reset: () =>
    set({
      step: "service",
      history: [],
      service: null,
      selectedDate: null,
      selectedSlot: null,
      bookingFor: null,
      beneficiary: emptyBeneficiary,
      customer: emptyCustomer,
      idempotencyKey: newIdempotencyKey(),
    }),
  applyPreselectedService: (service) =>
    set({
      service,
      selectedDate: null,
      selectedSlot: null,
      bookingFor: null,
      beneficiary: emptyBeneficiary,
      step: "slot",
      history: [],
    }),
}));
