"use client";

import { FormEvent, useState } from "react";
import { ApiError, submitContactMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await submitContactMessage({
        firstname: String(data.get("firstname") ?? ""),
        lastname: String(data.get("lastname") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? "") || undefined,
        message: String(data.get("message") ?? ""),
      });
      setStatus("success");
      form.reset();
      setPhone("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Une erreur est survenue, merci de réessayer.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="border border-sage-200 bg-white p-8 text-center">
        <h3 className="font-display text-2xl font-light text-sage-800">
          Message envoyé
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-stone-500">
          Merci pour votre message, je vous répondrai dans les plus brefs
          délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Prénom" name="firstname" required />
        <Field label="Nom" name="lastname" required />
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required />
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-[0.7rem] font-medium tracking-widest-plus text-sage-500 uppercase"
          >
            Téléphone
          </label>
          <PhoneInput
            id="phone"
            name="phone"
            value={phone}
            onChange={setPhone}
            className="w-full border-0 border-b border-sage-300 bg-transparent pb-2 text-stone-800 outline-none transition-colors focus:border-sage-700"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-[0.7rem] font-medium tracking-widest-plus text-sage-500 uppercase"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full resize-none border-0 border-b border-sage-300 bg-transparent pb-2 text-stone-800 outline-none transition-colors focus:border-sage-700"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <Button type="submit" disabled={status === "loading"} size="lg">
        {status === "loading" ? "Envoi en cours…" : "Envoyer"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-[0.7rem] font-medium tracking-widest-plus text-sage-500 uppercase"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border-0 border-b border-sage-300 bg-transparent pb-2 text-stone-800 outline-none transition-colors focus:border-sage-700"
      />
    </div>
  );
}
