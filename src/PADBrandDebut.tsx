import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Soundtrack } from "./audio/Soundtrack";
import { COLORS, SCENES, SceneName } from "./brand";
import { Scene1Signal } from "./scenes/Scene1Signal";
import { Scene2LogoConstruction } from "./scenes/Scene2LogoConstruction";
import { Scene3BrandIdea } from "./scenes/Scene3BrandIdea";
import { Scene4ColorPalette } from "./scenes/Scene4ColorPalette";
import { Scene5Typography } from "./scenes/Scene5Typography";
import { Scene6GraphicSystem } from "./scenes/Scene6GraphicSystem";
import { Scene7IconSystem } from "./scenes/Scene7IconSystem";
import { Scene8Applications } from "./scenes/Scene8Applications";
import { Scene9Outro } from "./scenes/Scene9Outro";

const SCENE_COMPONENTS: Record<SceneName, React.FC> = {
  signal: Scene1Signal,
  logo: Scene2LogoConstruction,
  idea: Scene3BrandIdea,
  palette: Scene4ColorPalette,
  typography: Scene5Typography,
  graphics: Scene6GraphicSystem,
  icons: Scene7IconSystem,
  applications: Scene8Applications,
  outro: Scene9Outro,
};

/**
 * PAD - Phuoc An Depot, 45 second brand identity debut.
 * Used by both the 16:9 and the 9:16 compositions; scenes adapt to the frame.
 */
export const PADBrandDebut: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.ivory }}>
      {(Object.keys(SCENES) as SceneName[]).map((name) => {
        const Scene = SCENE_COMPONENTS[name];
        return (
          <Sequence
            key={name}
            name={name}
            from={SCENES[name].from}
            durationInFrames={SCENES[name].duration}
            premountFor={30}
          >
            <Scene />
          </Sequence>
        );
      })}
      <Soundtrack />
    </AbsoluteFill>
  );
};
