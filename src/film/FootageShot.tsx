import { Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { hasPublicFile } from "../lib/assets";
import { punch } from "../social/fx";
import { DUSK } from "../social/timeline";
import { CLIP_FILES, ShotSpec } from "./timeline";

/**
 * One live-action shot: the clip trimmed to its start point, played at its
 * rate, with a slow push and a small punch on the cut. A light grade keeps
 * the AI clips consistent with each other.
 */
export const FootageShot: React.FC<{
  spec: ShotSpec;
  /** Shown if the clip is not in public/ yet. */
  fallback?: React.ReactNode;
}> = ({ spec, fallback }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const file = CLIP_FILES[spec.clip];
  const duration = spec.to - spec.from;
  const [z0, z1] = spec.zoom ?? [1, 1.06];
  const [fx, fy] = spec.focus ?? [0.5, 0.5];
  const zoom =
    interpolate(frame, [0, duration], [z0, z1], { extrapolateRight: "clamp" }) *
    punch(frame, 0, 0.05, 8);

  if (!hasPublicFile(file)) {
    return (
      <AbsoluteFill style={{ background: DUSK.skyTop }}>
        {fallback}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: `${fx * 100}% ${fy * 100}%`,
        }}
      >
        <Video
          src={staticFile(file)}
          trimBefore={Math.round(spec.start * fps)}
          playbackRate={spec.rate ?? 1}
          muted
          objectFit="cover"
          style={{
            width: "100%",
            height: "100%",
            filter: "contrast(1.05) saturate(1.06)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
