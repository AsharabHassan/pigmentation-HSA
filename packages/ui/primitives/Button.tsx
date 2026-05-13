import type { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "link";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-ivory-50 px-7 py-3.5 rounded-none " +
    "ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-50 " +
    "transition-colors duration-200 hover:bg-aubergine-900 " +
    "font-medium tracking-wide text-sm uppercase",
  secondary:
    "bg-transparent text-ink-900 border border-gold-500 px-7 py-3.5 " +
    "transition-colors duration-200 hover:bg-ink-900 hover:text-ivory-50 " +
    "font-medium tracking-wide text-sm uppercase",
  link:
    "text-ink-900 underline decoration-gold-500 underline-offset-4 " +
    "hover:decoration-gold-400 transition-colors duration-200",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={clsx(variants[variant], className)} {...props} />;
}
