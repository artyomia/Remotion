import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, EASE_OUT, FONTS, FONT_WEIGHTS, NEUTRALS } from "../brand";
import { Headline } from "../components/Headline";
import { PageBackground, SceneChrome } from "../components/SceneChrome";
import { ScrambleHex } from "../components/TextEffects";
import { Para, SKEW_T, paraPath } from "../lib/geometry";
import { useLayout } from "../lib/layout";
import { lerp, progress } from "../lib/motion";

type Swatch = {
  name: string;
  hex: string;
  row: 0 | 1;
  ink: string;
  outline?: boolean;
};

const SWATCHES: Swatch[] = [
  { name: "Xanh PAD", hex: COLORS.blue, row: 0, ink: COLORS.white },
  { name: "Cam PAD", hex: COLORS.orange, row: 0, ink: COLORS.white },
  {
    name: "Trắng ngà",
    hex: COLORS.ivory,
    row: 1,
    ink: COLORS.navy,
    outline: true,
  },
  { name: "Xám nhạt", hex: COLORS.greyBlue, row: 1, ink: COLORS.navy },
  { name: "Xanh đậm phụ", hex: COLORS.navy, row: 1, ink: COLORS.white },
];

/** Frame each swatch starts growing. */
const SWATCH_START = [20, 26, 36, 41, 46];

/** Frames of the closing wipe where the blue swatch fills the screen. */
const EXPAND = { start: 116, duration: 22 };

/**
 * Scene 4, "Color Palette" (frames 450 to 600).
 * Five parallelogram swatches grow along the skew axis in a sheared two-row
 * grid while their hex codes scramble into place. The blue swatch then
 * expands to fill the frame as the transition into Scene 5.
 */
export const Scene4ColorPalette: React.FC = () => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const { width, height, margin, contentWidth, pick } = layout;

  const grid = pick(
    { top: 568, rows: [220, 160], gap: 22 },
    { top: 720, rows: [440, 320], gap: 24 },
  );
  const gridHeight = grid.rows[0] + grid.rows[1] + grid.gap;
  const bottom = grid.top + gridHeight;
  const edgeTotal = contentWidth - gridHeight * SKEW_T;

  // Lay out both rows on one shared sheared left edge.
  const rects: Para[] = [];
  ([0, 1] as const).forEach((row) => {
    const items = SWATCHES.filter((s) => s.row === row);
    const top = row === 0 ? grid.top : grid.top + grid.rows[0] + grid.gap;
    const h = grid.rows[row];
    const leftX = margin + (bottom - (top + h)) * SKEW_T;
    const w = (edgeTotal - (items.length - 1) * grid.gap) / items.length;
    items.forEach((_, j) =>
      rects.push({ x: leftX + j * (w + grid.gap), y: top, w, h }),
    );
  });

  const fadeOthers = 1 - progress(frame, EXPAND.start - 6, 10);
  const expand = progress(frame, EXPAND.start, EXPAND.duration);

  // Target rectangle for the blue swatch: comfortably beyond every edge.
  const cover: Para = {
    x: -(height + 200) * SKEW_T - 100,
    y: -100,
    w: width + (height + 200) * SKEW_T + 200,
    h: height + 200,
  };

  const animated = rects.map((r, i) => {
    const grow = progress(frame, SWATCH_START[i], 20, EASE_OUT);
    const base = { ...r, w: r.w * grow };
    if (i !== 0) {
      return base;
    }
    return {
      x: lerp(base.x, cover.x, expand),
      y: lerp(base.y, cover.y, expand),
      w: lerp(base.w, cover.w, expand),
      h: lerp(base.h, cover.h, expand),
    };
  });

  const order = [1, 2, 3, 4, 0]; // blue on top so it can sweep over the rest

  return (
    <AbsoluteFill>
      <PageBackground />
      <Headline
        lines={[
          { text: "BẢNG MÀU", color: COLORS.blue },
          { text: "THƯƠNG HIỆU", color: COLORS.orange },
        ]}
        x={margin}
        y={pick(200, 250)}
        fontSize={pick(120, 104)}
        start={2}
        exitStart={EXPAND.start - 10}
      />
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        {order.map((i) => {
          const r = animated[i];
          if (r.w < 1) {
            return null;
          }
          const s = SWATCHES[i];
          return (
            <path
              key={s.hex}
              d={paraPath(r, i === 0 ? lerp(12, 0, expand) : 12)}
              fill={s.hex}
              stroke={s.outline ? NEUTRALS.grid : "none"}
              strokeWidth={s.outline ? 1.5 : 0}
              opacity={i === 0 ? 1 : fadeOthers}
            />
          );
        })}
      </svg>
      {SWATCHES.map((s, i) => {
        const r = rects[i];
        const textIn = progress(frame, SWATCH_START[i] + 10, 12);
        const textOut =
          i === 0 ? progress(frame, EXPAND.start - 8, 6) : 1 - fadeOthers;
        const pad = pick(26, 22);
        return (
          <div
            key={s.hex}
            style={{
              position: "absolute",
              left: r.x + pad,
              top: r.y + r.h - pad - 52,
              color: s.ink,
              opacity: textIn * (1 - textOut),
              transform: `translateY(${(1 - textIn) * 8}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.body,
                fontWeight: FONT_WEIGHTS.body.semibold,
                fontSize: pick(20, 21),
                lineHeight: "26px",
                whiteSpace: "nowrap",
              }}
            >
              {s.name}
            </div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontWeight: FONT_WEIGHTS.body.medium,
                fontSize: 16,
                lineHeight: "24px",
                letterSpacing: "0.12em",
                opacity: 0.85,
              }}
            >
              <ScrambleHex
                value={s.hex}
                start={SWATCH_START[i] + 8}
                duration={15}
                seed={s.hex}
              />
            </div>
          </div>
        );
      })}
      <SceneChrome index="04" title="COLOR PALETTE" exitStart={EXPAND.start} />
    </AbsoluteFill>
  );
};
