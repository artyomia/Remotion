import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, interpolate, staticFile } from "remotion";
import { hasPublicFile } from "../lib/assets";
import {
  CUE,
  SFX,
  SFX_CUES,
  SfxName,
  SOCIAL_DURATION,
  SOCIAL_MUSIC,
} from "./timeline";

/** Music level, kept under the sound effects' peaks. */
const MUSIC_VOLUME = 0.85;

/**
 * Music plus every sound effect cue from timeline.ts. A missing file is
 * skipped, so licensed replacements can be dropped in one at a time.
 */
export const SocialSoundtrack: React.FC<{
  cues?: Array<{ at: number; sfx: SfxName; volume: number; rate?: number }>;
}> = ({ cues = SFX_CUES }) => {
  return (
    <>
      {hasPublicFile(SOCIAL_MUSIC) ? (
        <Audio src={staticFile(SOCIAL_MUSIC)} volume={MUSIC_VOLUME} />
      ) : null}
      {cues.map(({ at, sfx, volume, rate }, i) => {
        const file = SFX[sfx];
        if (!hasPublicFile(file)) {
          return null;
        }
        const isAmbience = sfx === "ambience";
        return (
          <Sequence
            key={`${sfx}-${at}-${i}`}
            from={at}
            durationInFrames={isAmbience ? SOCIAL_DURATION - at : 150}
            name={`SFX ${sfx}`}
          >
            <Audio
              src={staticFile(file)}
              playbackRate={rate ?? 1}
              volume={
                isAmbience
                  ? (f) =>
                      volume *
                      interpolate(
                        f,
                        [
                          0,
                          20,
                          CUE.musicEnd - 120,
                          CUE.musicEnd,
                          SOCIAL_DURATION - 20,
                          SOCIAL_DURATION,
                        ],
                        [0, 1, 0.6, 1, 1, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                      )
                  : volume
              }
            />
          </Sequence>
        );
      })}
    </>
  );
};
