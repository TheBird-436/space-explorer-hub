import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import PlanetSphere from "@/components/PlanetSphere";
import { Button } from "@/components/ui/button";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/40 px-6 py-12 backdrop-blur sm:px-10 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 78% 28%, rgba(124,58,237,0.35), transparent 55%), radial-gradient(circle at 8% 85%, rgba(34,211,238,0.18), transparent 50%)",
        }}
      />
      <div className="animate-float pointer-events-none absolute -right-16 top-1/2 hidden -translate-y-1/2 lg:block">
        <PlanetSphere color="#7C3AED" size={200} ring />
      </div>

      <div className="relative max-w-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Play and learn
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          Explore the universe, <span className="text-primary">build your own</span>.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Discover real planets, moons, stars and black holes, collect a card for every world you meet, and design a
          solar system that spins exactly how you like it.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild className="rounded-full px-6">
            <Link to="/explore">
              Start exploring
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to="/build">Build a system</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}