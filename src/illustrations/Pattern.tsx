/**
 * Brand pattern: unit shapes derived from the PAD geometry (the P bowl
 * curve, the A triangle, the D square-curve and the P slot), tiled on a grid
 * and rotated or flipped per cell. Generated procedurally from a seed.
 */
import React from "react";
import { random, spring } from "remotion";
import { COLORS, SPRINGS } from "../brand";

type Unit = "quarter" | "triangle" | "dshape" | "slot" | "corner";

/** Unit shapes in a 0..1 cell. */
const UNIT_PATHS: Record<Unit, string> = {
  // P bowl: quarter disc
  quarter: "M0 1V0A1 1 0 0 1 1 1Z",
  // A: triangle with ~60 degree flanks
  triangle: "M0 1L0.5 0.13L1 1Z",
  // D: square with the right side fully rounded
  dshape: "M0 0H0.5A0.5 0.5 0 0 1 0.5 1H0Z",
  // P slot: bar with a rounded end
  slot: "M0 0.3H0.82A0.2 0.2 0 0 1 0.82 0.7H0Z",
  // D square-curve: square with one generous rounded corner
  corner: "M0 0H0.6A0.4 0.4 0 0 1 1 0.4V1H0Z",
};

const UNITS: Unit[] = [
  "quarter",
  "triangle",
  "dshape",
  "slot",
  "corner",
  "quarter",
  "dshape",
];

type Fill = { color: string; outline?: boolean } | null;

const FILLS: Fill[] = [
  { color: COLORS.blue },
  { color: COLORS.blue },
  { color: COLORS.blue },
  { color: COLORS.orange },
  { color: COLORS.orange },
  { color: COLORS.navy },
  { color: COLORS.greyBlue },
  { color: COLORS.greyBlue },
  { color: COLORS.blue, outline: true },
  null,
  null,
  null,
];

export type BrandPatternProps = {
  width: number;
  height: number;
  cell: number;
  /** Local frame used for the wave animation. */
  frame: number;
  fps: number;
  /** Frame at which the wave starts. */
  start: number;
  /** Frames of delay per diagonal step. */
  waveStep?: number;
  seed?: string;
  /** Return true to leave the cell centred at (cx, cy) empty. */
  exclude?: (cx: number, cy: number) => boolean;
};

/**
 * Tiles the pattern across the given area. Cells appear in a diagonal wave
 * from the top-left corner, each scaling up from its centre.
 */
export const BrandPattern: React.FC<BrandPatternProps> = ({
  width,
  height,
  cell,
  frame,
  fps,
  start,
  waveStep = 1.1,
  seed = "pad-pattern",
  exclude,
}) => {
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  const gap = cell * 0.08;
  const items: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${seed}-${r}-${c}`;
      if (exclude?.(c * cell + cell / 2, r * cell + cell / 2)) {
        continue;
      }
      const fill = FILLS[Math.floor(random(`${key}-fill`) * FILLS.length)];
      if (!fill) {
        continue;
      }
      const unit = UNITS[Math.floor(random(`${key}-unit`) * UNITS.length)];
      const rot = Math.floor(random(`${key}-rot`) * 4) * 90;
      const flip = random(`${key}-flip`) > 0.5 ? -1 : 1;
      const s = spring({
        frame: frame - start - (r + c) * waveStep,
        fps,
        config: SPRINGS.ui,
        durationInFrames: 16,
      });
      if (s <= 0.001) {
        continue;
      }
      const inner = cell - gap * 2;
      const cx = c * cell + cell / 2;
      const cy = r * cell + cell / 2;
      items.push(
        <g
          key={key}
          transform={`translate(${cx} ${cy}) scale(${s}) rotate(${rot}) scale(${flip} 1) translate(${-inner / 2} ${-inner / 2}) scale(${inner})`}
          opacity={Math.min(1, s * 1.4)}
        >
          <path
            d={UNIT_PATHS[unit]}
            fill={fill.outline ? "none" : fill.color}
            stroke={fill.outline ? fill.color : "none"}
            strokeWidth={fill.outline ? 2 / inner : 0}
          />
        </g>,
      );
    }
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      {items}
    </svg>
  );
};
