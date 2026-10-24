const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from "react";

import CelestialCard from "@/components/CelestialCard";
import ObjectDetailDialog from "@/components/ObjectDetailDialog";
import { TYPE_FILTERS } from "@/lib/space";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export default function Explore() {
  const { progress, discover, isDiscovered } = useProgress();
  const [filter, setFilter] = useState("all");
  const [objects, setObjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    db.entities.CelestialObject.count({}).then(setTotal);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const query = filter === "all" ? {} : { type: filter };
    db.entities.CelestialObject.filter(query, { sort: "sort_order", limit: 100 })
      .then((page) => {
        if (!cancelled) setObjects(page.items ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Explore the universe</h1>
        <p className="text-sm text-muted-foreground">
          Open anything that catches your eye, then collect its card. You've discovered{" "}
          <span className="font-semibold text-foreground">{progress.discovered.length}</span> of {total || "…"} objects.
        </p>
      </header>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {TYPE_FILTERS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => setFilter(chip.value)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              filter === chip.value
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-3xl border border-border/40 bg-card/30" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {objects.map((object) => (
            <CelestialCard
              key={object.id}
              object={object}
              discovered={isDiscovered(object.id)}
              onOpen={setActive}
            />
          ))}
        </div>
      )}

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