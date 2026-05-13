import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
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
