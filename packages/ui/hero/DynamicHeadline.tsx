"use client";
import { useEffect, useState } from "react";
import { matchHeadline } from "./headline-map";

interface Props {
  fallback?: string;
  className?: string;
}

export function DynamicHeadline({ fallback, className }: Props) {
  const [headline, setHeadline] = useState(fallback ?? matchHeadline(null));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const term = params.get("utm_term");
    setHeadline(matchHeadline(term));
  }, []);

  return <h1 className={className}>{headline}</h1>;
}
