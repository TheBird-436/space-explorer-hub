import PlanetSphere from "@/components/PlanetSphere";

export default function OrbitStage({
  planets,
  sunColor = "#FFB347",
  sunSize = 34,
  playing = true,
  systemName,
  ghost,
}) {
  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-border/60"
      style={{ background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.18), rgba(6,5,24,1) 62%)" }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <PlanetSphere color={sunColor} size={sunSize} />
      </div>

      {planets.map((planet) => (
        <div
          key={`ring-${planet.id}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
          style={{ width: `${planet.distance * 2}%`, height: `${planet.distance * 2}%` }}
        />
      ))}

      {planets.map((planet) => {
        const duration = Math.max(4, 34 - planet.speed * 3);
        return (
          <div
            key={`orbit-${planet.id}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: `${planet.distance * 2}%`, height: `${planet.distance * 2}%` }}
          >
            <div
              className={playing ? "h-full w-full animate-orbit" : "h-full w-full"}
              style={{ animationDuration: `${duration}s` }}
            >
              <div className="flex h-0 w-full justify-center">
                <div
                  className={playing ? "animate-orbit" : ""}
                  style={{ animationDuration: `${duration}s`, animationDirection: "reverse" }}
                >
                  <PlanetSphere color={planet.color} size={planet.size} ring={planet.ring} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {ghost && (
        <>
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/60"
            style={{ width: `${ghost.distance * 2}%`, height: `${ghost.distance * 2}%` }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: `${ghost.distance * 2}%`, height: `${ghost.distance * 2}%` }}
          >
            <div className="flex h-0 w-full justify-center">
              <div className="opacity-65">
                <PlanetSphere color={ghost.color} size={ghost.size} />
              </div>
            </div>
          </div>
          <p className="absolute left-4 top-4 rounded-full border border-accent/40 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent">
            Ghost preview — {ghost.name}
          </p>
        </>
      )}

      {systemName && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {systemName}
        </p>
      )}
    </div>
  );
}