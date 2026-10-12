import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BRAND,
  COLORS,
  CUES,
  EASE_OUT,
  FONTS,
  FONT_WEIGHTS,
  SCENES,
  TRACKING,
} from "../brand";
import { BentoCollage } from "../components/BentoCollage";
import { RouteLines } from "../components/RouteLines";
import { LogoGroup, lockupSize } from "../logo/Logo";
import { MONO_SIZE } from "../logo/paths";
import { ROUTE_RUN } from "../lib/geometry";
import { useLayout } from "../lib/layout";
import { getMontageTiming } from "../lib/montage";
import { hitSpring, progress } from "../lib/motion";

const DURATION = 120;
/** Outro logo hit, local frame (absolute 1260). */
const HIT = CUES.outroLogoHit - SCENES.outro.from;

/**
 * Scene 9, "Outro" (frames 1230 to 1350).
 * The collage blurs into Deep Navy, the orange route line leads to centre,
 * the reversed logo lands with a short spring hit, then the tagline and
 * website appear before a gentle fade to navy.
 */
export const Scene9Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layout = useLayout();
  const { width, height, pick } = layout;
  const { collageDuration } = getMontageTiming();

  /* Collage hand-off from Scene 8 */
  const blur = progress(frame, 0, 24) * 28;
  const darken = progress(frame, 0, 26);

  /* Logo placement (vertical lockup, reversed) */
  const size = lockupSize(0);
  const scale = pick(600, 640) / size.width;
  const logoW = size.width * scale;
  const logoH = size.height * scale;
  const logoX = (width - logoW) / 2;
  const logoY = pick(height / 2 - 60, height / 2 - 120) - logoH / 2;
  const monoMidY = logoY + (MONO_SIZE.height / 2) * scale;

  /* The 20-frame logo hit: primitives appear, carve, pop, wordmark follows. */
  const appear = progress(frame, HIT - 10, 6, EASE_OUT);
  const carve = progress(frame, HIT - 6, 6);
  const hit = hitSpring(frame, fps, HIT - 1);
  const pop =
    frame < HIT - 1
      ? 0.94 + 0.06 * appear
      : interpolate(hit, [0, 1], [1.06, 1]);
  const phuoc = progress(frame, HIT + 2, 10);
  const depot = progress(frame, HIT + 6, 10);

  /* Route line ends just left of the monogram */
  const routeEnd = logoX - pick(40, 30);
  const rise = pick(150, 170);
  const flat = pick(140, 70);
  const kinkX = routeEnd - flat - rise * ROUTE_RUN;

  const tagline = progress(frame, HIT + 22, 16, EASE_OUT);
  const site = progress(frame, HIT + 40, 14);
  const fadeOut = progress(frame, DURATION - 20, 20);

  const monoCx = MONO_SIZE.width / 2;
  const monoCy = MONO_SIZE.height / 2;

  return (
    <AbsoluteFill style={{ background: COLORS.navy }}>
      {darken < 1 ? (
        <AbsoluteFill
          style={{ background: COLORS.ivory, filter: `blur(${blur}px)` }}
        >
          <BentoCollage t={collageDuration + frame} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ background: COLORS.navy, opacity: darken }} />

      <AbsoluteFill style={{ opacity: 1 - fadeOut }}>
        <RouteLines
          y={monoMidY + rise}
          kinkX={kinkX}
          rise={rise}
          x1={routeEnd}
          start={10}
          duration={HIT - 12}
          stagger={4}
          parallels={[
            { gap: -16, color: "rgba(255,255,255,0.28)", width: 1.5 },
            {
              gap: 16,
              dashed: true,
              color: "rgba(255,255,255,0.28)",
              width: 1.5,
            },
          ]}
        />
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0 }}
        >
          <g
            transform={`translate(${logoX} ${logoY}) scale(${scale}) translate(${monoCx} ${monoCy}) scale(${pop}) translate(${-monoCx} ${-monoCy})`}
          >
            <LogoGroup
              variant="reversed"
              morph={{ P: carve, A: carve, D: carve }}
              monogramOpacity={appear}
              phuocReveal={phuoc}
              depotReveal={depot}
            />
          </g>
        </svg>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: logoY + logoH + pick(64, 80),
            textAlign: "center",
            fontFamily: FONTS.body,
            fontWeight: FONT_WEIGHTS.body.medium,
            fontSize: pick(18, 20),
            letterSpacing: TRACKING.wide,
            paddingLeft: TRACKING.wide,
            color: "rgba(255,255,255,0.8)",
            whiteSpace: "nowrap",
            opacity: tagline,
            transform: `translateY(${(1 - tagline) * 14}px)`,
          }}
        >
          {BRAND.tagline.join(" · ")}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: logoY + logoH + pick(116, 136),
            textAlign: "center",
            fontFamily: FONTS.body,
            fontWeight: FONT_WEIGHTS.body.medium,
            fontSize: pick(16, 18),
            letterSpacing: "0.12em",
            color: COLORS.orange,
            opacity: site,
          }}
        >
          {BRAND.website}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
