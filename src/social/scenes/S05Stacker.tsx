import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../../brand";
import { ContainerSide, CorrugationPattern } from "../../illustrations/kit";
import { progress, tween } from "../../lib/motion";
import { CraneSilhouette, DuskSky, LampPost, StackSkyline } from "../art/Dusk";
import { ReachStackerRig, stackerTip, STACKER_GEOM } from "../art/Rigs";
import { DustBurst, Flash, HBlur, shakeAt, Vignette } from "../fx";
import { SlamBlock } from "../Slam";
import { useStage } from "../stage";
import { COPY, DUSK, SCENE } from "../timeline";

const L = (abs: number) => abs - SCENE.stacker.from;

const STOP = 16; // the machine stops
const REACH_END = 46; // spreader lands on the box
const LOCK = L(234); // twistlocks
const BOX = { w: 420, h: 150, color: "#1E3A8A" };
const PICK = { angle: -9.9, extension: 0.15 };

/**
 * Scene 5 (6.0 to 8.4 s): on the big hit the reach stacker skids into frame,
 * dives on its brakes, lowers the boom onto a blue box, locks the twistlocks
 * and starts to lift. Text: "ĐỀU ĐƯỢC" (the set-up line).
 */
export const S05Stacker: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, pick, textY, textX } = useStage();
  const groundY = pick(H * 0.79, H * 0.86);
  const horizonY = groundY - pick(420, 300);
  const scale = 0.8;
  const frontX = W / 2 - 93 * scale;

  const drive = interpolate(frame, [0, STOP], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const offsetX = drive * 950;
  const wheel = -drive * 520;
  const t = frame - STOP;
  const pitch = t >= 0 ? -2.4 * Math.exp(-t / 5) * Math.cos(t * 0.7) : 0;

  const reach = progress(frame, 18, REACH_END - 18, EASE);
  const lift = progress(frame, LOCK + 3, 16, EASE);
  const boomAngle =
    frame < LOCK
      ? interpolate(reach, [0, 1], [10, PICK.angle])
      : PICK.angle + lift * 8;
  const extension = interpolate(reach, [0, 1], [0.1, PICK.extension]);
  const locked = frame >= LOCK;

  const pickTip = stackerTip(PICK.angle, PICK.extension);
  const boxX = pickTip.x - BOX.w / 2;
  const boxY = pickTip.y + STACKER_GEOM.tipToSpreader - 4;
  const tip = stackerTip(boomAngle, extension);

  const shake = shakeAt(
    frame,
    [
      { at: 0, amp: 18, decay: 6 },
      { at: STOP, amp: 10, decay: 5 },
      { at: LOCK, amp: 7, decay: 4 },
    ],
    "stacker",
  );
  const beacon = Math.max(0, Math.sin(frame * 0.8));
  const toScreen = (x: number, y: number) => ({
    x: frontX + offsetX + x * scale,
    y: groundY + y * scale,
  });
  const lockA = toScreen(tip.x - 280, tip.y + 58);
  const lockB = toScreen(tip.x + 280, tip.y + 58);

  return (
    <AbsoluteFill style={{ background: DUSK.skyTop }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) scale(${tween(frame, [0, 72], [1.06, 1], EASE)})`,
        }}
      >
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <CorrugationPattern id="stk-corr" pitch={12} />
            <HBlur id="stk-blur" amount={drive * 14} />
          </defs>
          <DuskSky W={W} H={H} horizonY={horizonY} />
          <CraneSilhouette x={W * 0.7} groundY={horizonY} scale={0.5} />
          <StackSkyline
            x0={-40}
            x1={W + 40}
            groundY={horizonY}
            unit={24}
            seed="stk-far"
            color={DUSK.silhouetteFar}
          />
          <LampPost
            x={W * 0.12}
            groundY={horizonY + 40}
            height={pick(560, 420)}
            on={1}
          />
          <LampPost
            x={W * 0.9}
            groundY={horizonY + 40}
            height={pick(500, 380)}
            on={1}
          />
          <rect x={0} y={horizonY} width={W} height={H} fill={DUSK.ground} />
          <rect
            x={0}
            y={groundY + 4}
            width={W}
            height={8}
            fill="#FFFFFF"
            opacity={0.08}
          />
          {/* The box waiting on the ground */}
          {!locked ? (
            <g transform={`translate(${frontX} ${groundY}) scale(${scale})`}>
              <ContainerSide
                x={boxX}
                y={boxY}
                w={BOX.w}
                h={BOX.h}
                color={BOX.color}
                patternId="stk-corr"
              />
            </g>
          ) : null}
          <ellipse
            cx={frontX + offsetX + 280 * scale}
            cy={groundY + 4}
            rx={480 * scale}
            ry={26}
            fill="#000"
            opacity={0.35}
          />
          <g
            transform={`translate(${frontX + offsetX} ${groundY}) scale(${scale})`}
            filter="url(#stk-blur)"
          >
            <ReachStackerRig
              boomAngle={boomAngle}
              extension={extension}
              wheel={wheel}
              pitch={pitch}
              spreaderWidth={BOX.w + 40}
              container={locked ? BOX : undefined}
              beacon={beacon}
              patternId="stk-corr"
            />
          </g>
        </svg>
        <DustBurst
          at={STOP - 4}
          x={frontX + 260 * scale}
          y={groundY}
          spread={700 * scale}
          seed="stk-dust"
          color="#6E7891"
          scale={0.9}
        />
        <DustBurst
          at={2}
          x={frontX + 600 * scale + 400}
          y={groundY}
          spread={300}
          seed="stk-dust2"
          color="#6E7891"
          count={20}
          scale={0.7}
        />
        {frame >= LOCK && frame < LOCK + 8 ? (
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            {[lockA, lockB].map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={30 * (1 - (frame - LOCK) / 8)}
                fill="#FFD27A"
                opacity={0.9 * (1 - (frame - LOCK) / 8)}
              />
            ))}
          </svg>
        ) : null}
      </AbsoluteFill>
      <Vignette strength={0.5} />
      <SlamBlock
        lead={{ text: COPY.lift.lead, at: L(216) }}
        lines={[]}
        cx={textX}
        y={textY}
        size={pick(128, 120)}
      />
      <Flash at={0} peak={0.45} decay={3} />
    </AbsoluteFill>
  );
};
