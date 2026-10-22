import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "../brand";
import { DebutSoundtrack } from "./audio/DebutSoundtrack";
import { HERO_FROM, HERO_TO, HeroBuild } from "./scenes/HeroBuild";
import { LOGO_FROM, LogoReveal } from "./scenes/LogoReveal";

/**
 * PAD logo debut for social (30 s, 9:16 main, 4:5 feed).
 * Style prototype: scenes 4 to 6 (7.0 s to 13.0 s) are built; the other
 * scenes follow once the 3D look is approved.
 */
export const PADLogoDebut: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.navy }}>
      <Sequence
        from={HERO_FROM}
        durationInFrames={HERO_TO - HERO_FROM}
        name="3D hero: lift, drops, slam"
      >
        <HeroBuild />
      </Sequence>
      <Sequence
        from={LOGO_FROM}
        durationInFrames={390 - LOGO_FROM}
        name="Logo reveal"
      >
        <LogoReveal />
      </Sequence>
      <DebutSoundtrack />
    </AbsoluteFill>
  );
};
