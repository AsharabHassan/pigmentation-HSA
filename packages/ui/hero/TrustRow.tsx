import { Star } from "lucide-react";
import { Pill } from "../primitives/Pill";

interface Props {
  rating: number;
  reviewCount: number;
}

export function TrustRow({ rating, reviewCount }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-8 text-sm text-ink-700">
      <span className="flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className="fill-gold-500 stroke-gold-500" aria-hidden />
        ))}
        <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
        <span className="text-ink-500">({reviewCount})</span>
      </span>
      <span className="text-ink-300">·</span>
      <Pill>GMC ✓</Pill>
      <Pill>CQC ✓</Pill>
      <Pill>Harley St-trained</Pill>
    </div>
  );
}
