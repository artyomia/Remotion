import { ROUTE_ANGLE_DEG, SKEW_DEG } from "../brand";

export type Point = readonly [number, number];

/** Horizontal shift per pixel of height for the brand parallelogram skew. */
export const SKEW_T = Math.tan((Math.abs(SKEW_DEG) * Math.PI) / 180);
/** Horizontal run per pixel of rise for the 60 degree route-line kink. */
export const ROUTE_RUN = 1 / Math.tan((ROUTE_ANGLE_DEG * Math.PI) / 180);

const fmt = (n: number) => Math.round(n * 100) / 100;

/**
 * A forward-leaning parallelogram ("/" lean).
 * x, y: bottom-left corner of the bottom edge minus the height, i.e. the
 * parallelogram sits in the band [y, y + h]; x is the left end of the bottom
 * edge. w is the length of the top and bottom edges.
 */
export type Para = { x: number; y: number; w: number; h: number };

export const paraPoints = ({ x, y, w, h }: Para): Point[] => [
  [x + h * SKEW_T, y],
  [x + h * SKEW_T + w, y],
  [x + w, y + h],
  [x, y + h],
];

/** Total horizontal footprint of a parallelogram (edge width plus lean). */
export const paraFootprint = (w: number, h: number) => w + h * SKEW_T;

/**
 * Closed polygon path with softly rounded corners. Each corner is cut back by
 * up to `r` along both edges and joined with a quadratic curve.
 */
export const roundedPolygonPath = (points: Point[], r: number): string => {
  const n = points.length;
  if (r <= 0) {
    return `M${points.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join("L")}Z`;
  }
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const [px, py] = points[(i - 1 + n) % n];
    const [cx, cy] = points[i];
    const [nx, ny] = points[(i + 1) % n];
    const lenIn = Math.hypot(cx - px, cy - py);
    const lenOut = Math.hypot(nx - cx, ny - cy);
    const d = Math.min(r, lenIn / 2, lenOut / 2);
    const ax = cx + ((px - cx) / (lenIn || 1)) * d;
    const ay = cy + ((py - cy) / (lenIn || 1)) * d;
    const bx = cx + ((nx - cx) / (lenOut || 1)) * d;
    const by = cy + ((ny - cy) / (lenOut || 1)) * d;
    parts.push(
      `${i === 0 ? "M" : "L"}${fmt(ax)} ${fmt(ay)}Q${fmt(cx)} ${fmt(cy)} ${fmt(bx)} ${fmt(by)}`,
    );
  }
  return parts.join("") + "Z";
};

/** Open polyline path with rounded interior corners. */
export const roundedPolylinePath = (points: Point[], r: number): string => {
  const parts: string[] = [`M${fmt(points[0][0])} ${fmt(points[0][1])}`];
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const lenIn = Math.hypot(cx - px, cy - py);
    const lenOut = Math.hypot(nx - cx, ny - cy);
    const d = Math.min(r, lenIn / 2, lenOut / 2);
    const ax = cx + ((px - cx) / lenIn) * d;
    const ay = cy + ((py - cy) / lenIn) * d;
    const bx = cx + ((nx - cx) / lenOut) * d;
    const by = cy + ((ny - cy) / lenOut) * d;
    parts.push(
      `L${fmt(ax)} ${fmt(ay)}Q${fmt(cx)} ${fmt(cy)} ${fmt(bx)} ${fmt(by)}`,
    );
  }
  const last = points[points.length - 1];
  parts.push(`L${fmt(last[0])} ${fmt(last[1])}`);
  return parts.join("");
};

export const paraPath = (p: Para, r = 0) =>
  roundedPolygonPath(paraPoints(p), r);

/**
 * Route line: horizontal, a 60 degree kink upward, then horizontal again.
 * `kinkX` is where the climb starts, `rise` how far it climbs.
 */
export const routePoints = (
  x0: number,
  y0: number,
  kinkX: number,
  rise: number,
  x1: number,
): Point[] => [
  [x0, y0],
  [kinkX, y0],
  [kinkX + rise * ROUTE_RUN, y0 - rise],
  [x1, y0 - rise],
];

/**
 * Offset that keeps a translated copy of a route line at the same
 * perpendicular distance on both the flat and the diagonal segments.
 */
export const routeParallelOffset = (gap: number): Point => [
  gap * Math.tan(Math.PI / 6),
  gap,
];
