export const TYPE_LABELS = {
  planet: "Planet",
  dwarf_planet: "Dwarf planet",
  moon: "Moon",
  star: "Star",
  galaxy: "Galaxy",
  deep_space: "Deep space",
  mission: "Mission",
};

export const TYPE_FILTERS = [
  { value: "all", label: "Everything" },
  { value: "planet", label: "Planets" },
  { value: "dwarf_planet", label: "Dwarf planets" },
  { value: "moon", label: "Moons" },
  { value: "star", label: "Stars" },
  { value: "galaxy", label: "Galaxies" },
  { value: "deep_space", label: "Deep space" },
  { value: "mission", label: "Missions" },
];

export const RARITY = {
  common: {
    label: "Common",
    chip: "border-white/15 bg-white/5 text-muted-foreground",
    glow: "",
  },
  rare: {
    label: "Rare",
    chip: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
    glow: "shadow-[0_0_36px_-10px_rgba(34,211,238,0.65)]",
  },
  epic: {
    label: "Epic",
    chip: "border-violet-400/30 bg-violet-500/10 text-violet-200",
    glow: "shadow-[0_0_42px_-10px_rgba(167,139,250,0.7)]",
  },
  legendary: {
    label: "Legendary",
    chip: "border-amber-400/30 bg-amber-500/10 text-amber-200",
    glow: "shadow-[0_0_46px_-10px_rgba(251,191,36,0.7)]",
  },
};

export const PLANET_COLORS = [
  "#7C3AED",
  "#22D3EE",
  "#F59E0B",
  "#EF4444",
  "#10B981",
  "#EC4899",
  "#6366F1",
  "#E2E8F0",
];

export const SOLAR_SYSTEM_PRESET = [
  { name: "Mercury", color: "#A9A29B", size: 4, distance: 13, speed: 9 },
  { name: "Venus", color: "#E6B87A", size: 5, distance: 18, speed: 8 },
  { name: "Earth", color: "#3B82F6", size: 6, distance: 23, speed: 7 },
  { name: "Mars", color: "#C1440E", size: 5, distance: 28, speed: 6 },
  { name: "Jupiter", color: "#D8A47F", size: 13, distance: 34, speed: 5 },
  { name: "Saturn", color: "#E3C88B", size: 11, distance: 40, speed: 4, ring: true },
  { name: "Uranus", color: "#8FD3D8", size: 9, distance: 44, speed: 3 },
  { name: "Neptune", color: "#3B5BDB", size: 9, distance: 47, speed: 2 },
];

export function randomSystem(count = 5) {
  return Array.from({ length: count }, (_, i) => ({
    name: `World ${i + 1}`,
    color: PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)],
    size: 5 + Math.floor(Math.random() * 10),
    distance: 15 + i * 8 + Math.floor(Math.random() * 4),
    speed: 2 + Math.floor(Math.random() * 8),
  }));
}

export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}