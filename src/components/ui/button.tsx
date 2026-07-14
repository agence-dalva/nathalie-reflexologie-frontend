import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

const baseClasses =
  "group inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full text-[0.82rem] font-medium tracking-wide transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500 disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary: "bg-sage-800 text-cream hover:bg-sage-900",
  secondary:
    "bg-transparent text-sage-800 border border-sage-300 hover:border-sage-600 hover:bg-sage-50/50",
  light:
    "bg-cream text-sage-800 hover:bg-white",
  ghost: "text-sage-700 hover:text-sage-900",
};

const sizes = {
  md: "px-7 py-3",
  lg: "px-9 py-4 text-[0.88rem]",
};

// La flèche est toujours dans le DOM (largeur/opacité animées) pour un
// hover -> leave parfaitement fluide, sans jump ni remount.
function HoverArrow() {
  return (
    <ArrowRight
      aria-hidden
      className="ml-0 w-0 -translate-x-2 opacity-0 transition-all duration-300 ease-out group-hover:ml-0.5 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100"
      size={16}
      strokeWidth={2}
    />
  );
}

type Props = {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  withArrow?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  withArrow = true,
  ...rest
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
      {withArrow && <HoverArrow />}
    </button>
  );
}

export function LinkButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  withArrow = true,
}: Props & { href: string }) {
  return (
    <Link
      href={href}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {withArrow && <HoverArrow />}
    </Link>
  );
}
