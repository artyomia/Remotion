import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CraneSilhouette, DuskSky, StackSkyline } from "../art/Dusk";
import { Corridor } from "../art/Corridor";
import { Flash, shakeAt, Streaks, Vignette } from "../fx";
import { SlamBlock } from "../Slam";
import { useStage } from "../stage";
import { COPY, DUSK, SCENE } from "../timeline";

const L = (abs: number) => abs - SCENE.corridor.from;

/**
 * Scene 2 (2.2 to 3.6 s): through the doors and down a lane between walls of
 * containers, the orange route line leading the way.
 * Text: "TỪNG CONTAINER."
 */
export const S02Corridor: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, pick, textY, textX } = useStage();
  const horizonY = pick(H * 0.47, H * 0.5);

  const t = frame;
  const camZ = -1 + t * 1.55 + t * t * 0.018;
  const camX = Math.sin(t / 7) * 0.22;
  const rumble = shakeAt(frame, [{ at: 0, amp: 5, decay: 60 }], "lane");

  return (
    <AbsoluteFill style={{ background: DUSK.skyTop }}>
      <AbsoluteFill
        style={{
          transform: `translate(${rumble.x}px, ${rumble.y}px) scale(1.04)`,
        }}
      >
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <DuskSky W={W} H={H} horizonY={horizonY} />
          <CraneSilhouette x={W * 0.62} groundY={horizonY} scale={0.42} />
          <StackSkyline
            x0={-40}
            x1={W + 40}
            groundY={horizonY}
            unit={14}
            seed="lane-far"
            color={DUSK.silhouetteFar}
          />
        </svg>
        <Corridor W={W} H={H} camZ={camZ} camX={camX} horizonY={horizonY} />
        <Streaks
          W={W}
          H={H}
          y0={0}
          y1={H}
          offset={frame * 60}
          count={14}
          opacity={0.12}
          seed="lane-streak"
        />
      </AbsoluteFill>
      <Vignette strength={0.6} />
      <SlamBlock
        lead={{ text: COPY.container.lead, at: L(70) }}
        lines={[[{ text: COPY.container.main, at: L(72) }]]}
        cx={textX}
        y={textY}
        size={pick(118, 104)}
        exitAt={L(104)}
      />
      <Flash at={0} peak={1} decay={4} color="#FFF6E8" />
    </AbsoluteFill>
  );
};
