/**
 * PAD line icons on a 64-unit grid: blue strokes, orange accents,
 * 2.5px stroke at the rendered size, rounded caps and joins.
 * Each icon draws itself path by path.
 */
import { evolvePath } from "@remotion/paths";
import React from "react";
import { COLORS } from "../brand";

type IconPath = { d: string; accent?: boolean };

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

export const ICONS: Record<string, IconPath[]> = {
  emptyContainer: [
    { d: "M8 18H44V46H8Z" },
    { d: "M16 23V41M24 23V41M32 23V41" },
    { d: "M44 18L54 22V50L44 46" },
    { d: "M46 34H62M57 29L62 34L57 39", accent: true },
  ],
  reposition: [
    { d: "M6 36H30V52H6Z" },
    { d: "M34 12H58V28H34Z" },
    { d: "M18 30C18 22 22 20 29 20M25 16L29 20L25 24", accent: true },
    { d: "M46 34C46 42 42 44 35 44M39 40L35 44L39 48", accent: true },
  ],
  trailerDrop: [
    { d: "M6 28H42V34H6Z" },
    { d: `${circle(34, 42, 5)}M14 34V46M9 46H19` },
    { d: "M48 18V46", accent: true },
    { d: "M52 32H61M57 28L61 32L57 36", accent: true },
  ],
  yardStorage: [
    { d: "M8 38H30V50H8Z" },
    { d: "M34 38H56V50H34Z" },
    { d: "M20 24H44V36H20Z" },
    { d: "M4 55H60", accent: true },
  ],
  tractor: [
    { d: "M10 44V24Q10 17 17 16H30V44" },
    { d: "M15 22H25V30H15Z" },
    { d: `M10 44H56M40 40H56${circle(19, 48, 5)}${circle(46, 48, 5)}` },
    { d: "M10 38H30", accent: true },
  ],
  office: [
    { d: "M14 54V14H42V54M42 26H52V54" },
    { d: "M20 22H24M30 22H34M20 30H24M30 30H34M20 38H24M30 38H34" },
    { d: "M8 54H58" },
    { d: "M25 54V46H31V54", accent: true },
  ],
  safety: [
    { d: "M32 8L52 16V30C52 44 43 52 32 56C21 52 12 44 12 30V16Z" },
    { d: "M23 31L30 38L42 25", accent: true },
  ],
  location: [
    { d: "M32 52C32 52 48 37 48 25A16 16 0 0 0 16 25C16 37 32 52 32 52Z" },
    { d: circle(32, 25, 6), accent: true },
    { d: "M6 58H22M42 58H58" },
  ],
};

export type IconName = keyof typeof ICONS;

/** One icon, drawn by `progress` (0 to 1). */
export const LineIcon: React.FC<{
  name: IconName;
  progress: number;
  size: number;
  /** Stroke width in screen pixels. */
  stroke?: number;
  color?: string;
  accent?: string;
}> = ({
  name,
  progress,
  size,
  stroke = 2.5,
  color = COLORS.blue,
  accent = COLORS.orange,
}) => {
  const paths = ICONS[name];
  const n = paths.length;
  const span = 0.45;
  const offset = n > 1 ? (1 - span) / (n - 1) : 0;
  const strokeWidth = stroke * (64 / size);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{ display: "block", overflow: "visible" }}
    >
      {paths.map((p, i) => {
        const local = Math.max(0, Math.min(1, (progress - i * offset) / span));
        if (local <= 0) {
          return null;
        }
        const evolved = evolvePath(local, p.d);
        return (
          <path
            key={p.d}
            d={p.d}
            fill="none"
            stroke={p.accent ? accent : color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={evolved.strokeDasharray}
            strokeDashoffset={evolved.strokeDashoffset}
          />
        );
      })}
    </svg>
  );
};
