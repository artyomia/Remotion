import { interpolate, spring } from "remotion";
import { EASE, SPRINGS } from "../brand";

type EasingFn = (t: number) => number;

/** interpolate() with the brand ease and clamping on both sides. */
export const tween = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: EasingFn = EASE,
) =>
  interpolate(frame, input, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** 0 to 1 progress over [start, start + duration]. */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: EasingFn = EASE,
) => tween(frame, [start, start + duration], [0, 1], easing);

/** Critically damped spring for UI elements. */
export const uiSpring = (
  frame: number,
  fps: number,
  delay = 0,
  durationInFrames?: number,
) =>
  spring({
    frame: frame - delay,
    fps,
    config: SPRINGS.ui,
    durationInFrames,
  });

/** Crisp spring with one overshoot, for logo hits. */
export const hitSpring = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: SPRINGS.hit });

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Fade in over [inStart, inStart + inDur] and out over [outStart, outStart + outDur]. */
export const fadeInOut = (
  frame: number,
  inStart: number,
  inDur: number,
  outStart: number,
  outDur: number,
) =>
  Math.min(
    progress(frame, inStart, inDur),
    1 - progress(frame, outStart, outDur),
  );
