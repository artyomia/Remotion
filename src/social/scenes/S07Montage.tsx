import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS, EASE, EASE_OUT } from "../../brand";
import {
  ContainerSide,
  ContainerTop,
  CorrugationPattern,
} from "../../illustrations/kit";
import { LogoAt, routeD } from "../../illustrations/Mockups";
import { progress, tween } from "../../lib/motion";
import { CraneSilhouette, DuskSky, StackSkyline } from "../art/Dusk";
import { ReachStackerRig, TruckRig, WorkerRig } from "../art/Rigs";
import { Flash, punch, Vignette } from "../fx";
import { Stage, useStage } from "../stage";
import { BEAT, DUSK, YARD_CONTAINERS } from "../timeline";

type ShotProps = { t: number; stage: Stage };

/** 1. A branded box in the middle of a stack. */
const ShotContainer: React.FC<ShotProps> = ({ t, stage }) => {
  const { W, H, pick } = stage;
  const h = pick(330, 250);
  const top = pick(560, 280);
  const slide = -t * 6;
  return (
    <svg width={W} height={H}>
      <defs>
        <CorrugationPattern id="m1-corr" pitch={18} />
      </defs>
      <DuskSky W={W} H={H} horizonY={top} stars={false} />
      <g transform={`translate(${slide} 0)`}>
        <ContainerSide
          x={-400}
          y={top}
          w={2400}
          h={h}
          color="#8E3A2C"
          patternId="m1-corr"
        />
        <ContainerSide
          x={-200}
          y={top + h + 6}
          w={2400}
          h={h}
          color={COLORS.navy}
          patternId="m1-corr"
        />
        <LogoAt
          x={70}
          y={top + h + 6 + h * 0.2}
          height={h * 0.38}
          variant="reversed"
        />
        <path
          d={routeD(-200, top + 2 * h - 20, 520, h * 0.18, W + 600)}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={8}
        />
        <ContainerSide
          x={-600}
          y={top + 2 * h + 12}
          w={2400}
          h={h}
          color="#3D5E8E"
          patternId="m1-corr"
        />
      </g>
      <rect
        x={0}
        y={top + 3 * h + 18}
        width={W}
        height={H}
        fill={DUSK.ground}
      />
    </svg>
  );
};

/** 2. The reach stacker with its plate, a branded box held high. */
const ShotStacker: React.FC<ShotProps> = ({ t, stage }) => {
  const { W, H, pick } = stage;
  const groundY = pick(1520, 1160);
  const scale = pick(1.1, 0.85);
  const horizonY = groundY - pick(520, 380);
  return (
    <svg width={W} height={H}>
      <defs>
        <CorrugationPattern id="m2-corr" pitch={12} />
      </defs>
      <DuskSky W={W} H={H} horizonY={horizonY} />
      <CraneSilhouette x={W * 0.7} groundY={horizonY} scale={0.55} />
      <StackSkyline
        x0={-40}
        x1={W + 40}
        groundY={horizonY}
        unit={26}
        seed="m2"
        color={DUSK.silhouetteFar}
      />
      <rect x={0} y={horizonY} width={W} height={H} fill={DUSK.ground} />
      <g
        transform={`translate(${pick(360, 380) - t * 2} ${groundY}) scale(${scale})`}
      >
        <ReachStackerRig
          boomAngle={58 + t * 0.3}
          extension={0.6}
          wheel={0}
          beacon={Math.max(0, Math.sin(t * 0.8))}
          branded
          spreaderWidth={600}
          container={{ color: COLORS.navy, w: 560, h: 150, branded: true }}
          patternId="m2-corr"
        />
      </g>
    </svg>
  );
};

/** 3. The depot gate at dusk, the logo lightbox glowing. */
const ShotGate: React.FC<ShotProps> = ({ t, stage }) => {
  const { W, H, pick } = stage;
  const boxTop = pick(640, 360);
  const boxH = pick(240, 200);
  const groundY = pick(1620, 1220);
  const logoH = pick(108, 92);
  const logoW = (logoH / 300) * 2325.5;
  return (
    <svg width={W} height={H}>
      <defs>
        <radialGradient id="m3-halo">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.5} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </radialGradient>
      </defs>
      <DuskSky W={W} H={H} horizonY={groundY - 300} />
      <StackSkyline
        x0={-40}
        x1={W + 40}
        groundY={groundY - 300}
        unit={26}
        seed="m3"
        color={DUSK.silhouetteFar}
      />
      <rect x={0} y={groundY - 300} width={W} height={H} fill={DUSK.ground} />
      <ellipse
        cx={W / 2}
        cy={boxTop + boxH / 2}
        rx={W * 0.7}
        ry={boxH * 1.6}
        fill="url(#m3-halo)"
        opacity={0.7 + 0.1 * Math.sin(t)}
      />
      <rect
        x={70}
        y={boxTop + boxH}
        width={130}
        height={groundY - boxTop - boxH}
        fill={COLORS.navy}
      />
      <rect
        x={W - 200}
        y={boxTop + boxH}
        width={130}
        height={groundY - boxTop - boxH}
        fill={COLORS.navy}
      />
      <rect
        x={180}
        y={boxTop + boxH}
        width={20}
        height={groundY - boxTop - boxH}
        fill={COLORS.orange}
      />
      <rect
        x={W - 200}
        y={boxTop + boxH}
        width={20}
        height={groundY - boxTop - boxH}
        fill={COLORS.orange}
      />
      <rect
        x={30}
        y={boxTop - 16}
        width={W - 60}
        height={boxH + 32}
        rx={12}
        fill={COLORS.navy}
      />
      <rect
        x={46}
        y={boxTop}
        width={W - 92}
        height={boxH}
        rx={6}
        fill={COLORS.white}
      />
      <LogoAt
        x={(W - logoW) / 2}
        y={boxTop + (boxH - logoH) / 2}
        height={logoH}
      />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x={200 + i * 60}
          y={groundY - 330}
          width={60}
          height={22}
          fill={i % 2 === 0 ? COLORS.orange : COLORS.white}
        />
      ))}
    </svg>
  );
};

/** 4. Truck cab door with the vertical logo. */
const ShotTruck: React.FC<ShotProps> = ({ t, stage }) => {
  const { W, H, pick } = stage;
  const scale = pick(2.3, 1.8);
  const focus = { x: 1270 + t * 3, y: -250 };
  const sy = pick(960, 700);
  const tx = W / 2 - focus.x * scale;
  const ty = sy - focus.y * scale;
  return (
    <svg width={W} height={H}>
      <defs>
        <CorrugationPattern id="m4-corr" pitch={12} />
      </defs>
      <DuskSky W={W} H={H} horizonY={ty - 700} />
      <rect x={0} y={ty - 20} width={W} height={H} fill={DUSK.ground} />
      <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
        <TruckRig
          wheel={t * 20}
          containerColor={COLORS.navy}
          patternId="m4-corr"
          branded
        />
      </g>
    </svg>
  );
};

/** 5. Hard hat and hi-vis with the logo. */
const ShotWorker: React.FC<ShotProps> = ({ t, stage }) => {
  const { W, H, pick } = stage;
  const scale = pick(2.0, 1.55);
  const groundY = pick(960, 700) + 760 * scale;
  return (
    <svg width={W} height={H}>
      <DuskSky W={W} H={H} horizonY={H * 0.6} />
      <StackSkyline
        x0={-40}
        x1={W + 40}
        groundY={H * 0.6}
        unit={30}
        seed="m5"
        color={DUSK.silhouetteFar}
      />
      <rect x={0} y={H * 0.6} width={W} height={H} fill={DUSK.ground} />
      <g
        transform={`translate(${W / 2 + 40 - t * 2} ${groundY}) scale(${scale})`}
      >
        <WorkerRig
          wave={150 + Math.sin(t * 0.6) * 10}
          branded
          flare={t % 8 < 4 ? 1 : 0}
        />
      </g>
    </svg>
  );
};

/** 6. Aerial: the logo painted on the yard apron. */
const ShotAerial: React.FC<ShotProps> = ({ t, stage }) => {
  const { W, H, pick } = stage;
  const blocks: React.ReactNode[] = [];
  const cw = 150;
  const ch = 52;
  for (let row = 0; row < 14; row++) {
    for (let col = 0; col < 7; col++) {
      const y = row * 150 - 200;
      if (Math.abs(y - H / 2) < pick(330, 260)) {
        continue;
      }
      for (let k = 0; k < 2; k++) {
        blocks.push(
          <ContainerTop
            key={`${row}-${col}-${k}`}
            x={col * 165 - 40}
            y={y + k * (ch + 4)}
            w={cw}
            h={ch}
            color={
              YARD_CONTAINERS[
                Math.floor(
                  random(`aer-${row}-${col}-${k}`) * YARD_CONTAINERS.length,
                )
              ]
            }
          />,
        );
      }
    }
  }
  const logoH = pick(420, 360);
  const logoW = (logoH / 604.2) * 1113;
  const truckX = -200 + t * 40;
  return (
    <svg width={W} height={H}>
      <rect width={W} height={H} fill="#1A2740" />
      {blocks}
      <rect
        x={0}
        y={H / 2 - pick(300, 230)}
        width={W}
        height={pick(600, 460)}
        fill="#22324F"
      />
      <LogoAt
        x={(W - logoW) / 2}
        y={H / 2 - logoH / 2}
        height={logoH}
        lockup="vertical"
        variant="reversed"
      />
      <g transform={`translate(${truckX} ${H / 2 + logoH / 2 + 40})`}>
        <rect width={240} height={60} rx={6} fill={COLORS.navy} />
        <rect x={246} y={6} width={60} height={48} rx={8} fill={COLORS.blue} />
        <path d="M306 10L700 -40V100L306 50Z" fill="#FFE6BF" opacity={0.12} />
      </g>
      {[0.15, 0.85].map((fx) =>
        [0.2, 0.8].map((fy) => (
          <circle
            key={`${fx}-${fy}`}
            cx={W * fx}
            cy={H * fy}
            r={120}
            fill={DUSK.lamp}
            opacity={0.12}
          />
        )),
      )}
    </svg>
  );
};

const SHOTS = [
  ShotContainer,
  ShotStacker,
  ShotGate,
  ShotTruck,
  ShotWorker,
  ShotAerial,
];

/**
 * Scene 9 (14.4 to 18.0 s): the logo out in the world, one shot per beat:
 * container, reach stacker, gate, truck door, hard hat and vest, yard apron.
 */
export const S07Montage: React.FC = () => {
  const frame = useCurrentFrame();
  const stage = useStage();
  const index = Math.min(SHOTS.length - 1, Math.floor(frame / BEAT));
  const t = frame - index * BEAT;
  const Shot = SHOTS[index];
  const zoom = punch(t, 0, 0.12, 9) * tween(t, [0, BEAT], [1, 1.04], EASE);
  const whip = (1 - progress(t, 0, 4, EASE_OUT)) * 16;
  return (
    <AbsoluteFill style={{ background: DUSK.skyTop }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          filter: whip > 0.5 ? `blur(${whip}px)` : undefined,
        }}
      >
        <Shot t={t} stage={stage} />
      </AbsoluteFill>
      <Vignette strength={0.45} />
      <Flash at={index * BEAT} peak={index === 2 ? 0.45 : 0.25} decay={2} />
    </AbsoluteFill>
  );
};
