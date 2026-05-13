import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface Props extends HTMLAttributes<HTMLSpanElement> { children?: ReactNode; }

export function Pill({ className, ...props }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 bg-ivory-100 text-ink-700 px-3 py-1.5 text-sm",
        className,
      )}
      {...props}
    />
  );
}
