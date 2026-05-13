import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <article
      className={clsx(
        "bg-ivory-100 border border-ink-300/40 p-8",
        "transition-shadow duration-300 hover:shadow-[0_8px_30px_-12px_rgba(42,20,34,0.18)]",
        className,
      )}
      {...props}
    />
  );
}
