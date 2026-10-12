import React, { useId } from "react";
import { COLORS } from "../brand";
import { aPath, dPath, pPath } from "./monogram";
import {
  DEPOT_PATHS,
  DEPOT_SIZE,
  LOCKUPS,
  PHUOC_PATHS,
  PHUOC_SIZE,
} from "./paths";

export type LogoVariant = "color" | "reversed";

/** Per-letter offset used while the monogram is being constructed. */
export type LetterMotion = {
  dx?: number;
  dy?: number;
  /** Horizontal stretch about the letter centre (motion-blur feel). */
  stretch?: number;
  opacity?: number;
};

export type LogoGroupProps = {
  /**
   * 0 = vertical lockup, 1 = horizontal lockup, in between = layout morph.
   * Pass {x, y} to move the wordmark horizontally and vertically on separate
   * curves (used to route it around the monogram).
   */
  layout?: number | { x: number; y: number };
  variant?: LogoVariant;
  /** Carving progress per letter, 0 = primitive shape, 1 = final letter. */
  morph?: { P: number; A: number; D: number };
  letters?: { P?: LetterMotion; A?: LetterMotion; D?: LetterMotion };
  /** Left-to-right mask wipe of "PHUOC AN" (0 to 1). */
  phuocReveal?: number;
  /** Rise-from-below reveal of "DEPOT" (0 to 1). */
  depotReveal?: number;
  wordmarkOpacity?: number;
  monogramOpacity?: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Size of the lockup's box in logo units for a given layout value. */
export const lockupSize = (layout: number) => ({
  width: lerp(LOCKUPS.vertical.width, LOCKUPS.horizontal.width, layout),
  height: lerp(LOCKUPS.vertical.height, LOCKUPS.horizontal.height, layout),
});

const LETTER_CENTERS = {
  P: [196.9, 150],
  A: [511.3, 150],
  D: [915.9, 150],
} as const;

/**
 * The PAD logo as an SVG group in logo units (monogram height = 300).
 * Place it inside any <svg> and scale it with a transform.
 * Colours are fixed to the approved versions: full colour or reversed
 * (white + orange). It is never rotated or distorted once constructed.
 */
export const LogoGroup: React.FC<LogoGroupProps> = ({
  layout = 0,
  variant = "color",
  morph = { P: 1, A: 1, D: 1 },
  letters = {},
  phuocReveal = 1,
  depotReveal = 1,
  wordmarkOpacity = 1,
  monogramOpacity = 1,
}) => {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const primary = variant === "color" ? COLORS.blue : COLORS.white;
  const accent = COLORS.orange;

  const v = LOCKUPS.vertical;
  const h = LOCKUPS.horizontal;
  const lx = typeof layout === "number" ? layout : layout.x;
  const ly = typeof layout === "number" ? layout : layout.y;
  const phuocX = lerp(v.phuoc.x, h.phuoc.x, lx);
  const phuocY = lerp(v.phuoc.y, h.phuoc.y, ly);
  const depotX = lerp(v.depot.x, h.depot.x, lx);
  const depotY = lerp(v.depot.y, h.depot.y, ly);

  const letter = (key: "P" | "A" | "D", d: string, fill: string) => {
    const m = letters[key] ?? {};
    const [cx, cy] = LETTER_CENTERS[key];
    const s = m.stretch ?? 1;
    const transform =
      `translate(${(m.dx ?? 0) + cx} ${(m.dy ?? 0) + cy}) ` +
      `scale(${s} ${1 / Math.sqrt(s)}) translate(${-cx} ${-cy})`;
    return (
      <path d={d} fill={fill} opacity={m.opacity ?? 1} transform={transform} />
    );
  };

  const depotShift = (1 - depotReveal) * (DEPOT_SIZE.height + 20);

  return (
    <g>
      <defs>
        <clipPath id={`${id}-phuoc`}>
          <rect
            x={-10}
            y={-30}
            width={(PHUOC_SIZE.width + 20) * phuocReveal}
            height={PHUOC_SIZE.height + 60}
          />
        </clipPath>
        <clipPath id={`${id}-depot`}>
          <rect
            x={-10}
            y={-30}
            width={DEPOT_SIZE.width + 20}
            height={DEPOT_SIZE.height + 30}
          />
        </clipPath>
      </defs>
      <g opacity={monogramOpacity}>
        {letter("P", pPath(morph.P), primary)}
        {letter("A", aPath(morph.A), primary)}
        {letter("D", dPath(morph.D), accent)}
      </g>
      <g opacity={wordmarkOpacity}>
        <g transform={`translate(${phuocX} ${phuocY})`}>
          <g clipPath={`url(#${id}-phuoc)`} fill={primary}>
            {PHUOC_PATHS.map((d) => (
              <path key={d.slice(0, 24)} d={d} />
            ))}
          </g>
        </g>
        <g transform={`translate(${depotX} ${depotY})`}>
          <g clipPath={`url(#${id}-depot)`}>
            <g transform={`translate(0 ${depotShift})`} fill={accent}>
              {DEPOT_PATHS.map((d) => (
                <path key={d.slice(0, 24)} d={d} />
              ))}
            </g>
          </g>
        </g>
      </g>
    </g>
  );
};

export type LogoProps = {
  /** Rendered height in pixels. */
  height: number;
  lockup?: "vertical" | "horizontal";
  variant?: LogoVariant;
  style?: React.CSSProperties;
};

/** Static logo for HTML layouts (header logo, captions). */
export const Logo: React.FC<LogoProps> = ({
  height,
  lockup = "horizontal",
  variant = "color",
  style,
}) => {
  const layout = lockup === "horizontal" ? 1 : 0;
  const size = lockupSize(layout);
  const width = (height / size.height) * size.width;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <LogoGroup layout={layout} variant={variant} />
    </svg>
  );
};

/** Pixel width of a lockup rendered at a given height. */
export const logoWidthForHeight = (
  height: number,
  lockup: "vertical" | "horizontal",
) => {
  const size = lockupSize(lockup === "horizontal" ? 1 : 0);
  return (height / size.height) * size.width;
};
