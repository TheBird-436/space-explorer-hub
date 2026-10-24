import { useState } from "react";
import { Lightbulb, X } from "lucide-react";

const STORAGE_KEY = "space-explorer-how-to-play";

export default function HowToPlay() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === "hidden");

  if (dismissed) return null;

  return (
    <div className="relative rounded-2xl border border-accent/30 bg-accent/10 p-3.5 pr-9">
      <div className="flex items-start gap-2.5">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div className="space-y-1">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            How to play
          </p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Name your world, pick a colour, then drag the sliders. The dashed ghost on the canvas shows exactly
            where it will orbit and how big it will be — happy with it, hit "Add to my system".
          </p>
        </div>
      </div>
      <button
        type="button"
        aria-label="Hide how to play"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, "hidden");
          setDismissed(true);
        }}
        className="absolute right-2.5 top-2.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}