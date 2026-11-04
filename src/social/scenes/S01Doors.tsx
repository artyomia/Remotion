import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../../brand";
import { progress, tween } from "../../lib/motion";
import { DoorRibs, ContainerDoor } from "../art/Rigs";
import { Impact, shakeAt } from "../fx";
import { useStage } from "../stage";
import { CUE, DUSK } from "../timeline";

const DOOR_COLOR = "#0F2E5B";

/**
 * Scene 1 (0 to 2.2 s): extreme close-up of a container's doors in the dark.
 * The lock handles snap open on the first bar, then both doors swing
 * towards the camera on the first accent and light floods out.
 */
export const S01Doors: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H } = useStage();

  // Container end fills the frame width; doors swing in 3D towards camera.
  const doorW = W / 2;
  const doorH = Math.round(W * 1.06);
  const top = (H - doorH) / 2;

  const handle = progress(
    frame,
    CUE.firstBar - 2,
    6,
    Easing.out(Easing.back(2)),
  );
  const open = interpolate(frame, [CUE.doorHit - 3, CUE.doorHit + 6], [0, 1], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const angle = open * 84;
  const creak =
    frame >= CUE.doorHit - 14 && frame < CUE.doorHit - 3
      ? Math.sin(frame * 3.1) * 1.2 * progress(frame, CUE.doorHit - 14, 8)
      : 0;

  const impacts: Impact[] = [
    { at: CUE.firstBar - 1, amp: 10, decay: 4 },
    { at: CUE.doorHit, amp: 22, decay: 5 },
  ];
  const shake = shakeAt(frame, impacts, "doors");
  const push = tween(frame, [0, CUE.doorHit + 4], [1.0, 1.12], EASE);
  const light = progress(frame, CUE.doorHit - 2, 5);

  const doorSvg = (side: "left" | "right") => (
    <svg width={doorW} height={doorH} style={{ display: "block" }}>
      <defs>
        <DoorRibs id={`ribs-${side}`} />
      </defs>
      <ContainerDoor
        w={doorW}
        h={doorH}
        side={side}
        color={DOOR_COLOR}
        handle={handle}
        code={side === "right"}
        ribId={`ribs-${side}`}
      />
    </svg>
  );

  return (
    <AbsoluteFill style={{ background: DUSK.skyTop }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) scale(${push})`,
        }}
      >
        {/* Light behind the doors */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top,
            width: W,
            height: doorH,
            background:
              "radial-gradient(ellipse at 50% 50%, #FFFFFF 0%, #FFF3DE 30%, #FFB062 62%, #2A3C70 100%)",
            opacity: 0.2 + light * 0.8,
          }}
        />
        {/* Frame of the container: top and bottom rails, neighbours above and below */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: top - 40,
            width: W,
            height: 40,
            background: "#0A1F40",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: top + doorH,
            width: W,
            height: 60,
            background: "#0A1F40",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W,
            height: top - 40,
            background: "linear-gradient(#050F22, #173070)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: top + doorH + 60,
            width: W,
            height: H,
            background: "linear-gradient(#5A2620, #050F22)",
          }}
        />
        {/* Doors */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top,
            width: W,
            height: doorH,
            perspective: 1300,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transformOrigin: "left center",
              transform: `rotateY(${-angle + creak}deg)`,
              backfaceVisibility: "hidden",
            }}
          >
            {doorSvg("left")}
          </div>
          <div
            style={{
              position: "absolute",
              left: doorW,
              top: 0,
              transformOrigin: "right center",
              transform: `rotateY(${angle - creak}deg)`,
              backfaceVisibility: "hidden",
            }}
          >
            {doorSvg("right")}
          </div>
        </div>
      </AbsoluteFill>
      {/* Flood of light into the next scene */}
      <AbsoluteFill
        style={{
          background: "#FFF6E8",
          opacity: progress(frame, CUE.doorHit, 3),
        }}
      />
    </AbsoluteFill>
  );
};
