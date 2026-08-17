import { ChevronDown } from "lucide-react";
import { SelectHTMLAttributes } from "react";

export function Select({
  className = "w-full",
  wrapperClassName = "",
  compact = false,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  wrapperClassName?: string;
  /** Rembourrages resserrés, pour une valeur très courte (ex: heures/minutes). */
  compact?: boolean;
}) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        {...props}
        className={`appearance-none rounded-xl border border-sage-200 bg-white text-sm text-stone-800 outline-none focus:border-sage-500 ${
          compact ? "py-2.5 pr-7 pl-2.5" : "py-2.5 pr-10 pl-3"
        } ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        size={compact ? 14 : 16}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-stone-400 ${
          compact ? "right-1.5" : "right-3"
        }`}
      />
    </div>
  );
}
