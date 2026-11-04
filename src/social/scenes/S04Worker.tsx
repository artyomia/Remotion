import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE, EASE_OUT } from "../../brand";
import { CorrugationPattern } from "../../illustrations/kit";
import { progress, tween } from "../../lib/motion";
import { CraneSilhouette, DuskSky, LampPost, StackSkyline } from "../art/Dusk";
import { ReachStackerRig, WorkerRig } from "../art/Rigs";
import { Flash, shakeAt, Vignette } from "../fx";
import { SlamBlock } from "../Slam";
import { useStage } from "../stage";
import { COPY, DUSK, SCENE, STACKER } from "../timeline";

const L = (abs: number) => abs - SCENE.worker.from;

/**
 * Scene 4 (4.8 to 6.0 s): a yard worker in hard hat and hi-vis raises an
 * arm to guide a machine in; its amber beacon pulses behind him.
 * Text: "TỪNG CON NGƯỜI."
 */
export const S04Worker: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, pick, textY, textX } = useStage();
  const groundY = pick(H * 0.9, H * 0.93);
  const horizonY = pick(H * 0.56, H * 0.56);

  const raise = progress(frame, 0, 9, EASE_OUT);
  const wave =
    20 + raise * 140 + (frame > 9 ? Math.sin((frame - 9) * 0.7) * 14 : 0);
  const beacon = Math.max(0, Math.sin(frame * 0.9));
  const push = tween(frame, [0, 36], [1.0, 1.06], EASE);
  const shake = shakeAt(frame, [{ at: 0, amp: 8, decay: 5 }], "worker");
  const workerScale = pick(1.0, 0.68);

  return (
    <AbsoluteFill style={{ background: DUSK.skyTop }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) scale(${push})`,
        }}
      >
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <CorrugationPattern id="worker-corr" pitch={12} />
          </defs>
          <DuskSky W={W} H={H} horizonY={horizonY} />
          <CraneSilhouette x={W * 0.08} groundY={horizonY} scale={0.5} />
          <StackSkyline
            x0={-40}
            x1={W + 40}
            groundY={horizonY}
            unit={22}
            seed="worker-far"
            color={DUSK.silhouetteFar}
          />
          <rect x={0} y={horizonY} width={W} height={H} fill={DUSK.ground} />
          {/* Machine waiting in the background, soft focus */}
          <g style={{ filter: "blur(5px)" }} opacity={0.85}>
            <g
              transform={`translate(${W * 0.55} ${horizonY + pick(250, 190)}) scale(${pick(0.5, 0.4)})`}
            >
              <ReachStackerRig
                boomAngle={12}
                extension={0.1}
                wheel={0}
                beacon={beacon}
                patternId="worker-corr"
              />
            </g>
            <LampPost
              x={W * 0.18}
              groundY={horizonY + 60}
              height={pick(520, 380)}
              on={1}
            />
          </g>
          <circle
            cx={W * 0.55 + 292 * pick(0.5, 0.4)}
            cy={horizonY + pick(250, 190) - 500 * pick(0.5, 0.4)}
            r={pick(220, 170)}
            fill={STACKER.beacon}
            opacity={0.18 * beacon}
          />
          {/* Worker */}
          <ellipse
            cx={W / 2}
            cy={groundY}
            rx={160 * workerScale}
            ry={22 * workerScale}
            fill="#000"
            opacity={0.35}
          />
          <g transform={`translate(${W / 2} ${groundY}) scale(${workerScale})`}>
            <WorkerRig wave={wave} flare={beacon > 0.6 ? 1 : 0} />
          </g>
        </svg>
      </AbsoluteFill>
      <Vignette strength={0.55} />
      <SlamBlock
        lead={{ text: COPY.people.lead, at: L(142) }}
        lines={[[{ text: COPY.people.main, at: L(146) }]]}
        cx={textX}
        y={textY}
        size={pick(118, 104)}
        exitAt={L(177)}
      />
      <Flash at={0} peak={0.35} decay={3} />
    </AbsoluteFill>
  );
};
