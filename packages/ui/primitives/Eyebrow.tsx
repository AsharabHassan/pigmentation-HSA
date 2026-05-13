import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface Props extends HTMLAttributes<HTMLSpanElement> { children?: ReactNode; }

export function Eyebrow({ className, ...props }: Props) {
  return (
    <span
      className={clsx(
        "inline-block text-xs font-medium uppercase tracking-[0.12em] text-gold-500",
        className,
      )}
      {...props}
    />
  );
}
