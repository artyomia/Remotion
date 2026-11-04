import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { S01Doors } from "./scenes/S01Doors";
import { S02Corridor } from "./scenes/S02Corridor";
import { S03Truck } from "./scenes/S03Truck";
import { S04Worker } from "./scenes/S04Worker";
import { S05Stacker } from "./scenes/S05Stacker";
import { S06LogoBuild } from "./scenes/S06LogoBuild";
import { S07Montage } from "./scenes/S07Montage";
import { S08Together } from "./scenes/S08Together";
import { S09Forward } from "./scenes/S09Forward";
import { S10EndCard } from "./scenes/S10EndCard";
import { SocialSoundtrack } from "./SocialSoundtrack";
import { DUSK, SCENE, SocialSceneName } from "./timeline";

const SCENES: Record<SocialSceneName, React.FC> = {
  doors: S01Doors,
  corridor: S02Corridor,
  truck: S03Truck,
  worker: S04Worker,
  stacker: S05Stacker,
  logo: S06LogoBuild,
  montage: S07Montage,
  together: S08Together,
  forward: S09Forward,
  endCard: S10EndCard,
};

/**
 * PAD social logo debut, 30 s. One component for 9:16 and 4:5; scenes read
 * the frame size from useStage().
 */
export const PADSocialDebut: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: DUSK.skyTop }}>
      {(Object.keys(SCENE) as SocialSceneName[]).map((name) => {
        const Scene = SCENES[name];
        const { from, to } = SCENE[name];
        return (
          <Sequence
            key={name}
            name={name}
            from={from}
            durationInFrames={to - from}
            premountFor={20}
          >
            <Scene />
          </Sequence>
        );
      })}
      <SocialSoundtrack />
    </AbsoluteFill>
  );
};
