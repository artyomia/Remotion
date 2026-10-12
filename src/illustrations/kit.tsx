/**
 * Shared building blocks for the built-in vector illustrations that stand in
 * for photography until real photos are dropped into public/.
 */
import React, { useId } from "react";
import { random } from "remotion";
import { COLORS } from "../brand";

/** Container colours used across the port illustrations. */
export const CONTAINER_COLORS = [
  COLORS.navy,
  COLORS.blue,
  "#8796AC",
  "#C3CDDB",
  COLORS.navy,
  "#5E6F8A",
  COLORS.orange,
  "#E8ECF1",
] as const;

export const pickColor = (seed: string, weights = CONTAINER_COLORS) =>
  weights[Math.floor(random(seed) * weights.length)];

/** Stable, SVG-safe id prefix for one illustration instance. */
export const useSvgId = () => useId().replace(/[^a-zA-Z0-9_-]/g, "");

/**
 * Computes a viewBox for content of size (cw, ch) shown in a box (bw, bh).
 * maxCrop 0 = always show everything (letterbox with background),
 * 1 = always fill (cover). Values in between allow that much cropping of the
 * content before falling back to showing background around it.
 */
export const fitViewBox = (
  cw: number,
  ch: number,
  bw: number,
  bh: number,
  maxCrop: number,
) => {
  const contain = Math.min(bw / cw, bh / ch);
  const cover = Math.max(bw / cw, bh / ch);
  const scale = Math.min(cover, contain / Math.max(0.0001, 1 - maxCrop));
  const vw = bw / scale;
  const vh = bh / scale;
  return { x: (cw - vw) / 2, y: (ch - vh) / 2, w: vw, h: vh };
};

export type FrameProps = {
  contentWidth: number;
  contentHeight: number;
  width: number;
  height: number;
  maxCrop?: number;
  children: React.ReactNode;
};

/** Full-bleed SVG that frames the illustration content for any box size. */
export const IllustrationFrame: React.FC<FrameProps> = ({
  contentWidth,
  contentHeight,
  width,
  height,
  maxCrop = 0.2,
  children,
}) => {
  const vb = fitViewBox(
    contentWidth,
    contentHeight,
    Math.max(1, width),
    Math.max(1, height),
    maxCrop,
  );
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block", position: "absolute", inset: 0 }}
    >
      {children}
    </svg>
  );
};

/** Background rectangle large enough to cover any viewBox crop. */
export const Backdrop: React.FC<{ fill: string; w?: number; h?: number }> = ({
  fill,
  w = 1600,
  h = 1000,
}) => <rect x={-w * 2} y={-h * 2} width={w * 5} height={h * 5} fill={fill} />;

/** The one allowed shadow: soft and low, for mockup cards only. */
export const ShadowFilter: React.FC<{ id: string }> = ({ id }) => (
  <filter id={id} x="-30%" y="-30%" width="160%" height="170%">
    <feDropShadow
      dx="0"
      dy="20"
      stdDeviation="30"
      floodColor="#0F2E5B"
      floodOpacity="0.15"
    />
  </filter>
);

/** Vertical corrugation stripes, the container texture. */
export const CorrugationPattern: React.FC<{
  id: string;
  pitch?: number;
  opacity?: number;
}> = ({ id, pitch = 10, opacity = 0.14 }) => (
  <pattern id={id} width={pitch} height={10} patternUnits="userSpaceOnUse">
    <rect
      x={pitch * 0.55}
      width={pitch * 0.3}
      height={10}
      fill="#000"
      opacity={opacity}
    />
    <rect
      x={pitch * 0.1}
      width={pitch * 0.15}
      height={10}
      fill="#fff"
      opacity={opacity * 0.6}
    />
  </pattern>
);

/** Side view of a shipping container with corrugated panels and rails. */
export const ContainerSide: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  patternId: string;
}> = ({ x, y, w, h, color, patternId }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={color} />
    <rect
      x={x}
      y={y + h * 0.08}
      width={w}
      height={h * 0.84}
      fill={`url(#${patternId})`}
    />
    <rect x={x} y={y} width={w} height={h * 0.08} fill="#000" opacity={0.16} />
    <rect
      x={x}
      y={y + h * 0.92}
      width={w}
      height={h * 0.08}
      fill="#000"
      opacity={0.24}
    />
    <rect x={x} y={y} width={h * 0.09} height={h} fill="#000" opacity={0.18} />
    <rect
      x={x + w - h * 0.09}
      y={y}
      width={h * 0.09}
      height={h}
      fill="#000"
      opacity={0.18}
    />
  </g>
);

/** Top-down view of a container, for aerial yard scenes. */
export const ContainerTop: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}> = ({ x, y, w, h, color }) => {
  const ribs = Math.max(2, Math.round(w / 18));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} rx={2} />
      {Array.from({ length: ribs - 1 }, (_, i) => (
        <rect
          key={i}
          x={x + ((i + 1) * w) / ribs - 1}
          y={y + 3}
          width={2}
          height={h - 6}
          fill="#000"
          opacity={0.12}
        />
      ))}
    </g>
  );
};

/** Plain grey bars used as placeholder copy on mockups. */
export const TextBars: React.FC<{
  x: number;
  y: number;
  widths: number[];
  gap?: number;
  h?: number;
  color?: string;
}> = ({ x, y, widths, gap = 16, h = 7, color = "#D6DDE7" }) => (
  <g>
    {widths.map((w, i) => (
      <rect
        key={i}
        x={x}
        y={y + i * gap}
        width={w}
        height={h}
        rx={h / 2}
        fill={color}
      />
    ))}
  </g>
);

/** A wheel: tyre, rim and hub. */
export const Wheel: React.FC<{ cx: number; cy: number; r: number }> = ({
  cx,
  cy,
  r,
}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="#1F2633" />
    <circle cx={cx} cy={cy} r={r * 0.58} fill="#AEB8C6" />
    <circle cx={cx} cy={cy} r={r * 0.22} fill="#6B7789" />
  </g>
);
