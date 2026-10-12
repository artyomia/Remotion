import { TransitionSeries, linearTiming } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  APPLICATIONS,
  COLORS,
  EASE,
  EASE_OUT,
  FONTS,
  FONT_WEIGHTS,
  SCENES,
} from "../brand";
import { BentoCollage } from "../components/BentoCollage";
import { Media } from "../components/Media";
import { ParaMask } from "../components/ParaMask";
import { PageBackground, SceneChrome } from "../components/SceneChrome";
import { MOCKUPS } from "../illustrations/Mockups";
import { paraFootprint } from "../lib/geometry";
import { useLayout } from "../lib/layout";
import { MONTAGE_WIPE, getMontageTiming } from "../lib/montage";
import { progress } from "../lib/motion";
import { skewedWipe } from "../transitions/skewedWipe";

/** Small caption bottom-left: index circle, label, orange dash. */
const ShotLabel: React.FC<{
  index: number;
  label: string;
  exitStart?: number;
}> = ({ index, label, exitStart }) => {
  const frame = useCurrentFrame();
  const { margin, pick } = useLayout();
  const s =
    progress(frame, 6, 12, EASE_OUT) *
    (exitStart === undefined ? 1 : 1 - progress(frame, exitStart, 10));
  const dash = progress(frame, 12, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: margin,
        top: pick(902, 1572),
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: s,
        transform: `translateY(${(1 - s) * 12}px)`,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: COLORS.orange,
          color: COLORS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONTS.body,
          fontWeight: FONT_WEIGHTS.body.semibold,
          fontSize: 13,
          letterSpacing: "0.04em",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          fontFamily: FONTS.sub,
          fontWeight: 600,
          fontSize: pick(24, 28),
          lineHeight: 1.3,
          color: COLORS.blue,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: 40,
          height: 4,
          background: COLORS.orange,
          transform: `scaleX(${dash})`,
          transformOrigin: "left",
        }}
      />
    </div>
  );
};

/** One application shot: a large parallelogram mask sliding in, Ken Burns inside. */
const Shot: React.FC<{ index: number; duration: number }> = ({
  index,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { pick } = useLayout();
  const app = APPLICATIONS[index];
  const Art = MOCKUPS[app.key];
  const mask = pick(
    { x: 120, y: 150, w: 1640, h: 720 },
    { x: -220, y: 230, w: 1420, h: 1290 },
  );
  const slide = progress(frame, 0, 16, EASE_OUT);
  const zoom = 1 + 0.08 * Math.min(1, frame / duration);
  return (
    <AbsoluteFill>
      <PageBackground />
      <ParaMask
        x={mask.x + (1 - slide) * 260}
        y={mask.y}
        w={mask.w}
        h={mask.h}
        radius={18}
      >
        <Media
          file={app.file}
          width={paraFootprint(mask.w, mask.h)}
          height={mask.h}
          zoom={zoom}
          fallback={(size) => <Art {...size} />}
        />
      </ParaMask>
      <ShotLabel index={index} label={app.label} />
    </AbsoluteFill>
  );
};

/** Frames before the end of the scene at which the label and chrome fade. */
const CHROME_EXIT = 12;

/** The collage at the end of the montage; its label clears before the outro. */
const CollageShot: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PageBackground />
      <BentoCollage t={frame} />
      <ShotLabel
        index={APPLICATIONS.length}
        label="Tổng quan hệ nhận diện"
        exitStart={duration - CHROME_EXIT}
      />
    </AbsoluteFill>
  );
};

/**
 * Scene 8, "Applications Montage" (frames 1005 to 1230).
 * Seven application shots cut on the beat with a skewed diagonal wipe
 * (@remotion/transitions custom presentation), ending on a bento collage.
 */
export const Scene8Applications: React.FC = () => {
  const { width, height } = useLayout();
  const { shotDurations, collageDuration } = getMontageTiming();
  const presentation = skewedWipe({ width, height });
  const timing = linearTiming({ durationInFrames: MONTAGE_WIPE, easing: EASE });

  const children: React.ReactNode[] = [];
  APPLICATIONS.forEach((app, i) => {
    if (i > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${app.key}`}
          presentation={presentation}
          timing={timing}
        />,
      );
    }
    children.push(
      <TransitionSeries.Sequence
        key={app.key}
        durationInFrames={shotDurations[i]}
      >
        <Shot index={i} duration={shotDurations[i]} />
      </TransitionSeries.Sequence>,
    );
  });
  children.push(
    <TransitionSeries.Transition
      key="t-collage"
      presentation={presentation}
      timing={timing}
    />,
  );
  children.push(
    <TransitionSeries.Sequence key="collage" durationInFrames={collageDuration}>
      <CollageShot duration={collageDuration} />
    </TransitionSeries.Sequence>,
  );

  return (
    <AbsoluteFill>
      <TransitionSeries>{children}</TransitionSeries>
      <SceneChrome
        index="08"
        title="APPLICATIONS"
        exitStart={SCENES.applications.duration - CHROME_EXIT}
      />
    </AbsoluteFill>
  );
};
