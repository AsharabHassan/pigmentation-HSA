import { Star } from "lucide-react";

interface Props {
  rating: number;
  reviewCount: number;
}

export function TrustRow({ rating, reviewCount }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 text-sm text-ivory-50/70">
      <span className="flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className="fill-gold-500 stroke-gold-500" aria-hidden />
        ))}
        <span className="ml-1 font-medium text-ivory-50">{rating.toFixed(1)}</span>
        <span>({reviewCount})</span>
      </span>
      <span className="h-1 w-1 rounded-full bg-gold-500/40" />
      <span className="text-xs uppercase tracking-[0.18em] text-gold-500">GMC ✓</span>
      <span className="text-xs uppercase tracking-[0.18em] text-gold-500">CQC ✓</span>
      <span className="text-xs uppercase tracking-[0.18em] text-gold-500">Harley St-trained</span>
    </div>
  );
}
