import { z } from "zod";

const phoneRegex = /^0[1-9](\s?\d{2}){4}$/;

const requiredName = z
  .string()
  .trim()
  .min(1, "Ce champ est requis");

const requiredPhone = z
  .string()
  .trim()
  .min(1, "Le téléphone est requis")
  .refine((value) => phoneRegex.test(value), "Numéro de téléphone invalide");

export const customerSchema = z.object({
  firstname: requiredName,
  lastname: requiredName,
  email: z.string().trim().min(1, "L'email est requis").email("Email invalide"),
  phone: requiredPhone,
  notes: z.string().optional(),
});

export const beneficiarySchema = z.object({
  firstname: requiredName,
  lastname: requiredName,
  phone: requiredPhone,
});

export type FieldErrors = Partial<Record<string, string>>;

function toFieldErrors(error: z.ZodError | undefined): FieldErrors {
  if (!error) return {};
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

export function validateCustomer(customer: unknown): FieldErrors {
  return toFieldErrors(customerSchema.safeParse(customer).error);
}

export function validateBeneficiary(beneficiary: unknown): FieldErrors {
  return toFieldErrors(beneficiarySchema.safeParse(beneficiary).error);
}
