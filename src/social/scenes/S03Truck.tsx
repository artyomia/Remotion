import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CorrugationPattern } from "../../illustrations/kit";
import { progress } from "../../lib/motion";
import { CraneSilhouette, DuskSky, LampPost, StackSkyline } from "../art/Dusk";
import { TruckRig } from "../art/Rigs";
import { Flash, HBlur, punch, shakeAt, Streaks, Vignette } from "../fx";
import { SlamBlock } from "../Slam";
import { useStage } from "../stage";
import { COPY, CUE, DUSK, SCENE } from "../timeline";

const L = (abs: number) => abs - SCENE.truck.from;
const CUT_B = L(CUE.accentsA[1]);
const CUT_C = L(CUE.accentsA[2]);

/**
 * Scene 3 (3.6 to 4.8 s): a tractor unit with a 40ft box tears across the
 * frame, cut three times on the three accents: wide, wheels, cab.
 * Text: "TỪNG CHUYẾN XE."
 */
export const S03Truck: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, pick, textY, textX } = useStage();
  const groundY = pick(H * 0.72, H * 0.76);

  const cut = frame < CUT_B ? 0 : frame < CUT_C ? 1 : 2;
  const local = cut === 0 ? frame : cut === 1 ? frame - CUT_B : frame - CUT_C;
  const wheel = frame * 38;

  // Per-cut framing: truck scale, the truck-local point to frame and where
  // on screen it sits. Wide pass, then the wheels, then the cab.
  const shots = [
    {
      scale: pick(0.62, 0.5),
      fx: 700 + (local - 6) * 46,
      fy: -260,
      sy: groundY - 260 * pick(0.62, 0.5),
      blur: 7,
    },
    {
      scale: pick(2.1, 1.7),
      fx: 230 + local * 6,
      fy: -80,
      sy: pick(1250, 900),
      blur: 3,
    },
    {
      scale: pick(1.9, 1.55),
      fx: 1250 + local * 4,
      fy: -260,
      sy: pick(1100, 800),
      blur: 2,
    },
  ] as const;
  const shot = shots[cut];
  const zoom = punch(frame, cut === 0 ? 0 : cut === 1 ? CUT_B : CUT_C, 0.08, 8);
  const tx = W / 2 - shot.fx * shot.scale;
  const ty = shot.sy - shot.fy * shot.scale;
  const horizonY = ty - pick(300, 230) * (cut === 0 ? 1 : 1.9);
  const scroll = frame * (cut === 0 ? 22 : 70);
  const shake = shakeAt(
    frame,
    [
      { at: 0, amp: 8, decay: 6 },
      { at: CUT_B, amp: 10, decay: 5 },
      { at: CUT_C, amp: 12, decay: 5 },
    ],
    "truck",
  );

  return (
    <AbsoluteFill style={{ background: DUSK.skyTop }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) scale(${zoom})`,
        }}
      >
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <CorrugationPattern id="truck-corr" pitch={12} />
            <HBlur id="truck-bg-blur" amount={cut === 0 ? 6 : 18} />
            <HBlur id="truck-blur" amount={shot.blur * progress(frame, 0, 2)} />
          </defs>
          <DuskSky W={W} H={H} horizonY={horizonY} />
          <g filter="url(#truck-bg-blur)">
            <g transform={`translate(${-(scroll * 0.3) % 600} 0)`}>
              <CraneSilhouette x={200} groundY={horizonY} scale={0.4} />
              <CraneSilhouette x={800} groundY={horizonY} scale={0.36} />
              <StackSkyline
                x0={-200}
                x1={W + 800}
                groundY={horizonY}
                unit={20}
                seed="truck-far"
                color={DUSK.silhouetteFar}
              />
            </g>
            <g transform={`translate(${-(scroll * 0.7) % 700} 0)`}>
              {[0, 700, 1400].map((x) => (
                <LampPost
                  key={x}
                  x={x + 260}
                  groundY={ty - 12 * shot.scale}
                  height={pick(420, 330)}
                  on={1}
                  coneWidth={360}
                />
              ))}
            </g>
          </g>
          <rect
            x={0}
            y={ty - 12 * shot.scale}
            width={W}
            height={H}
            fill={DUSK.ground}
          />
          <g transform={`translate(${-(scroll * 1.4) % 220} 0)`}>
            {Array.from({ length: 10 }, (_, i) => (
              <rect
                key={i}
                x={i * 220}
                y={ty + 40 * shot.scale}
                width={120}
                height={8}
                rx={4}
                fill="#FFFFFF"
                opacity={0.25}
              />
            ))}
          </g>
          <g
            transform={`translate(${tx} ${ty}) scale(${shot.scale})`}
            filter="url(#truck-blur)"
          >
            <TruckRig
              wheel={wheel}
              containerColor="#8E3A2C"
              patternId="truck-corr"
            />
          </g>
        </svg>
        <Streaks
          W={W}
          H={H}
          y0={0}
          y1={H}
          offset={scroll * 2}
          count={18}
          opacity={cut === 0 ? 0.16 : 0.28}
          seed={`truck-${cut}`}
        />
      </AbsoluteFill>
      <Vignette strength={0.55} />
      <SlamBlock
        lead={{ text: COPY.truck.lead, at: L(106) }}
        lines={[[{ text: COPY.truck.main, at: L(CUE.accentsA[0]) + 2 }]]}
        cx={textX}
        y={textY}
        size={pick(118, 104)}
        exitAt={L(141)}
      />
      <Flash at={CUT_B} peak={0.3} decay={2} />
      <Flash at={CUT_C} peak={0.3} decay={2} />
      <Flash at={0} peak={0.35} decay={3} />
    </AbsoluteFill>
  );
};
