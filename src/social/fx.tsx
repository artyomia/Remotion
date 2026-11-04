/**
 * Impact effects for the social debut: camera shake, flash, shockwave,
 * dust, speed lines, punch zoom and a horizontal motion-blur filter.
 * Everything is deterministic per frame so renders are repeatable.
 */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS, EASE_OUT } from "../brand";
import { progress } from "../lib/motion";

export type Impact = { at: number; amp: number; decay?: number };

/** Camera shake from a list of impacts. Returns a pixel offset. */
export const shakeAt = (frame: number, impacts: Impact[], seed = "shake") => {
  let x = 0;
  let y = 0;
  for (const { at, amp, decay = 6 } of impacts) {
    const t = frame - at;
    if (t < 0 || t > decay * 5) {
      continue;
    }
    const k = amp * Math.exp(-t / decay);
    x += k * (random(`${seed}-x-${frame}`) * 2 - 1);
    y += k * (random(`${seed}-y-${frame}`) * 2 - 1);
  }
  return { x, y };
};

/** Scale kick on a hit: jumps up by `amount` and settles in `duration` frames. */
export const punch = (
  frame: number,
  at: number,
  amount = 0.06,
  duration = 10,
) =>
  frame < at ? 1 : 1 + amount * (1 - progress(frame, at, duration, EASE_OUT));

/** Full-frame flash that peaks on `at` and decays. */
export const Flash: React.FC<{
  at: number;
  peak?: number;
  decay?: number;
  color?: string;
}> = ({ at, peak = 0.9, decay = 5, color = COLORS.white }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > decay * 6) {
    return null;
  }
  return (
    <AbsoluteFill
      style={{ background: color, opacity: peak * Math.exp(-t / decay) }}
    />
  );
};

/** Expanding ring from an impact point. */
export const Shockwave: React.FC<{
  at: number;
  cx: number;
  cy: number;
  r0?: number;
  r1: number;
  duration?: number;
  color?: string;
  width?: number;
  /** Vertical squash, < 1 for a ring lying on the ground. */
  squash?: number;
}> = ({
  at,
  cx,
  cy,
  r0 = 20,
  r1,
  duration = 18,
  color = COLORS.white,
  width = 10,
  squash = 1,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, duration, EASE_OUT);
  if (frame < at || p >= 1) {
    return null;
  }
  const r = r0 + (r1 - r0) * p;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <ellipse
        cx={cx}
        cy={cy}
        rx={r}
        ry={r * squash}
        fill="none"
        stroke={color}
        strokeWidth={width * (1 - p) + 1}
        opacity={1 - p}
      />
    </svg>
  );
};

/**
 * Dust thrown up by a heavy landing: fine particles on ballistic arcs plus
 * soft puffs rolling out along the ground.
 */
export const DustBurst: React.FC<{
  at: number;
  x: number;
  y: number;
  /** Width of the contact edge the dust comes from. */
  spread: number;
  count?: number;
  seed?: string;
  color?: string;
  scale?: number;
}> = ({
  at,
  x,
  y,
  spread,
  count = 46,
  seed = "dust",
  color = "#B9B4AA",
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 60) {
    return null;
  }
  const items: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const r = (k: string) => random(`${seed}-${i}-${k}`);
    const life = 18 + r("life") * 30;
    if (t > life) {
      continue;
    }
    const side = r("side") > 0.5 ? 1 : -1;
    const x0 = x + (r("x") - 0.5) * spread;
    const vx = side * (3 + r("vx") * 14) * scale;
    const vy = -(4 + r("vy") * 12) * scale;
    const drag = 0.93;
    const dist = (1 - Math.pow(drag, t)) / (1 - drag);
    const px = x0 + vx * dist;
    const py = y + vy * dist + 0.32 * scale * t * t * 0.5;
    if (py > y + 4) {
      continue;
    }
    items.push(
      <circle
        key={`p${i}`}
        cx={px}
        cy={py}
        r={(1.5 + r("size") * 4.5) * scale}
        fill={color}
        opacity={0.85 * (1 - t / life)}
      />,
    );
  }
  for (let i = 0; i < 9; i++) {
    const r = (k: string) => random(`${seed}-puff-${i}-${k}`);
    const p = progress(frame, at, 40 + r("d") * 14, EASE_OUT);
    const side = i % 2 === 0 ? 1 : -1;
    const px = x + side * (spread * 0.3 + p * (120 + r("x") * 200) * scale);
    const rad = (30 + p * (90 + r("r") * 70)) * scale;
    items.push(
      <circle
        key={`f${i}`}
        cx={px}
        cy={y - rad * 0.45}
        r={rad}
        fill={color}
        opacity={0.28 * (1 - p)}
      />,
    );
  }
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {items}
    </svg>
  );
};

/** Radial speed lines bursting from a point. */
export const SpeedBurst: React.FC<{
  at: number;
  cx: number;
  cy: number;
  duration?: number;
  count?: number;
  color?: string;
  inner?: number;
  outer?: number;
  seed?: string;
}> = ({
  at,
  cx,
  cy,
  duration = 14,
  count = 28,
  color = COLORS.white,
  inner = 260,
  outer = 1400,
  seed = "burst",
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, duration, EASE_OUT);
  if (frame < at || p >= 1) {
    return null;
  }
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + random(`${seed}-${i}`) * 0.2;
        const len = 120 + random(`${seed}-l-${i}`) * 260;
        const d0 = inner + p * (outer - inner);
        const d1 = d0 + len * (1 - p);
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * d0}
            y1={cy + Math.sin(a) * d0}
            x2={cx + Math.cos(a) * d1}
            y2={cy + Math.sin(a) * d1}
            stroke={color}
            strokeWidth={3 + random(`${seed}-w-${i}`) * 4}
            strokeLinecap="round"
            opacity={(1 - p) * 0.8}
          />
        );
      })}
    </svg>
  );
};

/** Horizontal streaks for fast lateral movement. */
export const Streaks: React.FC<{
  W: number;
  H: number;
  y0: number;
  y1: number;
  /** Pixels the streak field has scrolled. */
  offset: number;
  count?: number;
  color?: string;
  opacity?: number;
  seed?: string;
}> = ({
  W,
  H,
  y0,
  y1,
  offset,
  count = 22,
  color = COLORS.white,
  opacity = 0.35,
  seed = "streak",
}) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity }}>
    {Array.from({ length: count }, (_, i) => {
      const r = (k: string) => random(`${seed}-${i}-${k}`);
      const len = 120 + r("l") * 420;
      const span = W + len + 200;
      const x =
        ((((r("x") * span - offset * (0.6 + r("v") * 0.8)) % span) + span) %
          span) -
        len;
      const y = y0 + r("y") * (y1 - y0);
      return (
        <rect
          key={i}
          x={x}
          y={y}
          width={len}
          height={1.5 + r("h") * 3}
          rx={2}
          fill={color}
          opacity={0.4 + r("o") * 0.6}
        />
      );
    })}
  </svg>
);

/** SVG filter for horizontal motion blur. Place inside <defs>. */
export const HBlur: React.FC<{ id: string; amount: number }> = ({
  id,
  amount,
}) => (
  <filter id={id} x="-30%" y="-10%" width="160%" height="120%">
    <feGaussianBlur stdDeviation={`${Math.max(0, amount)} 0`} />
  </filter>
);

/** Soft dark edges. */
export const Vignette: React.FC<{ strength?: number; color?: string }> = ({
  strength = 0.55,
  color = "#020814",
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 45%, transparent 45%, ${color} 130%)`,
      opacity: strength,
      pointerEvents: "none",
    }}
  />
);
