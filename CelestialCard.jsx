import { Check } from "lucide-react";
import PlanetSphere from "@/components/PlanetSphere";
import { RARITY, TYPE_LABELS } from "@/lib/space";
import { cn } from "@/lib/utils";

export default function CelestialCard({ object, discovered, onOpen }) {
  const rarity = RARITY[object.rarity] ?? RARITY.common;

  return (
    <button
      type="button"
      onClick={() => onOpen(object)}
      className={cn(
        "group relative flex w-full flex-col items-center gap-4 rounded-3xl border border-border/60 bg-card/50 p-5 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/80",
        discovered && rarity.glow
      )}
    >
      <span
        className={cn(
          "absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
          rarity.chip
        )}
      >
        {rarity.label}
      </span>
      {discovered && (
        <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
      <div className="mt-3 transition-transform duration-500 group-hover:scale-105">
        <PlanetSphere color={object.color} size={68} ring={object.name === "Saturn"} />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-sm font-semibold leading-tight">{object.name}</h3>
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {TYPE_LABELS[object.type] ?? "Object"}
        </p>
      </div>
    </button>
  );
}