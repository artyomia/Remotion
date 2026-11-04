import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../../brand";
import { RouteLines } from "../../components/RouteLines";
import { CorrugationPattern } from "../../illustrations/kit";
import { progress } from "../../lib/motion";
import { CraneSilhouette, DuskSky, LampPost, StackSkyline } from "../art/Dusk";
import { ReachStackerRig, TruckRig } from "../art/Rigs";
import { Flash, HBlur, punch, shakeAt, Streaks, Vignette } from "../fx";
import { SlamBlock } from "../Slam";
import { useStage } from "../stage";
import { COPY, CUE, DUSK, SCENE } from "../timeline";

const L = (abs: number) => abs - SCENE.forward.from;

/**
 * Scene 11 (20.4 to 25.2 s): drop 2. Orange route lines burst across the
 * frame and the convoy rolls forward: branded trucks and the reach stacker
 * carrying a branded box, the yard streaming past.
 * Text: "TIẾN VỀ / PHÍA TRƯỚC." word by word on the drum rolls.
 */
export const S09Forward: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, pick, textY, textX } = useStage();
  const groundY = pick(H * 0.81, H * 0.86);
  const horizonY = groundY - pick(470, 360);

  // Camera tracks right; speed kicks on the drop and again near the end.
  const speed = 34 + 18 * progress(frame, 120, 24);
  const scroll = frame * speed;
  const wheel = frame * 26;
  const bob = (seed: number) => Math.sin(frame * 0.9 + seed) * 2.5;

  const impacts = [
    { at: 0, amp: 26, decay: 6 },
    ...CUE.rolls.map((r) => ({ at: L(r), amp: 9, decay: 3 })),
    { at: L(CUE.barC), amp: 16, decay: 5 },
  ];
  const shake = shakeAt(frame, impacts, "forward");
  const zoom = punch(frame, 0, 0.08, 12) * punch(frame, L(CUE.barC), 0.05, 10);
  const truckScale = pick(0.4, 0.32);
  const stackerScale = pick(0.66, 0.52);

  const routeYs = [
    groundY + pick(60, 40),
    groundY - pick(620, 470),
    groundY + pick(150, 100),
  ];

  return (
    <AbsoluteFill style={{ background: DUSK.skyTop }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) scale(${zoom})`,
        }}
      >
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <CorrugationPattern id="fwd-corr" pitch={12} />
            <HBlur id="fwd-bg" amount={8} />
            <HBlur id="fwd-veh" amount={1.5} />
          </defs>
          <DuskSky W={W} H={H} horizonY={horizonY} />
          <g filter="url(#fwd-bg)">
            <g transform={`translate(${-((scroll * 0.15) % 900)} 0)`}>
              {[0, 900, 1800].map((x) => (
                <CraneSilhouette
                  key={x}
                  x={x + 200}
                  groundY={horizonY}
                  scale={0.45}
                />
              ))}
            </g>
            <g transform={`translate(${-((scroll * 0.3) % 1200)} 0)`}>
              <StackSkyline
                x0={0}
                x1={W + 1300}
                groundY={horizonY}
                unit={22}
                seed="fwd-far"
                color={DUSK.silhouetteFar}
              />
            </g>
            <rect x={0} y={horizonY} width={W} height={H} fill={DUSK.ground} />
            <g transform={`translate(${-((scroll * 0.7) % 520)} 0)`}>
              {[0, 520, 1040, 1560].map((x) => (
                <LampPost
                  key={x}
                  x={x + 120}
                  groundY={groundY - 160}
                  height={pick(520, 400)}
                  on={1}
                  coneWidth={340}
                />
              ))}
            </g>
          </g>
          <g transform={`translate(${-((scroll * 1.2) % 240)} 0)`}>
            {Array.from({ length: 9 }, (_, i) => (
              <rect
                key={i}
                x={i * 240}
                y={groundY + 30}
                width={130}
                height={9}
                rx={4}
                fill="#FFFFFF"
                opacity={0.3}
              />
            ))}
          </g>
          {/* Convoy: a truck behind, the reach stacker in front, both rolling right */}
          <g filter="url(#fwd-veh)">
            {/* Far lane: the truck, smaller and higher, partly behind the stacker */}
            <g
              transform={`translate(${pick(40, 60) + frame * 0.8} ${groundY - pick(70, 50) + bob(1)}) scale(${truckScale})`}
            >
              <TruckRig
                wheel={wheel}
                containerColor={COLORS.navy}
                patternId="fwd-corr"
                branded
              />
            </g>
            {/* Near lane: the reach stacker, flipped to drive right */}
            <g
              transform={`translate(${pick(920, 940) + frame * 0.6} ${groundY + pick(90, 60) + bob(2)}) scale(${-stackerScale} ${stackerScale})`}
            >
              <ReachStackerRig
                boomAngle={22}
                extension={0.15}
                wheel={-wheel}
                beacon={Math.max(0, Math.sin(frame * 0.8))}
                branded
                mirrored
                spreaderWidth={600}
                container={{
                  color: COLORS.navy,
                  w: 560,
                  h: 150,
                  branded: true,
                }}
                patternId="fwd-corr"
              />
            </g>
          </g>
        </svg>
        <Streaks
          W={W}
          H={H}
          y0={horizonY - 200}
          y1={H}
          offset={scroll}
          count={20}
          opacity={0.22}
          seed="fwd"
        />
        {routeYs.map((y, i) => (
          <RouteLines
            key={i}
            y={y}
            kinkX={W * (0.3 + i * 0.18)}
            rise={pick(90, 70)}
            start={i * 3}
            duration={12}
            stagger={2}
            parallels={i === 0 ? undefined : []}
            opacity={1 - progress(frame, 100, 30) * (i === 1 ? 1 : 0.5)}
          />
        ))}
      </AbsoluteFill>
      <Vignette strength={0.5} />
      <SlamBlock
        lines={[
          [
            { text: COPY.forward[0][0], at: 0 },
            { text: COPY.forward[0][1], at: L(CUE.rolls[0]) },
          ],
          [
            {
              text: COPY.forward[1][0],
              at: L(CUE.rolls[1]),
              color: COLORS.orange,
            },
            {
              text: COPY.forward[1][1],
              at: L(CUE.rolls[2]),
              color: COLORS.orange,
            },
          ],
        ]}
        cx={textX}
        y={textY}
        size={pick(124, 120)}
        underline
        exitAt={L(CUE.finalHit) - 6}
      />
      <Flash at={0} peak={0.75} decay={4} color="#FFE2C4" />
      <Flash at={L(CUE.barC)} peak={0.3} decay={3} color={COLORS.orange} />
    </AbsoluteFill>
  );
};
