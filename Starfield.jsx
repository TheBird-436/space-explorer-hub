import { useMemo } from "react";
import { GLOWS, useAppearance } from "@/lib/appearance";

export default function Starfield() {
  const { appearance } = useAppearance();
  const glow = GLOWS.find((option) => option.id === appearance.glow) ?? GLOWS[0];

  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => {
        const a = ((i * 9301 + 49297) % 233280) / 233280;
        const b = ((i * 4177 + 12345) % 99991) / 99991;
        return {
          left: `${(a * 100).toFixed(2)}%`,
          top: `${(b * 100).toFixed(2)}%`,
          size: 1 + (i % 3),
          delay: `${(b * 5).toFixed(2)}s`,
        };
      }),
    []
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: glow.css }} />
      {appearance.starfield &&
        stars.map((star, index) => (
          <span
            key={index}
            className="animate-twinkle absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              opacity: 0.6,
            }}
          />
        ))}
    </div>
  );
}