import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { EASE } from "../../brand";
import { ContainerSide, CorrugationPattern } from "../../illustrations/kit";
import { progress, tween } from "../../lib/motion";
import { CraneSilhouette, DuskSky, LampPost, StackSkyline } from "../art/Dusk";
import { TruckRig } from "../art/Rigs";
import { Vignette } from "../fx";
import { SlamBlock } from "../Slam";
import { useStage } from "../stage";
import { COPY, CUE, DUSK, SCENE, YARD_CONTAINERS } from "../timeline";

const L = (abs: number) => abs - SCENE.together.from;

/**
 * Scene 10 (18.0 to 20.4 s): the breakdown before drop 2. Wide view of the
 * yard at dusk; the lamps switch on one by one on the snare fills and the
 * trucks wait at the gate, headlights on. Text: "CÙNG NHAU,"
 */
export const S08Together: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, pick, textY, textX } = useStage();
  const horizonY = pick(H * 0.58, H * 0.55);
  const groundY = pick(H * 0.8, H * 0.82);
  const push = tween(frame, [0, 72], [1.0, 1.08], EASE);

  const lamps = CUE.fills.map((at, i) => ({
    x: [0.12, 0.38, 0.64, 0.9][i] * W,
    on: progress(frame, L(at), 4),
  }));
  const darkness = 1 - progress(frame, 0, 60) * 0.35;

  // Mid-ground stacks lit by the lamps.
  const stacks: React.ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const tiers = 2 + (i % 3);
    for (let k = 0; k < tiers; k++) {
      stacks.push(
        <ContainerSide
          key={`${i}-${k}`}
          x={-60 + i * 140}
          y={groundY - 120 - (k + 1) * 64}
          w={136}
          h={60}
          color={
            YARD_CONTAINERS[
              Math.floor(random(`tog-${i}-${k}`) * YARD_CONTAINERS.length)
            ]
          }
          patternId="tog-corr"
        />,
      );
    }
  }

  return (
    <AbsoluteFill style={{ background: DUSK.skyTop }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <CorrugationPattern id="tog-corr" pitch={7} />
          </defs>
          <DuskSky W={W} H={H} horizonY={horizonY} glow={0.7} />
          <CraneSilhouette x={W * 0.15} groundY={horizonY} scale={0.5} />
          <CraneSilhouette x={W * 0.68} groundY={horizonY} scale={0.42} />
          <StackSkyline
            x0={-40}
            x1={W + 40}
            groundY={horizonY}
            unit={16}
            seed="tog-far"
            color={DUSK.silhouetteFar}
          />
          <rect x={0} y={horizonY} width={W} height={H} fill={DUSK.ground} />
          <g opacity={0.55 + 0.45 * Math.max(...lamps.map((l) => l.on))}>
            {stacks}
          </g>
          {lamps.map((l, i) => (
            <LampPost
              key={i}
              x={l.x}
              groundY={groundY - 100}
              height={pick(560, 420)}
              on={l.on}
              coneWidth={pick(360, 300)}
            />
          ))}
          <g
            transform={`translate(${W * 0.08} ${groundY + pick(140, 90)}) scale(${pick(0.42, 0.34)})`}
          >
            <TruckRig
              wheel={0}
              containerColor="#8E3A2C"
              patternId="tog-corr"
              headlight={progress(frame, L(CUE.fills[3]), 6)}
            />
          </g>
          <g
            transform={`translate(${-W * 0.5} ${groundY + pick(140, 90)}) scale(${pick(0.42, 0.34)})`}
          >
            <TruckRig
              wheel={0}
              containerColor={YARD_CONTAINERS[0]}
              patternId="tog-corr"
              headlight={progress(frame, L(CUE.fills[2]), 6)}
            />
          </g>
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: "#020814", opacity: 0.35 * darkness }}
      />
      <Vignette strength={0.6} />
      <SlamBlock
        lines={[[{ text: COPY.together, at: L(CUE.fills[1]) }]]}
        cx={textX}
        y={textY}
        size={pick(128, 120)}
      />
    </AbsoluteFill>
  );
};
