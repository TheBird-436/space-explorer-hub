import { BookOpen, Star, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RARITY, TYPE_LABELS } from "@/lib/space";
import { cn } from "@/lib/utils";

const TITLES = {
  xp: "Bonus XP drop",
  fact: "Secret space fact",
  card: "Rare card found",
};

const BLURBS = {
  xp: "Your scan picked up a burst of cosmic energy.",
  fact: "Something you probably didn't know about the universe.",
  card: "The scan locked onto a rare world — and it's yours now.",
};

export default function DiscoveryDialog({ discovery, open, onOpenChange }) {
  const kind = discovery?.kind;
  const card = kind === "card" ? discovery.object : null;
  const rarity = card ? RARITY[card.rarity] ?? RARITY.common : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/60 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{TITLES[kind] ?? "Discovery"}</DialogTitle>
          <DialogDescription>{BLURBS[kind] ?? "Here is what your scan turned up."}</DialogDescription>
        </DialogHeader>

        {kind === "xp" && (
          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 text-center">
            <Zap className="mx-auto h-6 w-6 text-accent" />
            <p className="mt-2 font-display text-3xl font-semibold text-accent">+{discovery.xp} XP</p>
            <p className="mt-1 text-xs text-muted-foreground">Added straight to your explorer rank.</p>
          </div>
        )}

        {kind === "fact" && (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
            <BookOpen className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm leading-relaxed">{discovery.fact}</p>
          </div>
        )}

        {card && (
          <div className={cn("rounded-2xl border border-border/60 bg-background/50 p-6 text-center", rarity.glow)}>
            <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium", rarity.chip)}>
              {rarity.label}
            </span>
            <Star className="mx-auto mt-3 h-6 w-6 text-primary" />
            <h3 className="mt-2 font-display text-xl font-semibold">{card.name}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {TYPE_LABELS[card.type] ?? card.type}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.summary}</p>
            <p className="mt-3 text-xs text-accent">+{card.xp_reward ?? 25} XP · added to your collection</p>
          </div>
        )}

        <p className="text-center text-[11px] text-muted-foreground">
          Your next scan unlocks 24 hours from now.
        </p>

        <Button className="w-full rounded-full" onClick={() => onOpenChange(false)}>
          Back to Mission Control
        </Button>
      </DialogContent>
    </Dialog>
  );
}