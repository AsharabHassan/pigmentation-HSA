"use client";
import { useEffect, useState } from "react";
import { matchHeadline, type HeadlineRule } from "./headline-map";

interface Props {
  fallback?: string;
  className?: string;
  rules?: HeadlineRule[];
}

export function DynamicHeadline({ fallback, className, rules }: Props) {
  const [headline, setHeadline] = useState(fallback ?? matchHeadline(null, rules, fallback));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const term = params.get("utm_term");
    setHeadline(matchHeadline(term, rules, fallback));
  }, [rules, fallback]);

  return <h1 className={className}>{headline}</h1>;
}
