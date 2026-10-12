import React from "react";
import { paraFootprint, paraPath } from "../lib/geometry";

export type ParaMaskProps = {
  /** Left end of the bottom edge (px). */
  x: number;
  /** Top of the parallelogram (px). */
  y: number;
  /** Edge width and height (px). */
  w: number;
  h: number;
  radius?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/**
 * HTML container clipped to a forward-leaning parallelogram ("module block"
 * used as an image mask). Children are laid out in the full bounding box.
 */
export const ParaMask: React.FC<ParaMaskProps> = ({
  x,
  y,
  w,
  h,
  radius = 14,
  style,
  children,
}) => {
  const footprint = paraFootprint(w, h);
  const clip = paraPath({ x: 0, y: 0, w, h }, Math.min(radius, w / 2, h / 2));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: footprint,
        height: h,
        clipPath: `path('${clip}')`,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
