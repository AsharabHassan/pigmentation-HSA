import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type Width = "narrow" | "content" | "wide" | "bleed";

const widthMap: Record<Width, string> = {
  narrow: "max-w-[640px]",
  content: "max-w-[960px]",
  wide: "max-w-[1240px]",
  bleed: "max-w-none",
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  width?: Width;
  children?: ReactNode;
}

export function Container({ width = "content", className, ...props }: Props) {
  return <div className={clsx("mx-auto px-6 md:px-8", widthMap[width], className)} {...props} />;
}
