import { Check, Moon as MoonIcon, Orbit, Rocket, Ruler, Sparkles, Timer } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PlanetSphere from "@/components/PlanetSphere";
import { Button } from "@/components/ui/button";
import { RARITY, TYPE_LABELS } from "@/lib/space";
import { cn } from "@/lib/utils";

export default function ObjectDetailDialog({ object, open, onOpenChange, discovered, onCollect }) {
  if (!object) return null;

  const rarity = RARITY[object.rarity] ?? RARITY.common;
  const stats = [
    { label: "Size", value: object.diameter, icon: Ruler },
    { label: "Distance", value: object.distance, icon: Orbit },
    { label: "Day length", value: object.day_length, icon: Timer },
    { label: "Year length", value: object.year_length, icon: Rocket },
    { label: "Moons", value: object.moons, icon: MoonIcon },
  ].filter((stat) => stat.value && stat.value !== "—");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-border/60 bg-card/95 backdrop-blur-xl sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-4 pr-6">
            <PlanetSphere color={object.color} size={72} ring={object.name === "Saturn"} />
            <div className="text-left">
              <span
                className={cn(
                  "inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  rarity.chip
                )}
              >
                {rarity.label} · {TYPE_LABELS[object.type] ?? "Object"}
              </span>
              <DialogTitle className="mt-2 font-display text-2xl">{object.name}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">{object.subtitle}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-sm leading-relaxed text-muted-foreground">{object.summary}</p>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/50 bg-background/40 p-3">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <stat.icon className="h-3 w-3" />
                  {stat.label}
                </div>
                <p className="mt-1 text-sm font-medium">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {object.facts?.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Did you know
            </h4>
            <ul className="space-y-2">
              {object.facts.map((fact) => (
                <li key={fact} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/50 bg-background/40 p-3">
          {discovered ? (
            <p className="flex items-center gap-2 text-sm text-accent">
              <Check className="h-4 w-4" />
              Card collected
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Collect the card to earn{" "}
              <span className="font-semibold text-foreground">+{object.xp_reward ?? 10} XP</span>
            </p>
          )}
          <Button disabled={discovered} onClick={() => onCollect(object)} className="rounded-full">
            {discovered ? "Collected" : "Collect card"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}