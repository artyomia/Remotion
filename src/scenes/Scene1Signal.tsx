import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BRAND,
  COLORS,
  EASE_OUT,
  FONTS,
  FONT_WEIGHTS,
  TRACKING,
} from "../brand";
import { RouteLines } from "../components/RouteLines";
import { PageBackground, SceneChrome } from "../components/SceneChrome";
import { LetterFade } from "../components/TextEffects";
import { Layout, useLayout } from "../lib/layout";
import { progress } from "../lib/motion";

/** Geometry of the opening route lines, shared with Scene 2 for continuity. */
export const signalRoute = (layout: Layout) =>
  layout.pick(
    { y: 830, kinkX: 1040, rise: 200 },
    { y: 1500, kinkX: 360, rise: 240 },
  );

/**
 * Scene 1, "Signal" (frames 0 to 90).
 * The orange route line draws across a faint grid, the stacked tagline fades
 * in letter by letter, and "MỘT DIỆN MẠO MỚI" rises and fades.
 */
export const Scene1Signal: React.FC = () => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const { margin, headerTop, pick } = layout;

  const textIn = progress(frame, 34, 18, EASE_OUT);
  const textOut = progress(frame, 74, 12);

  // Each tagline line continues the per-character stagger of the previous one.
  let charOffset = 0;
  const taglineLines = BRAND.tagline.map((line) => {
    const start = 30 + charOffset;
    charOffset += line.length;
    return { line, start };
  });

  return (
    <AbsoluteFill>
      <PageBackground grid />
      <RouteLines
        {...signalRoute(layout)}
        start={0}
        duration={45}
        stagger={6}
      />
      <div
        style={{
          position: "absolute",
          left: margin,
          top: headerTop,
          fontFamily: FONTS.body,
          fontWeight: FONT_WEIGHTS.body.medium,
          fontSize: 14,
          lineHeight: "24px",
          letterSpacing: TRACKING.micro,
          color: COLORS.blue,
        }}
      >
        {taglineLines.map(({ line, start }) => (
          <div key={line}>
            <LetterFade text={line} start={start} stagger={1} fade={6} />
          </div>
        ))}
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: FONTS.body,
            fontWeight: FONT_WEIGHTS.body.medium,
            fontSize: pick(44, 40),
            letterSpacing: TRACKING.wide,
            // Tracking adds space after the last letter; pad the left to keep
            // the line optically centred.
            paddingLeft: TRACKING.wide,
            color: COLORS.blue,
            whiteSpace: "nowrap",
            opacity: textIn * (1 - textOut),
            transform: `translateY(${(1 - textIn) * 20}px)`,
          }}
        >
          MỘT DIỆN MẠO MỚI
        </div>
      </AbsoluteFill>
      <SceneChrome
        index="01"
        title="BRAND IDENTITY"
        showLogo={false}
        enter="draw"
      />
    </AbsoluteFill>
  );
};
