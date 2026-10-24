import { cn } from "@/lib/utils";

export default function PlanetSphere({ color, size = 56, ring = false, className }) {
  const inner = Math.round(size / 7);
  const blur = Math.round(size / 3);

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 33% 27%, ${color} 0%, ${color}aa 44%, #100e2a 100%)`,
          boxShadow: `inset -${inner}px -${inner}px ${blur}px rgba(3,2,15,0.75), 0 0 ${Math.round(size / 1.6)}px ${color}40`,
        }}
      />
      {ring && (
        <span
          className="absolute left-1/2 top-1/2 rounded-[50%] border"
          style={{
            width: size * 1.95,
            height: size * 0.6,
            borderColor: `${color}80`,
            transform: "translate(-50%, -50%) rotate(-16deg)",
          }}
        />
      )}
    </div>
  );
}