const STORAGE_KEY = "space-explorer-daily-scan";

export const SCAN_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const XP_DROPS = [20, 35, 50];

export const SPACE_FACTS = [
  "A day on Venus lasts longer than its year — it takes 243 Earth days to spin once.",
  "A single teaspoon of neutron star would weigh about as much as Mount Everest.",
  "Jupiter's Great Red Spot is a storm that has been raging for centuries.",
  "Saturn is so light for its size that it would float in water.",
  "Sunlight takes about 8 minutes and 20 seconds to reach your eyes.",
  "There are more stars in the universe than grains of sand on every beach on Earth.",
  "Olympus Mons on Mars is almost three times the height of Mount Everest.",
  "Sound cannot travel in space, so every explosion up there is silent.",
  "The footprints Apollo astronauts left on the Moon could survive for millions of years.",
  "Our galaxy is on a slow collision course with Andromeda — in about 4 billion years.",
  "A year on Mercury is just 88 Earth days, but its day lasts 59 Earth days.",
  "Neptune's winds are the fastest in the solar system, reaching 2,100 km/h.",
];

const RARE_TIERS = ["rare", "epic", "legendary"];

function storedTimestamp() {
  const value = Number(localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function msUntilNextScan(now = Date.now()) {
  const remaining = storedTimestamp() + SCAN_COOLDOWN_MS - now;
  return remaining > 0 ? remaining : 0;
}

export function markScanned() {
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

export function formatCountdown(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value) => String(value).padStart(2, "0");
  return hours > 0 ? `${hours}h ${pad(minutes)}m ${pad(seconds)}s` : `${minutes}m ${pad(seconds)}s`;
}

export function rollDiscovery(objects = [], discovered = []) {
  const pool = objects.filter(
    (object) => RARE_TIERS.includes(object.rarity) && !discovered.includes(object.id)
  );
  const roll = Math.random();

  if (roll < 0.34) {
    return { kind: "xp", xp: XP_DROPS[Math.floor(Math.random() * XP_DROPS.length)] };
  }

  if (roll < 0.67 || pool.length === 0) {
    return { kind: "fact", fact: SPACE_FACTS[Math.floor(Math.random() * SPACE_FACTS.length)] };
  }

  return { kind: "card", object: pool[Math.floor(Math.random() * pool.length)] };
}