import React from "react";
import { COLORS } from "../brand";
import { paraFootprint, paraPath } from "../lib/geometry";

export type ModuleFill = "blue" | "orange" | "grey" | "navy" | "outline";

const FILLS: Record<ModuleFill, string> = {
  blue: COLORS.blue,
  orange: COLORS.orange,
  grey: COLORS.greyBlue,
  navy: COLORS.navy,
  outline: "none",
};

export type ModuleBlockProps = {
  /** Left end of the bottom edge, in the parent's coordinates. */
  x: number;
  y: number;
  /** Edge width and height. */
  w: number;
  h: number;
  fill?: ModuleFill;
  /** Custom colour, overrides `fill`. */
  color?: string;
  radius?: number;
  opacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

/**
 * "Module block": a forward-leaning parallelogram with softly rounded corners.
 * Renders as SVG content, so place it inside an <svg>.
 */
export const ModuleBlock: React.FC<ModuleBlockProps> = ({
  x,
  y,
  w,
  h,
  fill = "blue",
  color,
  radius = 10,
  opacity = 1,
  strokeColor = COLORS.blue,
  strokeWidth = 2,
}) => {
  if (w <= 0.5 || h <= 0.5) {
    return null;
  }
  const outline = fill === "outline" && !color;
  return (
    <path
      d={paraPath({ x, y, w, h }, Math.min(radius, w / 2, h / 2))}
      fill={color ?? FILLS[fill]}
      stroke={outline ? strokeColor : "none"}
      strokeWidth={outline ? strokeWidth : 0}
      opacity={opacity}
    />
  );
};

/** Pixel footprint helper re-exported for layout code. */
export { paraFootprint };
