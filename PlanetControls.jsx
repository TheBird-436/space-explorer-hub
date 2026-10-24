import { useEffect, useState } from "react";
import { Plus, Shuffle, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import HowToPlay from "@/components/HowToPlay";
import PlanetSphere from "@/components/PlanetSphere";
import { PLANET_COLORS, SOLAR_SYSTEM_PRESET, randomSystem } from "@/lib/space";

const SLIDERS = [
  { key: "size", label: "Size", min: 4, max: 16, step: 1, hint: "4 is a small rocky world, 16 is a gas giant." },
  {
    key: "distance",
    label: "Orbit distance",
    min: 12,
    max: 47,
    step: 1,
    hint: "How far out it circles the star — 12 hugs it closely, 47 sits near the edge.",
  },
  { key: "speed", label: "Speed", min: 1, max: 10, step: 1, hint: "1 drifts slowly around the star, 10 races." },
];

export default function PlanetControls({ planets, onAdd, onRemove, onReplace, onPreview }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PLANET_COLORS[0]);
  const [values, setValues] = useState({ size: [7], distance: [28], speed: [6] });

  const draft = {
    name: name.trim() || `World ${planets.length + 1}`,
    color,
    size: values.size[0],
    distance: values.distance[0],
    speed: values.speed[0],
  };

  useEffect(() => {
    onPreview(draft);
  }, [draft.name, draft.color, draft.size, draft.distance, draft.speed, onPreview]);

  const add = () => {
    onAdd(draft);
    setName("");
  };

  return (
    <div className="space-y-5 rounded-[2rem] border border-border/60 bg-card/50 p-5 backdrop-blur">
      <HowToPlay />

      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Add a world
        </h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planet-name">Name</Label>
            <Input
              id="planet-name"
              value={name}
              maxLength={24}
              placeholder="My new planet"
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Colour</Label>
            <div className="flex flex-wrap gap-2">
              {PLANET_COLORS.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  aria-label={`Use colour ${swatch}`}
                  onClick={() => setColor(swatch)}
                  className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === swatch ? "border-foreground" : "border-transparent"
                  }`}
                  style={{ background: swatch }}
                />
              ))}
            </div>
          </div>

          {SLIDERS.map((slider) => (
            <div key={slider.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{slider.label}</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{values[slider.key][0]}</span>
              </div>
              <Slider
                value={values[slider.key]}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                onValueChange={(next) => setValues((current) => ({ ...current, [slider.key]: next }))}
              />
              <p className="text-[11px] leading-snug text-muted-foreground">{slider.hint}</p>
            </div>
          ))}

          <Button className="w-full rounded-full" onClick={add}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add to my system
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 rounded-full" onClick={() => onReplace(randomSystem(5))}>
          <Shuffle className="mr-1.5 h-4 w-4" />
          Surprise me
        </Button>
        <Button variant="outline" className="flex-1 rounded-full" onClick={() => onReplace(SOLAR_SYSTEM_PRESET)}>
          <Sparkles className="mr-1.5 h-4 w-4" />
          Our system
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          In orbit ({planets.length})
        </h3>
        {planets.length === 0 && (
          <p className="text-sm text-muted-foreground">Nothing here yet — add your first world above.</p>
        )}
        <div className="space-y-1.5">
          {planets.map((planet) => (
            <div
              key={planet.id}
              className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 px-3 py-2"
            >
              <PlanetSphere color={planet.color} size={22} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{planet.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  size {planet.size} · orbit {planet.distance} · speed {planet.speed}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${planet.name}`}
                onClick={() => onRemove(planet.id)}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}