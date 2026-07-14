"use client";

import { InputHTMLAttributes } from "react";
import { formatPhoneNumberFR } from "@/lib/format";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
};

export function PhoneInput({ value, onChange, className = "", ...rest }: Props) {
  return (
    <input
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="06 12 34 56 78"
      value={value}
      onChange={(e) => onChange(formatPhoneNumberFR(e.target.value))}
      className={className}
      {...rest}
    />
  );
}
