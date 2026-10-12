import React, { useId } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, EASE_OUT } from "../brand";
import { paraPath } from "../lib/geometry";
import { tween } from "../lib/motion";

export type GlassPanelsProps = {
  /** Left edge of the panel cluster (px). Panels live to the right of it. */
  fromX?: number;
  /** Frame the panels start sliding in. */
  start?: number;
  /** Overall opacity multiplier. */
  opacity?: number;
  /** Use a deeper tint on dark backgrounds. */
  dark?: boolean;
};

type PanelSpec = {
  dx: number;
  y: number;
  w: number;
  h: number;
  drift: number;
  alpha: number;
};

/**
 * "Glass panels": large translucent parallelograms (white to light blue,
 * 0.3 to 0.6 opacity) that slide in and keep drifting slowly in parallax.
 * Each layer drifts at its own speed.
 */
export const GlassPanels: React.FC<GlassPanelsProps> = ({
  fromX,
  start = 0,
  opacity = 1,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const left = fromX ?? width * 0.55;
  const span = width - left;

  const panels: PanelSpec[] = [
    {
      dx: span * 0.05,
      y: -height * 0.08,
      w: span * 0.42,
      h: height * 1.1,
      drift: 0.35,
      alpha: 0.55,
    },
    {
      dx: span * 0.42,
      y: height * 0.12,
      w: span * 0.38,
      h: height * 0.95,
      drift: 0.6,
      alpha: 0.4,
    },
    {
      dx: span * 0.7,
      y: -height * 0.05,
      w: span * 0.5,
      h: height * 0.8,
      drift: 0.9,
      alpha: 0.3,
    },
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop
            offset="0"
            stopColor={COLORS.white}
            stopOpacity={dark ? 0.22 : 0.9}
          />
          <stop
            offset="1"
            stopColor={dark ? COLORS.blue : "#C8D6EA"}
            stopOpacity={dark ? 0.35 : 0.8}
          />
        </linearGradient>
      </defs>
      {panels.map((p, i) => {
        const enter = tween(
          frame,
          [start + i * 5, start + i * 5 + 30],
          [1, 0],
          EASE_OUT,
        );
        const x =
          left + p.dx + enter * (260 + i * 80) - (frame - start) * p.drift;
        const d = paraPath({ x, y: p.y, w: p.w, h: p.h }, 18);
        return (
          <g key={i} opacity={p.alpha * (1 - enter)}>
            <path d={d} fill={`url(#${id}-g)`} />
            <path
              d={d}
              fill="none"
              stroke={COLORS.white}
              strokeOpacity={0.9}
              strokeWidth={1.5}
            />
          </g>
        );
      })}
    </svg>
  );
};
