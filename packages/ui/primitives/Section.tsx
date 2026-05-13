import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={clsx("py-24 md:py-32", className)}
      {...props}
    />
  );
}
