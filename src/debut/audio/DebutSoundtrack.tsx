import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, staticFile } from "remotion";
import { hasPublicFile } from "../../lib/assets";
import { CUE, DEBUT_MUSIC } from "../config";

/**
 * Sound-effect cues for the debut. `at` is the frame the sound starts;
 * sounds with a build-up (reverse suck) start early so they end on the hit.
 * Files live in public/debut/sfx/ (placeholders synthesized in code until
 * a licensed SFX pack replaces them, same file names).
 */
export const SFX_CUES: Array<{
  file: string;
  at: number;
  volume: number;
  frames: number;
}> = [
  // Scene 4a: the lift
  { file: "hydraulic", at: 212, volume: 0.5, frames: 75 },
  { file: "metal-strain", at: 226, volume: 0.35, frames: 50 },
  { file: "text-slam", at: 237, volume: 0.6, frames: 12 },
  { file: "text-slam", at: 264, volume: 0.6, frames: 12 },
  // Scene 4b: drops on the snare build
  { file: "whoosh-cut", at: 274, volume: 0.35, frames: 20 },
  { file: "container-drop", at: CUE.buildHits[0], volume: 0.65, frames: 60 },
  { file: "whoosh-cut", at: 284, volume: 0.3, frames: 20 },
  { file: "container-drop", at: CUE.buildHits[1], volume: 0.6, frames: 60 },
  { file: "whoosh-deep", at: CUE.buildHits[2] - 3, volume: 0.45, frames: 30 },
  { file: "hydraulic-release", at: CUE.buildHits[3], volume: 0.45, frames: 20 },
  { file: "reverse-suck", at: CUE.drop1 - 16, volume: 0.5, frames: 17 },
  // Scene 5: the slam
  { file: "impact-big", at: CUE.drop1, volume: 0.62, frames: 160 },
  // Scene 6: wordmark
  { file: "swoosh", at: 350, volume: 0.45, frames: 15 },
  { file: "punch", at: 358, volume: 0.5, frames: 12 },
  { file: "shimmer", at: 366, volume: 0.35, frames: 80 },
];

export const DebutSoundtrack: React.FC = () => {
  const music = DEBUT_MUSIC;
  return (
    <>
      {hasPublicFile(music) ? (
        <Audio src={staticFile(music)} volume={0.85} />
      ) : null}
      {SFX_CUES.map(({ file, at, volume, frames }, i) => {
        const path = `debut/sfx/${file}.mp3`;
        if (!hasPublicFile(path)) return null;
        return (
          <Sequence
            key={`${file}-${at}-${i}`}
            from={at}
            durationInFrames={frames}
            name={`SFX ${file}`}
          >
            <Audio src={staticFile(path)} volume={volume} />
          </Sequence>
        );
      })}
    </>
  );
};
