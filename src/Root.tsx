import "./fonts";
import React from "react";
import { Composition } from "remotion";
import { DURATION_IN_FRAMES, FPS } from "./brand";
import { PADBrandDebut } from "./PADBrandDebut";

/**
 * Two compositions share the same scenes. Every scene reads the frame size
 * through useVideoConfig() and adapts its layout for vertical.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PADBrandDebut"
        component={PADBrandDebut}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="PADBrandDebutVertical"
        component={PADBrandDebut}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
