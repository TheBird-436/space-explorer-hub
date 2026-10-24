import { useEffect, useState } from "react";
import { Pause, Play, Save } from "lucide-react";
import OrbitStage from "@/components/OrbitStage";
import PlanetControls from "@/components/PlanetControls";
import SavedSystems from "@/components/SavedSystems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SOLAR_SYSTEM_PRESET } from "@/lib/space";
import { useProgress } from "@/lib/progress";
import { onSystemsChange, readSystems, writeSystems } from "@/lib/systems";

const withIds = (list) =>
  list.map((planet, index) => ({
    ...planet,
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
  }));

export default function SystemBuilder() {
  const { noteSystemSaved } = useProgress();
  const [systemName, setSystemName] = useState("My Solar System");
  const [planets, setPlanets] = useState(() => withIds(SOLAR_SYSTEM_PRESET));
  const [playing, setPlaying] = useState(true);
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(readSystems);
  const [flash, setFlash] = useState("");

  useEffect(() => onSystemsChange(() => setSaved(readSystems())), []);

  const persist = (list) => {
    writeSystems(list);
    setSaved(list);
  };

  const save = () => {
    const entry = {
      id: `${Date.now()}`,
      name: systemName.trim() || "Untitled system",
      planets,
      savedAt: new Date().toISOString(),
    };
    persist([entry, ...saved].slice(0, 8));
    noteSystemSaved();
    setFlash(`Saved “${entry.name}”`);
    window.setTimeout(() => setFlash(""), 2400);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Build a solar system</h1>
          <p className="text-sm text-muted-foreground">
            Add worlds, set how far out they orbit and how fast they spin around your star.
          </p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={() => setPlaying((value) => !value)}>
          {playing ? <Pause className="mr-1.5 h-4 w-4" /> : <Play className="mr-1.5 h-4 w-4" />}
          {playing ? "Pause orbits" : "Play orbits"}
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <OrbitStage planets={planets} playing={playing} systemName={systemName} ghost={preview} />

          <div className="flex flex-wrap items-center gap-3 rounded-[2rem] border border-border/60 bg-card/50 p-4 backdrop-blur">
            <Input
              value={systemName}
              maxLength={30}
              onChange={(event) => setSystemName(event.target.value)}
              className="h-10 min-w-[180px] flex-1"
              aria-label="System name"
            />
            <Button className="rounded-full" onClick={save}>
              <Save className="mr-1.5 h-4 w-4" />
              Save system
            </Button>
            {flash && <p className="text-sm text-accent">{flash}</p>}
          </div>

          <SavedSystems
            systems={saved}
            onLoad={(entry) => {
              setPlanets(withIds(entry.planets));
              setSystemName(entry.name);
            }}
            onDelete={(id) => persist(saved.filter((item) => item.id !== id))}
          />
        </div>

        <PlanetControls
          planets={planets}
          onAdd={(planet) => setPlanets((current) => [...current, ...withIds([planet])])}
          onRemove={(id) => setPlanets((current) => current.filter((planet) => planet.id !== id))}
          onReplace={(list) => setPlanets(withIds(list))}
          onPreview={setPreview}
        />
      </div>

    </div>
  );
}