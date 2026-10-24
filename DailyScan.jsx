import { useEffect, useRef, useState } from "react";
import { Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import DiscoveryDialog from "@/components/DiscoveryDialog";
import ScanningRadar from "@/components/ScanningRadar";
import { formatCountdown, markScanned, msUntilNextScan, rollDiscovery } from "@/lib/dailyScan";
import { useProgress } from "@/lib/progress";

const SCAN_MS = 2000;

export default function DailyScan({ objects = [] }) {
  const { progress, addXp, discover } = useProgress();
  const [remaining, setRemaining] = useState(msUntilNextScan);
  const [scanning, setScanning] = useState(false);
  const [discovery, setDiscovery] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(msUntilNextScan()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const scan = () => {
    if (scanning || remaining > 0) return;
    setScanning(true);
    timer.current = window.setTimeout(() => {
      const result = rollDiscovery(objects, progress.discovered);
      if (result.kind === "xp") addXp(result.xp);
      if (result.kind === "card") discover(result.object.id, result.object.xp_reward ?? 25);
      markScanned();
      setRemaining(msUntilNextScan());
      setScanning(false);
      setDiscovery(result);
      setRevealed(true);
    }, SCAN_MS);
  };

  const ready = remaining <= 0;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-card/60 p-6 backdrop-blur">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
      />
      {scanning ? (
        <ScanningRadar />
      ) : (
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Daily scan</p>
            <h2 className="mt-1 font-display text-2xl font-semibold">Sweep the sky for a discovery</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              One scan every 24 hours. You'll pull up a bonus XP drop, a secret space fact or a rare card.
            </p>
          </div>

          {ready ? (
            <span className="relative shrink-0">
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-2 animate-ping rounded-full bg-primary/25"
                style={{ animationDuration: "3s" }}
              />
              <Button
                size="lg"
                onClick={scan}
                className="relative rounded-full px-8 font-display uppercase tracking-[0.15em] shadow-[0_0_45px_-5px_hsl(var(--primary))]"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Daily Scan
              </Button>
            </span>
          ) : (
            <div className="shrink-0 space-y-2 text-center">
              <Button
                size="lg"
                disabled
                className="rounded-full px-6 font-display uppercase tracking-[0.15em]"
              >
                <Clock className="mr-2 h-4 w-4" />
                {formatCountdown(remaining)}
              </Button>
              <p className="text-[11px] text-muted-foreground">Scan recharges every 24 hours</p>
            </div>
          )}
        </div>
      )}

      <DiscoveryDialog discovery={discovery} open={revealed} onOpenChange={setRevealed} />
    </section>
  );
}