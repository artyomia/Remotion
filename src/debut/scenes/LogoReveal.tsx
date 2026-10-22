/**
 * Scene 6, the flat logo (from 11.3 s). Takes over from the 3D monogram at
 * the exact same pixels, recentres the lockup while PHUOC AN wipes in and
 * DEPOT punches up, then a light sweep runs across the mark.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, EASE_OUT } from "../../brand";
import { RouteLines } from "../../components/RouteLines";
import { hitSpring, progress } from "../../lib/motion";
import { LogoGroup } from "../../logo/Logo";
import { LOCKUPS, MONO_SIZE, PHUOC_SIZE } from "../../logo/paths";
import { CUE } from "../config";

export const LOGO_FROM = 340;

/** Pixels per logo unit at the handoff (monogram 860 px wide). */
const HANDOFF_SCALE = 860 / MONO_SIZE.width;

export const LogoReveal: React.FC = () => {
  const local = useCurrentFrame();
  const f = local + LOGO_FROM;
  const { width, height, fps } = useVideoConfig();

  const ivory = progress(f, CUE.drop1 + 18, 8);
  const logoIn = progress(f, CUE.drop1 + 18, 6);

  // Monogram first sits exactly where the 3D monogram ended (centred), then
  // the whole vertical lockup recentres as the wordmark arrives.
  const s = HANDOFF_SCALE;
  const startY = height / 2 - (MONO_SIZE.height / 2) * s;
  const endY = height / 2 - (LOCKUPS.vertical.height / 2) * s;
  const move = progress(f, 350, 22);
  const y = startY + (endY - startY) * move;
  const x = width / 2 - (MONO_SIZE.width / 2) * s;

  const phuoc = progress(f, 352, 14);
  const depot = progress(f, 358, 12, EASE_OUT);
  // Small pop on the downbeat at 352.
  const beat =
    f < 352 ? 1 : interpolate(hitSpring(f, fps, 352), [0, 1], [1.03, 1]);
  const sweep = progress(f, 366, 18);

  const cx = width / 2;
  const cy = y + (LOCKUPS.vertical.height / 2) * s;
  const transform = `translate(${cx} ${cy}) scale(${beat}) translate(${-cx} ${-cy}) translate(${x} ${y}) scale(${s})`;
  const scanX = LOCKUPS.vertical.phuoc.x + PHUOC_SIZE.width * phuoc;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 48%, #FFFFFF 0%, ${COLORS.ivory} 55%, #EEF1F5 100%)`,
          opacity: ivory,
        }}
      />
      {f >= 360 ? (
        <RouteLines
          y={height / 2 + 430}
          kinkX={380}
          rise={110}
          start={360 - LOGO_FROM}
          duration={20}
          stagger={4}
        />
      ) : null}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, opacity: logoIn }}
      >
        <defs>
          <mask id="debut-logo-mask" maskUnits="userSpaceOnUse">
            <g transform={transform}>
              <LogoGroup
                variant="white"
                phuocReveal={phuoc}
                depotReveal={depot}
              />
            </g>
          </mask>
          <linearGradient id="debut-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0.75} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <g transform={transform}>
          <LogoGroup phuocReveal={phuoc} depotReveal={depot} />
          {phuoc > 0 && phuoc < 1 ? (
            <rect
              x={scanX}
              y={LOCKUPS.vertical.phuoc.y - 14}
              width={4 / s}
              height={PHUOC_SIZE.height + 28}
              fill={COLORS.orange}
            />
          ) : null}
        </g>
        {sweep > 0 && sweep < 1 ? (
          <g mask="url(#debut-logo-mask)">
            <rect
              x={-300 + sweep * (width + 600) - 150}
              y={0}
              width={300}
              height={height}
              fill="url(#debut-sweep)"
              transform={`skewX(-20)`}
            />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
