"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { useBookingStore } from "@/stores/booking-store";

export function StepDetails() {
  const bookingFor = useBookingStore((s) => s.bookingFor);
  const customer = useBookingStore((s) => s.customer);
  const setCustomer = useBookingStore((s) => s.setCustomer);
  const beneficiary = useBookingStore((s) => s.beneficiary);
  const setBeneficiary = useBookingStore((s) => s.setBeneficiary);
  const goToStep = useBookingStore((s) => s.goToStep);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    goToStep("confirmation");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {bookingFor === "other" && (
        <div className="rounded-xl border border-terracotta-400/40 bg-terracotta-400/10 p-5">
          <p className="text-sm font-medium text-sage-900">
            Coordonnées de la personne qui vient au rendez-vous
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Vos coordonnées ci-dessous resteront le contact principal pour la
            confirmation et les rappels.
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="beneficiary-firstname"
                className="mb-1.5 block text-sm font-medium text-stone-600"
              >
                Prénom
              </label>
              <input
                id="beneficiary-firstname"
                required
                value={beneficiary.firstname}
                onChange={(e) => setBeneficiary({ firstname: e.target.value })}
                className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none transition-colors focus:border-sage-500"
              />
            </div>
            <div>
              <label
                htmlFor="beneficiary-lastname"
                className="mb-1.5 block text-sm font-medium text-stone-600"
              >
                Nom
              </label>
              <input
                id="beneficiary-lastname"
                required
                value={beneficiary.lastname}
                onChange={(e) => setBeneficiary({ lastname: e.target.value })}
                className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none transition-colors focus:border-sage-500"
              />
            </div>
          </div>
          <div className="mt-5">
            <label
              htmlFor="beneficiary-phone"
              className="mb-1.5 block text-sm font-medium text-stone-600"
            >
              Téléphone (facultatif)
            </label>
            <PhoneInput
              id="beneficiary-phone"
              value={beneficiary.phone}
              onChange={(value) => setBeneficiary({ phone: value })}
              className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none transition-colors focus:border-sage-500"
            />
          </div>
        </div>
      )}

      <p className="text-sm font-medium text-stone-600">
        {bookingFor === "other" ? "Vos coordonnées (personne qui réserve)" : "Vos coordonnées"}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstname"
            className="mb-1.5 block text-sm font-medium text-stone-600"
          >
            Prénom
          </label>
          <input
            id="firstname"
            required
            value={customer.firstname}
            onChange={(e) => setCustomer({ firstname: e.target.value })}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none transition-colors focus:border-sage-500"
          />
        </div>
        <div>
          <label
            htmlFor="lastname"
            className="mb-1.5 block text-sm font-medium text-stone-600"
          >
            Nom
          </label>
          <input
            id="lastname"
            required
            value={customer.lastname}
            onChange={(e) => setCustomer({ lastname: e.target.value })}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none transition-colors focus:border-sage-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-stone-600"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={customer.email}
            onChange={(e) => setCustomer({ email: e.target.value })}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none transition-colors focus:border-sage-500"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-stone-600"
          >
            Téléphone
          </label>
          <PhoneInput
            id="phone"
            value={customer.phone}
            onChange={(value) => setCustomer({ phone: value })}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none transition-colors focus:border-sage-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-1.5 block text-sm font-medium text-stone-600"
        >
          Message (facultatif)
        </label>
        <textarea
          id="notes"
          rows={3}
          value={customer.notes}
          onChange={(e) => setCustomer({ notes: e.target.value })}
          className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-stone-800 outline-none transition-colors focus:border-sage-500"
        />
      </div>

      <Button type="submit" size="lg" className="w-full cursor-pointer sm:w-auto">
        Continuer
      </Button>
    </form>
  );
}
