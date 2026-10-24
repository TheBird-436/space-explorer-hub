import { useEffect, useState } from "react";
import { clearSystems } from "@/lib/systems";

const STORAGE_KEY = "space-explorer-progress";
const EVENT = "space-explorer-progress-change";

const EMPTY = {
  xp: 0,
  discovered: [],
  quizzesTaken: 0,
  bestScore: 0,
  systemsBuilt: 0,
  badges: [],
};

export const LEVELS = [
  { min: 0, title: "Space Cadet" },
  { min: 100, title: "Star Pilot" },
  { min: 250, title: "Navigator" },
  { min: 500, title: "Deep Space Commander" },
  { min: 900, title: "Cosmic Legend" },
];

export const BADGES = [
  { id: "first-contact", name: "First Contact", description: "Discover your first object", icon: "Sparkles", test: (p) => p.discovered.length >= 1 },
  { id: "card-collector", name: "Card Collector", description: "Discover 5 objects", icon: "Layers", test: (p) => p.discovered.length >= 5 },
  { id: "cosmic-archivist", name: "Cosmic Archivist", description: "Discover 15 objects", icon: "BookOpen", test: (p) => p.discovered.length >= 15 },
  { id: "quiz-rookie", name: "Quiz Rookie", description: "Finish your first cosmic quiz", icon: "Brain", test: (p) => p.quizzesTaken >= 1 },
  { id: "perfect-mind", name: "Perfect Mind", description: "Score 100% on a quiz", icon: "Trophy", test: (p) => p.bestScore >= 100 },
  { id: "system-architect", name: "System Architect", description: "Save a solar system of your own", icon: "Orbit", test: (p) => p.systemsBuilt >= 1 },
  { id: "galaxy-brain", name: "Galaxy Brain", description: "Reach 500 XP", icon: "Rocket", test: (p) => p.xp >= 500 },
];

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
}

function write(next) {
  const payload = {
    ...next,
    badges: BADGES.filter((badge) => badge.test(next)).map((badge) => badge.id),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(EVENT));
  return payload;
}

export function levelFor(xp) {
  return LEVELS.reduce((acc, level) => (xp >= level.min ? level : acc), LEVELS[0]);
}

export function nextLevelAt(xp) {
  const next = LEVELS.find((level) => level.min > xp);
  return next ? next.min : null;
}

export function resetProgress() {
  clearSystems();
  return write({ ...EMPTY });
}

export function useProgress() {
  const [progress, setProgress] = useState(read);

  useEffect(() => {
    const sync = () => setProgress(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = (patch) => setProgress(write({ ...read(), ...patch }));

  return {
    progress,
    addXp: (amount) => update({ xp: read().xp + amount }),
    isDiscovered: (id) => progress.discovered.includes(id),
    discover: (id, xp = 10) => {
      const current = read();
      if (current.discovered.includes(id)) return false;
      update({ discovered: [...current.discovered, id], xp: current.xp + xp });
      return true;
    },
    recordQuiz: (score, xp) => {
      const current = read();
      update({
        quizzesTaken: current.quizzesTaken + 1,
        bestScore: Math.max(current.bestScore, score),
        xp: current.xp + xp,
      });
    },
    noteSystemSaved: () => update({ systemsBuilt: read().systemsBuilt + 1 }),
  };
}