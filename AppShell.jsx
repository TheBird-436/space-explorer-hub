import { NavLink, Outlet } from "react-router-dom";
import { Brain, Compass, Orbit, Rocket, Zap } from "lucide-react";
import Starfield from "@/components/Starfield";
import SettingsPanel from "@/components/SettingsPanel";
import { levelFor, useProgress } from "@/lib/progress";
import { useAppearance } from "@/lib/appearance";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Mission Control", icon: Rocket },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/quiz", label: "Cosmic Quiz", icon: Brain },
  { to: "/build", label: "Build a System", icon: Orbit },
];

export default function AppShell() {
  const { progress } = useProgress();
  const { appearance } = useAppearance();
  const level = levelFor(progress.xp);
  const words = appearance.title.trim().split(/\s+/);
  const tail = words.length > 1 ? words.pop() : null;

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
              <span className="h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_18px_4px_rgba(167,139,250,0.6)]" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
              {tail ? `${words.join(" ")} ` : ""}
              <span className="text-primary">{tail ?? words[0]}</span>
            </span>
          </NavLink>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5">
              <Zap className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium tabular-nums">{progress.xp} XP</span>
              <span className="hidden text-xs text-muted-foreground sm:inline">· {level.title}</span>
            </div>
            <SettingsPanel />
          </div>
        </div>
        <nav className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )
              }
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}