import { ChevronDown } from "lucide-react";
import { SelectHTMLAttributes } from "react";

export function Select({
  className = "w-full",
  wrapperClassName = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { wrapperClassName?: string }) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        {...props}
        className={`appearance-none rounded-xl border border-sage-200 bg-white py-2.5 pr-10 pl-3 text-sm text-stone-800 outline-none focus:border-sage-500 ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-stone-400"
      />
    </div>
  );
}
