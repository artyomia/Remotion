import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../brand";
import { progress } from "../lib/motion";

/** The 40x4 orange dash above every headline, scaling in from the left. */
export const AccentDash: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  color?: string;
  /** Optional frame at which the dash retracts to the left. */
  exitStart?: number;
  style?: React.CSSProperties;
}> = ({
  start = 0,
  width = 40,
  height = 4,
  color = COLORS.orange,
  exitStart,
  style,
}) => {
  const frame = useCurrentFrame();
  const grow = progress(frame, start, 12);
  const shrink = exitStart === undefined ? 0 : progress(frame, exitStart, 10);
  return (
    <div
      style={{
        width,
        height,
        background: color,
        transform: `scaleX(${grow * (1 - shrink)})`,
        transformOrigin: "left center",
        ...style,
      }}
    />
  );
};
