import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import React, { useId, useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, NEUTRALS } from "../brand";
import {
  roundedPolylinePath,
  routeParallelOffset,
  routePoints,
} from "../lib/geometry";
import { progress } from "../lib/motion";

export type RouteLineStyle = {
  /** Perpendicular distance from the hero line (px). Negative = above. */
  gap: number;
  dashed?: boolean;
  color?: string;
  width?: number;
};

export type RouteLinesProps = {
  /** Hero line geometry in pixels. */
  y: number;
  kinkX: number;
  rise: number;
  /** Lines start before the left edge and end past the right edge by default. */
  x0?: number;
  x1?: number;
  /** Frame (local) at which the hero line starts drawing. */
  start?: number;
  /** Frames the hero line takes to draw. */
  duration?: number;
  /** Delay between the hero line and each parallel line. */
  stagger?: number;
  parallels?: RouteLineStyle[];
  heroColor?: string;
  heroWidth?: number;
  cornerRadius?: number;
  opacity?: number;
  /** Small dot riding the tip of the hero line while it draws. */
  showTip?: boolean;
  /** Drawing area; defaults to the full video frame. */
  viewport?: { width: number; height: number };
};

export const DEFAULT_PARALLELS: RouteLineStyle[] = [
  { gap: -18, color: NEUTRALS.line, width: 1.5 },
  { gap: 18, dashed: true, color: NEUTRALS.line, width: 1.5 },
  { gap: 36, color: NEUTRALS.line, width: 1 },
];

/**
 * "Route lines": a 2px orange hero line that runs flat, kinks upward at
 * 60 degrees with rounded corners, then runs flat again, accompanied by thin
 * grey-blue solid and dashed parallels. Lines draw left to right with
 * strokeDashoffset.
 */
export const RouteLines: React.FC<RouteLinesProps> = ({
  y,
  kinkX,
  rise,
  x0 = -40,
  x1,
  start = 0,
  duration = 45,
  stagger = 6,
  parallels = DEFAULT_PARALLELS,
  heroColor = COLORS.orange,
  heroWidth = 2,
  cornerRadius = 36,
  opacity = 1,
  showTip = true,
  viewport,
}) => {
  const frame = useCurrentFrame();
  const video = useVideoConfig();
  const { width, height } = viewport ?? video;
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const end = x1 ?? width + 40;

  const lines = useMemo(() => {
    const all: Array<RouteLineStyle & { hero: boolean }> = [
      { gap: 0, color: heroColor, width: heroWidth, hero: true },
      ...parallels.map((p) => ({ ...p, hero: false })),
    ];
    return all.map((line) => {
      const [dx, dy] = routeParallelOffset(line.gap);
      const d = roundedPolylinePath(
        routePoints(
          x0 + dx - Math.abs(dx),
          y + dy,
          kinkX + dx,
          rise,
          end + Math.abs(dx),
        ),
        cornerRadius,
      );
      return { ...line, d, length: getLength(d) };
    });
  }, [heroColor, heroWidth, parallels, x0, y, kinkX, rise, end, cornerRadius]);

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, opacity }}
      viewBox={`0 0 ${width} ${height}`}
    >
      {lines.map((line, i) => {
        const p = progress(frame, start + i * stagger, duration);
        if (p <= 0) {
          return null;
        }
        const evolved = evolvePath(p, line.d);
        const stroke = line.color ?? NEUTRALS.line;
        const strokeWidth = line.width ?? 1.5;
        if (line.dashed) {
          // Dashed lines keep their dash pattern and are revealed by a mask
          // that draws itself with strokeDashoffset.
          const maskId = `${id}-m${i}`;
          return (
            <g key={line.d}>
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <path
                  d={line.d}
                  fill="none"
                  stroke="white"
                  strokeWidth={strokeWidth + 6}
                  strokeDasharray={evolved.strokeDasharray}
                  strokeDashoffset={evolved.strokeDashoffset}
                />
              </mask>
              <path
                d={line.d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray="8 8"
                strokeLinecap="round"
                mask={`url(#${maskId})`}
              />
            </g>
          );
        }
        return (
          <path
            key={line.d}
            d={line.d}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={evolved.strokeDasharray}
            strokeDashoffset={evolved.strokeDashoffset}
          />
        );
      })}
      {showTip
        ? (() => {
            const hero = lines[0];
            const p = progress(frame, start, duration);
            if (p <= 0 || p >= 1) {
              return null;
            }
            const pt = getPointAtLength(hero.d, hero.length * p);
            if (!pt) {
              return null;
            }
            return (
              <g>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={12}
                  fill={heroColor}
                  opacity={0.15}
                />
                <circle cx={pt.x} cy={pt.y} r={4.5} fill={heroColor} />
              </g>
            );
          })()
        : null}
    </svg>
  );
};
