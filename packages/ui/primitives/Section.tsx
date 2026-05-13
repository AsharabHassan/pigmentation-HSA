import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface Props extends HTMLAttributes<HTMLElement> { children?: ReactNode; }

export function Section({ className, ...props }: Props) {
  return (
    <section
      className={clsx("py-24 md:py-32", className)}
      {...props}
    />
  );
}
