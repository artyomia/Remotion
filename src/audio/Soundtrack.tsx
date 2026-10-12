import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, interpolate, staticFile } from "remotion";
import { AUDIO, CUES, DURATION_IN_FRAMES, SCENES } from "../brand";
import { ICON_TILES, iconTileStart } from "../scenes/Scene7IconSystem";
import { hasPublicFile } from "../lib/assets";
import { getMontageTiming } from "../lib/montage";

/** Whooshes start slightly early so their swell peaks on the cut. */
const WHOOSH_LEAD = 6;

/** Mix levels, balanced so the hits never clip on top of the music. */
const MIX = {
  music: 0.75,
  whooshFlyIn: 0.5,
  whooshScene: 0.38,
  whooshMontage: 0.22,
  hit: 0.55,
  click: 0.3,
};

/** Music bed with fades plus all sound effects, cued from brand.ts timings. */
export const Soundtrack: React.FC = () => {
  const has = (file: string) => hasPublicFile(file);
  const { wipeStarts } = getMontageTiming();

  const sceneCuts = [
    SCENES.idea.from,
    SCENES.palette.from,
    SCENES.typography.from,
    SCENES.graphics.from,
    SCENES.icons.from,
    SCENES.applications.from,
    SCENES.outro.from,
  ];

  const whooshes = [
    { at: CUES.primitivesFlyIn, volume: MIX.whooshFlyIn },
    ...sceneCuts.map((at) => ({
      at: at - WHOOSH_LEAD,
      volume: MIX.whooshScene,
    })),
    ...wipeStarts.map((at) => ({ at: at - 2, volume: MIX.whooshMontage })),
  ];

  const clicks = ICON_TILES.map((_, i) => SCENES.icons.from + iconTileStart(i));

  return (
    <>
      {has(AUDIO.music) ? (
        <Audio
          src={staticFile(AUDIO.music)}
          volume={(f) =>
            interpolate(
              f,
              [0, 30, DURATION_IN_FRAMES - 50, DURATION_IN_FRAMES],
              [0, MIX.music, MIX.music, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )
          }
        />
      ) : null}
      {has(AUDIO.whoosh)
        ? whooshes.map(({ at, volume }) => (
            <Sequence
              key={`whoosh-${at}`}
              from={at}
              durationInFrames={30}
              name="SFX whoosh"
            >
              <Audio src={staticFile(AUDIO.whoosh)} volume={volume} />
            </Sequence>
          ))
        : null}
      {has(AUDIO.hit)
        ? [CUES.logoHit, CUES.outroLogoHit].map((at) => (
            <Sequence
              key={`hit-${at}`}
              from={at}
              durationInFrames={70}
              name="SFX hit"
            >
              <Audio src={staticFile(AUDIO.hit)} volume={MIX.hit} />
            </Sequence>
          ))
        : null}
      {has(AUDIO.click)
        ? clicks.map((at) => (
            <Sequence
              key={`click-${at}`}
              from={at}
              durationInFrames={10}
              name="SFX click"
            >
              <Audio src={staticFile(AUDIO.click)} volume={MIX.click} />
            </Sequence>
          ))
        : null}
    </>
  );
};
