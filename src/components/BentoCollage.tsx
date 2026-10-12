import React from "react";
import { useVideoConfig } from "remotion";
import { APPLICATIONS, ApplicationKey, MOCKUP_SHADOW } from "../brand";
import { MOCKUPS } from "../illustrations/Mockups";
import { SKEW_T, paraFootprint } from "../lib/geometry";
import { useLayout } from "../lib/layout";
import { progress, uiSpring } from "../lib/motion";
import { Media } from "./Media";
import { ParaMask } from "./ParaMask";

type Tile = { key: ApplicationKey; row: number; col: number; span: number };

const LANDSCAPE_TILES: Tile[] = [
  { key: "truck", row: 0, col: 0, span: 2 },
  { key: "stationery", row: 0, col: 2, span: 1 },
  { key: "uniform", row: 0, col: 3, span: 1 },
  { key: "signage", row: 1, col: 0, span: 1 },
  { key: "equipment", row: 1, col: 1, span: 1 },
  { key: "social", row: 1, col: 2, span: 1 },
  { key: "digital", row: 1, col: 3, span: 1 },
];

const VERTICAL_TILES: Tile[] = [
  { key: "truck", row: 0, col: 0, span: 2 },
  { key: "stationery", row: 1, col: 0, span: 1 },
  { key: "uniform", row: 1, col: 1, span: 1 },
  { key: "signage", row: 2, col: 0, span: 1 },
  { key: "equipment", row: 2, col: 1, span: 1 },
  { key: "social", row: 3, col: 0, span: 1 },
  { key: "digital", row: 3, col: 1, span: 1 },
];

/**
 * "Tổng quan hệ nhận diện": all application images snap into a bento grid of
 * parallelogram tiles, then the grid eases out slightly.
 * Driven by `t` (frames since the collage started) so Scene 9 can continue
 * the same motion seamlessly.
 */
export const BentoCollage: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const layout = useLayout();
  const { width, height, margin, contentWidth, isVertical, pick } = layout;

  const tiles = isVertical ? VERTICAL_TILES : LANDSCAPE_TILES;
  const rows = isVertical ? 4 : 2;
  const cols = isVertical ? 2 : 4;
  const gap = 16;
  const top = pick(150, 230);
  const bottom = pick(880, 1500);
  const rowH = (bottom - top - gap * (rows - 1)) / rows;
  // Landscape shares one sheared left edge; vertical aligns each row to the
  // margin so the narrow frame keeps usable tile widths.
  const shear = isVertical ? rowH * SKEW_T : (bottom - top) * SKEW_T;
  const edgeTotal = contentWidth - shear;
  const colW = (edgeTotal - gap * (cols - 1)) / cols;

  const zoomOut = 1 - 0.06 * progress(t, 14, 70);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${zoomOut})`,
        transformOrigin: `${width / 2}px ${(top + bottom) / 2}px`,
      }}
    >
      {tiles.map((tile, i) => {
        const y = top + tile.row * (rowH + gap);
        const rowLeft = isVertical
          ? margin
          : margin + (bottom - (y + rowH)) * SKEW_T;
        const x = rowLeft + tile.col * (colW + gap);
        const w = colW * tile.span + gap * (tile.span - 1);
        const s = uiSpring(t, fps, i * 2, 14);
        const app = APPLICATIONS.find((a) => a.key === tile.key)!;
        const Art = MOCKUPS[tile.key];
        const footprint = paraFootprint(w, rowH);
        const cx = x + footprint / 2;
        const cy = y + rowH / 2;
        const fromScale = 1.35;
        const pull = 1 - s;
        return (
          <div
            key={tile.key}
            style={{
              position: "absolute",
              inset: 0,
              opacity: Math.min(1, s * 1.5),
              transform: `translate(${(cx - width / 2) * 0.25 * pull}px, ${(cy - height / 2) * 0.25 * pull}px) scale(${1 + (fromScale - 1) * pull})`,
              transformOrigin: `${cx}px ${cy}px`,
              filter: `drop-shadow(${MOCKUP_SHADOW})`,
            }}
          >
            <ParaMask x={x} y={y} w={w} h={rowH} radius={12}>
              <Media
                file={app.file}
                width={footprint}
                height={rowH}
                zoom={1.04 + 0.04 * progress(t, 0, 90)}
                fallback={(size) => <Art {...size} />}
              />
            </ParaMask>
          </div>
        );
      })}
    </div>
  );
};
