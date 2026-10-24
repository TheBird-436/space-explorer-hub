const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Compass, Orbit, Zap } from "lucide-react";

import HomeHero from "@/components/HomeHero";
import DailyScan from "@/components/DailyScan";
import CelestialCard from "@/components/CelestialCard";
import ObjectDetailDialog from "@/components/ObjectDetailDialog";
import { levelFor, nextLevelAt, useProgress } from "@/lib/progress";

const TILES = [
  {
    to: "/explore",
    icon: Compass,
    title: "Explore the universe",
    text: "Planets, moons, stars and black holes — collect a card for every one you discover.",
  },
  {
    to: "/quiz",
    icon: Brain,
    title: "Cosmic quiz",
    text: "Quick challenges with instant answers. Every correct answer earns XP.",
  },
  {
    to: "/build",
    icon: Orbit,
    title: "Build a solar system",
    text: "Add your own worlds, set their orbits, then watch them spin.",
  },
];

export default function Home() {
  const { progress, discover, isDiscovered } = useProgress();
  const [objects, setObjects] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    db.entities.CelestialObject.filter({}, { sort: "sort_order", limit: 100 }).then((page) =>
      setObjects(page.items ?? [])
    );
  }, []);

  const level = levelFor(progress.xp);
  const nextLevel = nextLevelAt(progress.xp);
  const range = nextLevel ? nextLevel - level.min : 1;
  const percent = nextLevel ? Math.min(100, Math.round(((progress.xp - level.min) / range) * 100)) : 100;
  const featured = objects.length ? objects[Math.floor(Date.now() / 86400000) % objects.length] : null;

  const stats = [
    { label: "Cards collected", value: progress.discovered.length },
    { label: "Quizzes taken", value: progress.quizzesTaken },
    { label: "Systems built", value: progress.systemsBuilt },
  ];

  return (
    <div className="space-y-8">
      <HomeHero />

      <DailyScan objects={objects} />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-border/60 bg-card/50 p-6 backdrop-blur lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Explorer rank</p>
              <h2 className="mt-1 font-display text-2xl font-semibold">{level.title}</h2>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent">
              <Zap className="h-4 w-4" />
              {progress.xp} XP
            </span>
          </div>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {nextLevel
              ? `${nextLevel - progress.xp} XP to the next rank`
              : "Highest rank reached — you're a Cosmic Legend."}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/50 bg-background/40 p-3">
                <p className="font-display text-xl font-semibold">{stat.value}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/60 bg-card/50 p-6 text-center backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">World of the day</p>
          {featured ? (
            <div className="mt-4 flex justify-center">
              <CelestialCard object={featured} discovered={isDiscovered(featured.id)} onOpen={setActive} />
            </div>
          ) : (
            <div className="mt-6 h-40 animate-pulse rounded-3xl bg-white/5" />
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {TILES.map((tile) => (
          <Link
            key={tile.to}
            to={tile.to}
            className="group rounded-[2rem] border border-border/60 bg-card/50 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/80"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
              <tile.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">{tile.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tile.text}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <ObjectDetailDialog
        object={active}
        open={Boolean(active)}
        onOpenChange={(open) => !open && setActive(null)}
        discovered={active ? isDiscovered(active.id) : false}
        onCollect={(object) => discover(object.id, object.xp_reward ?? 10)}
      />
    </div>
  );
}