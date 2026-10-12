import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, CUES, FONTS, FONT_WEIGHTS, NEUTRALS, SCENES } from "../brand";
import { RouteLines } from "../components/RouteLines";
import { PageBackground, SceneChrome } from "../components/SceneChrome";
import { LetterMotion, LogoGroup, lockupSize } from "../logo/Logo";
import { LETTER_BOXES } from "../logo/monogram";
import { DEPOT_SIZE, LOCKUPS, MONO_SIZE, PHUOC_SIZE } from "../logo/paths";
import { Point, ROUTE_RUN } from "../lib/geometry";
import { useLayout } from "../lib/layout";
import { hitSpring, lerp, progress, tween } from "../lib/motion";
import { signalRoute } from "./Scene1Signal";

/** Local timeline of the hero scene (frame 0 = absolute frame 90). */
const T = {
  flyStart: 0,
  flyDuration: 34,
  flyStagger: 4,
  carveStart: 46,
  carveDuration: 12,
  hit: CUES.logoHit - SCENES.logo.from, // absolute frame 150
  pushEnd: 180,
  phuocStart: 80,
  phuocDuration: 24,
  depotDelay: 8,
  depotDuration: 22,
  guidesIn: 120,
  guidesOut: 172,
  layoutStart: 182,
  layoutDuration: 28,
} as const;

type LetterKey = "P" | "A" | "D";

/** Fractional frame offsets sampled behind each flying primitive. */
const SMEAR_LAGS = [0.8, 0.6, 0.4, 0.2];
const LETTERS: LetterKey[] = ["P", "A", "D"];

/**
 * Flight paths of the primitives, as pixel offsets from their final
 * position. P and D follow route-line shapes (flat, 60 degree kink, flat);
 * the A rises along the angle of its own legs.
 */
const FLIGHTS: Record<LetterKey, Point[]> = {
  P: [
    [-1700, 240],
    [-520, 240],
    [-520 + 240 * ROUTE_RUN, 0],
    [0, 0],
  ],
  A: [
    [-900 * ROUTE_RUN, 900],
    [0, 0],
  ],
  D: [
    [1700, -240],
    [520, -240],
    [520 - 240 * ROUTE_RUN, 0],
    [0, 0],
  ],
};

/** Point at fraction f (0 to 1) of a polyline's length. */
const pointOnPolyline = (pts: Point[], f: number): Point => {
  const lengths = pts
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0);
  let remaining = Math.max(0, Math.min(1, f)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] === 0 ? 1 : Math.min(1, remaining / lengths[i]);
      return [
        lerp(pts[i][0], pts[i + 1][0], t),
        lerp(pts[i][1], pts[i + 1][1], t),
      ];
    }
    remaining -= lengths[i];
  }
  return pts[pts.length - 1];
};

/** Fly-in progress of one letter, eased along its path. */
const flight = (frame: number, index: number) =>
  progress(frame, T.flyStart + index * T.flyStagger, T.flyDuration);

/**
 * Scene 2, "Logo Construction" (frames 90 to 300), the hero scene.
 * Primitives fly in along route paths, are carved into P, A and D with a
 * spring hit, the wordmark reveals, construction guides show the logo grid,
 * then the logo morphs to the horizontal lockup and parks as the header logo.
 */
export const Scene2LogoConstruction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layout = useLayout();
  const { width, height, margin, headerTop, headerLogoHeight, pick } = layout;

  /* ------------------------------ placement ------------------------------ */
  const vSize = lockupSize(0);
  const baseScale = pick(860, 760) / LOCKUPS.vertical.width;
  const centerX = width / 2;
  const centerY = pick(height / 2 + 6, height / 2 - 30);

  // Subtle camera push after the hit.
  const push = tween(frame, [T.hit - 2, T.pushEnd], [1, 1.04]);
  const startScale = baseScale * push;
  const startX = centerX - (vSize.width * startScale) / 2;
  const startY = centerY - (vSize.height * startScale) / 2;

  // Final move into the header position, with the layout morph.
  const move = progress(frame, T.layoutStart, T.layoutDuration);
  // The wordmark first slides right, clear of the D, then rises into place.
  const layoutMorph = {
    x: progress(frame, T.layoutStart, T.layoutDuration * 0.55),
    y: progress(
      frame,
      T.layoutStart + T.layoutDuration * 0.4,
      T.layoutDuration * 0.6,
    ),
  };
  const endScale = headerLogoHeight / LOCKUPS.horizontal.height;
  const scale = startScale * Math.pow(endScale / startScale, move);
  const x = lerp(startX, margin, move);
  const y = lerp(startY, headerTop, move);

  // Monogram "pop" on the hit: jumps up 6% and springs back.
  const hit = hitSpring(frame, fps, T.hit - 2);
  const pop = frame < T.hit - 2 ? 1 : interpolate(hit, [0, 1], [1.06, 1]);
  const monoCx = MONO_SIZE.width / 2;
  const monoCy = MONO_SIZE.height / 2;

  /* ---------------------------- construction ----------------------------- */
  const lettersAt = (f: number): Record<LetterKey, LetterMotion> => {
    const result = {} as Record<LetterKey, LetterMotion>;
    LETTERS.forEach((key, i) => {
      const p = flight(f, i);
      const pPrev = flight(f - 1, i);
      const [ox, oy] = pointOnPolyline(FLIGHTS[key], p);
      const [px, py] = pointOnPolyline(FLIGHTS[key], pPrev);
      const speed = Math.hypot(ox - px, oy - py);
      result[key] = {
        dx: ox / baseScale,
        dy: oy / baseScale,
        stretch: 1 + Math.min(speed / 90, 0.45),
        opacity: p > 0 ? 1 : 0,
      };
    });
    return result;
  };

  const morph = {
    P: progress(frame, T.carveStart, T.carveDuration),
    A: progress(frame, T.carveStart + 1, T.carveDuration),
    D: progress(frame, T.carveStart + 2, T.carveDuration),
  };
  const phuocReveal = progress(frame, T.phuocStart, T.phuocDuration);
  const depotReveal = progress(
    frame,
    T.phuocStart + T.depotDelay,
    T.depotDuration,
  );
  const inFlight = frame < T.flyStart + T.flyDuration + T.flyStagger * 2 + 2;

  /* ------------------------------ helpers -------------------------------- */
  const sx = (u: number) => x + u * scale;
  const sy = (v: number) => y + v * scale;

  const logoTransform = `translate(${x} ${y}) scale(${scale}) translate(${monoCx} ${monoCy}) scale(${pop}) translate(${-monoCx} ${-monoCy})`;

  /* ------------------------------- flash --------------------------------- */
  const flashP = progress(frame, T.hit - 2, 14);
  const flashY = sy(monoCy);
  const flashX = interpolate(flashP, [0, 1], [-700, width + 700]);
  const flashLine = flashP > 0 ? 1 - progress(frame, T.hit, 24) : 0;

  /* ------------------------------- guides -------------------------------- */
  const guidesIn = progress(frame, T.guidesIn, 20);
  const guidesOut = progress(frame, T.guidesOut, 10);
  const guidesOpacity = guidesIn * (1 - guidesOut);
  const v = LOCKUPS.vertical;
  const phuocBottom = v.phuoc.y + PHUOC_SIZE.height;
  const depotBottom = v.depot.y + DEPOT_SIZE.height;
  const hLines = [
    0,
    MONO_SIZE.height,
    v.phuoc.y,
    phuocBottom,
    v.depot.y,
    depotBottom,
  ];
  const vLines = [0, 103.1, MONO_SIZE.width];
  const ext = 70; // guide overshoot beyond the logo, logo units
  const rightX = MONO_SIZE.width + 46;

  return (
    <AbsoluteFill>
      <PageBackground
        grid
        gridOpacity={1 - progress(frame, T.layoutStart, 22)}
      />
      <RouteLines
        {...signalRoute(layout)}
        start={-100}
        showTip={false}
        opacity={1 - progress(frame, 0, 24)}
      />

      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Flight paths, faint and dashed, leading the primitives in */}
        {LETTERS.map((key, i) => {
          const box = LETTER_BOXES[key];
          const fx = sx(box.x + box.width / 2);
          const fy = sy(monoCy);
          const d = FLIGHTS[key]
            .map(([ox, oy], j) => `${j === 0 ? "M" : "L"}${fx + ox} ${fy + oy}`)
            .join("");
          const o = Math.min(
            progress(frame, i * T.flyStagger, 8),
            1 - progress(frame, 34 + i * 4, 16),
          );
          return (
            <path
              key={key}
              d={d}
              fill="none"
              stroke={NEUTRALS.line}
              strokeWidth={1.5}
              strokeDasharray="6 8"
              opacity={o * 0.8}
            />
          );
        })}

        {/* Orange flash sweeping behind the monogram on the hit */}
        <line
          x1={0}
          x2={width}
          y1={flashY}
          y2={flashY}
          stroke={COLORS.orange}
          strokeWidth={2}
          opacity={flashLine * 0.5}
        />
        {flashP > 0 && flashP < 1 ? (
          <g>
            <defs>
              <linearGradient id="pad-flash" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor={COLORS.orange} stopOpacity={0} />
                <stop
                  offset="0.85"
                  stopColor={COLORS.orange}
                  stopOpacity={0.9}
                />
                <stop offset="1" stopColor={COLORS.orange} stopOpacity={1} />
              </linearGradient>
            </defs>
            <rect
              x={flashX - 640}
              y={flashY - 3}
              width={640}
              height={6}
              rx={3}
              fill="url(#pad-flash)"
            />
          </g>
        ) : null}

        {/* Construction guides (behind the logo) */}
        {guidesOpacity > 0 ? (
          <g
            opacity={guidesOpacity}
            stroke={NEUTRALS.line}
            strokeWidth={1}
            strokeDasharray="5 6"
            fill="none"
          >
            {hLines.map((hv) => (
              <line
                key={`h${hv}`}
                x1={sx(-ext)}
                x2={sx(MONO_SIZE.width + ext)}
                y1={sy(hv)}
                y2={sy(hv)}
              />
            ))}
            {vLines.map((vu) => (
              <line
                key={`v${vu}`}
                x1={sx(vu)}
                x2={sx(vu)}
                y1={sy(-ext)}
                y2={sy(depotBottom + ext)}
              />
            ))}
          </g>
        ) : null}

        {/* Logo: a sub-frame smear while flying (motion-blur feel), then the mark */}
        {inFlight
          ? SMEAR_LAGS.map((lag) => (
              <g key={lag} transform={logoTransform}>
                <LogoGroup
                  morph={{ P: 0, A: 0, D: 0 }}
                  letters={lettersAt(frame - lag)}
                  phuocReveal={0}
                  depotReveal={0}
                  monogramOpacity={0.14}
                />
              </g>
            ))
          : null}
        <g transform={logoTransform}>
          <LogoGroup
            layout={layoutMorph}
            morph={morph}
            letters={inFlight ? lettersAt(frame) : undefined}
            phuocReveal={phuocReveal}
            depotReveal={depotReveal}
          />
          {/* Thin orange scan line riding the PHUOC AN wipe edge */}
          {phuocReveal > 0 && phuocReveal < 1 ? (
            <rect
              x={v.phuoc.x + PHUOC_SIZE.width * phuocReveal}
              y={v.phuoc.y - 14}
              width={3 / scale}
              height={PHUOC_SIZE.height + 28}
              fill={COLORS.orange}
            />
          ) : null}
        </g>

        {/* Dimension arrows and labels */}
        {guidesOpacity > 0 ? (
          <g opacity={guidesOpacity}>
            <Dimension
              x1={sx(-46)}
              y1={sy(0)}
              x2={sx(-46)}
              y2={sy(MONO_SIZE.height)}
              label="3x"
              side="left"
            />
            <Dimension
              x1={sx(0)}
              y1={sy(-46)}
              x2={sx(103.1)}
              y2={sy(-46)}
              label="x"
              side="top"
            />
            <Dimension
              x1={sx(rightX)}
              y1={sy(MONO_SIZE.height)}
              x2={sx(rightX)}
              y2={sy(v.phuoc.y)}
              label="0.55x"
              side="right"
            />
            <Dimension
              x1={sx(rightX)}
              y1={sy(phuocBottom)}
              x2={sx(rightX)}
              y2={sy(v.depot.y)}
              label="0.4x"
              side="right"
            />
          </g>
        ) : null}
      </svg>

      <SceneChrome index="02" title="LOGO" showLogo={false} />
    </AbsoluteFill>
  );
};

/** Dimension line with arrowheads and a Montserrat 14px label. */
const Dimension: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  side: "left" | "right" | "top";
}> = ({ x1, y1, x2, y2, label, side }) => {
  const vertical = x1 === x2;
  const a = 5; // arrowhead size
  const heads = vertical
    ? `M${x1 - a} ${y1 + a}L${x1} ${y1}L${x1 + a} ${y1 + a}M${x2 - a} ${y2 - a}L${x2} ${y2}L${x2 + a} ${y2 - a}`
    : `M${x1 + a} ${y1 - a}L${x1} ${y1}L${x1 + a} ${y1 + a}M${x2 - a} ${y2 - a}L${x2} ${y2}L${x2 - a} ${y2 + a}`;
  const ticks = vertical
    ? `M${x1 - 8} ${y1}H${x1 + 8}M${x2 - 8} ${y2}H${x2 + 8}`
    : `M${x1} ${y1 - 8}V${y1 + 8}M${x2} ${y2 - 8}V${y2 + 8}`;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const textProps =
    side === "left"
      ? { x: x1 - 14, y: midY + 5, textAnchor: "end" as const }
      : side === "right"
        ? { x: x1 + 14, y: midY + 5, textAnchor: "start" as const }
        : { x: midX, y: y1 - 14, textAnchor: "middle" as const };
  return (
    <g>
      <path
        d={`M${x1} ${y1}L${x2} ${y2}${heads}${ticks}`}
        fill="none"
        stroke={NEUTRALS.label}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        {...textProps}
        fontFamily={FONTS.body}
        fontWeight={FONT_WEIGHTS.body.medium}
        fontSize={14}
        fill={NEUTRALS.label}
        letterSpacing="0.05em"
      >
        {label}
      </text>
    </g>
  );
};
