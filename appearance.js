import { useEffect, useState } from "react";

const STORAGE_KEY = "space-explorer-appearance";
const EVENT = "space-explorer-appearance-change";

export const ACCENTS = [
  { id: "violet", label: "Nebula violet", hsl: "265 88% 70%", swatch: "#8B5CF6" },
  { id: "cyan", label: "Ion cyan", hsl: "189 90% 56%", swatch: "#22D3EE" },
  { id: "amber", label: "Solar gold", hsl: "38 92% 62%", swatch: "#F59E0B" },
  { id: "emerald", label: "Comet green", hsl: "160 84% 50%", swatch: "#34D399" },
  { id: "rose", label: "Supernova rose", hsl: "330 85% 70%", swatch: "#F472B6" },
  { id: "blue", label: "Deep blue", hsl: "217 91% 70%", swatch: "#60A5FA" },
];

export const GLOWS = [
  {
    id: "nebula",
    label: "Nebula",
    css: "radial-gradient(circle at 18% 8%, rgba(124,58,237,0.22), transparent 55%), radial-gradient(circle at 82% 4%, rgba(34,211,238,0.16), transparent 50%)",
  },
  {
    id: "solar",
    label: "Solar flare",
    css: "radial-gradient(circle at 20% 6%, rgba(249,115,22,0.24), transparent 55%), radial-gradient(circle at 80% 2%, rgba(236,72,153,0.16), transparent 50%)",
  },
  {
    id: "aurora",
    label: "Aurora",
    css: "radial-gradient(circle at 15% 10%, rgba(16,185,129,0.22), transparent 55%), radial-gradient(circle at 85% 6%, rgba(56,189,248,0.18), transparent 50%)",
  },
  {
    id: "ember",
    label: "Ember",
    css: "radial-gradient(circle at 25% 8%, rgba(239,68,68,0.20), transparent 55%), radial-gradient(circle at 75% 2%, rgba(245,158,11,0.16), transparent 50%)",
  },
  {
    id: "void",
    label: "Deep void",
    css: "radial-gradient(circle at 50% 0%, rgba(148,163,184,0.10), transparent 60%)",
  },
];

export const DEFAULT_APPEARANCE = {
  title: "Space Explorer Hub",
  accent: "violet",
  glow: "nebula",
  starfield: true,
};

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_APPEARANCE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_APPEARANCE,
      ...parsed,
      title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title : DEFAULT_APPEARANCE.title,
    };
  } catch {
    return { ...DEFAULT_APPEARANCE };
  }
}

function save(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(EVENT));
}

function apply(settings) {
  const accent = ACCENTS.find((option) => option.id === settings.accent) ?? ACCENTS[0];
  const root = document.documentElement;
  root.style.setProperty("--primary", accent.hsl);
  root.style.setProperty("--ring", accent.hsl);
  root.style.setProperty("--sidebar-primary", accent.hsl);
  root.style.setProperty("--sidebar-ring", accent.hsl);
}

export function useAppearance() {
  const [appearance, setAppearance] = useState(read);

  useEffect(() => {
    apply(appearance);
  }, [appearance]);

  useEffect(() => {
    const sync = () => setAppearance(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = (patch) => save({ ...read(), ...patch });

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(EVENT));
  };

  return { appearance, update, reset };
}