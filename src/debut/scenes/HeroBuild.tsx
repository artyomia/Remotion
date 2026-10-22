/**
 * Scenes 4 and 5 of the debut, "Điểm tựa" and the D slam (7.0 s to 11.6 s).
 *
 * 4a  210-275  Low orbit: the reach stacker lifts the orange block. Message
 *              "MỖI HÀNH TRÌNH / CẦN MỘT ĐIỂM TỰA".
 * 4b  276-284  Close: P drops on snare hit 280.
 *     285-293  Close: A drops on snare hit 289.
 *     294-324  Wide: camera punch on 303, the D comes down from 316.
 * 5   325-352  Drop 1: the D slams in, the blocks carve into the letters,
 *              dolly-zoom flattens the 3D monogram into the flat logo.
 */
import { ThreeCanvas } from "@remotion/three";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { COLORS, EASE_OUT } from "../../brand";
import { hitSpring, lerp, progress } from "../../lib/motion";
import { SlamText } from "../components/SlamText";
import { Sky } from "../components/Sky";
import {
  CUE,
  D_CENTER_X,
  D_WIDTH_M,
  LETTER_DEPTH,
  MESSAGE,
  MONO_HEIGHT_M,
  MONO_X0,
  M_PER_UNIT,
  WORLD_COLORS,
} from "../config";
import { CameraRig, CameraShot, shakeAt } from "../three/CameraRig";
import { ImpactEffects, Impact } from "../three/Effects";
import { LetterBlocks, LetterState } from "../three/LetterBlocks";
import { ReachStacker, StackerPose, solveBoom } from "../three/ReachStacker";
import { Yard } from "../three/Yard";

/** First absolute frame this component is mounted at (see PADLogoDebut). */
export const HERO_FROM = 200;
export const HERO_TO = 353;

const [HIT_P, HIT_A, HIT_PUNCH, D_RELEASE] = CUE.buildHits;
const SLAM = CUE.drop1;

const P_X = MONO_X0 + 196.9 * M_PER_UNIT;
const A_X = MONO_X0 + 511.3 * M_PER_UNIT;
const linear = (t: number) => t;

/* ------------------------------ camera ----------------------------------- */

/**
 * Visible height (metres) at the end of the dolly-zoom. With the 30 m
 * monogram this makes it 860 px wide on a 1080 px frame, exactly where the
 * 2D logo takes over.
 */
export const FLAT_FRAME_HEIGHT = 67.06;

const shotAt = (f: number): CameraShot => {
  if (f < 276) {
    const t = progress(f, 210, 66);
    return {
      target: [D_CENTER_X - 1, 9.2, -3.5],
      azimuth: lerp(55, 80, t),
      elevation: lerp(-15, -9, t),
      fov: lerp(50, 44, t),
      frameHeight: lerp(26, 22.5, t),
    };
  }
  if (f < 285) {
    return {
      target: [P_X, 3.8, -1.2],
      azimuth: 18,
      elevation: 4,
      fov: 48,
      frameHeight: lerp(16, 14, progress(f, 276, 9, linear)),
      shake: shakeAt(f, HIT_P, 0.35, 10),
    };
  }
  if (f < 294) {
    return {
      target: [A_X, 3.8, -1.2],
      azimuth: -22,
      elevation: 5,
      fov: 48,
      frameHeight: lerp(16, 14, progress(f, 285, 9, linear)),
      shake: shakeAt(f, HIT_A, 0.35, 10),
    };
  }
  if (f < SLAM) {
    const t = progress(f, 294, 31, linear);
    const punch = f < HIT_PUNCH ? 0 : progress(f, HIT_PUNCH, 5, EASE_OUT);
    return {
      target: [1.5, 8, -1.2],
      azimuth: lerp(24, 18, t),
      elevation: lerp(9, 7, t),
      fov: 34,
      frameHeight: lerp(62, 58, t) - 4 * punch,
      shake: shakeAt(f, HIT_PUNCH, 0.3, 10),
    };
  }
  // Drop 1: dolly-zoom from a 3/4 view to a flat, front-on long-lens view.
  const t = progress(f, SLAM + 2, 22);
  return {
    target: [lerp(1.5, 0, t), lerp(8, MONO_HEIGHT_M / 2, t), lerp(-1.2, 0, t)],
    azimuth: lerp(18, 0, t),
    elevation: lerp(7, 0, t),
    fov: Math.exp(lerp(Math.log(34), Math.log(6), t)),
    frameHeight: lerp(58, FLAT_FRAME_HEIGHT, t),
    shake: shakeAt(f, SLAM, 1.2, 16),
  };
};

/* ------------------------------ action ----------------------------------- */

/** Height of the D block's base while it hangs from the spreader. */
const dBottom = (f: number) => {
  if (f < 276) return lerp(4.0, 6.8, progress(f, 210, 60));
  if (f < D_RELEASE) return 6.8 + 0.12 * Math.sin((f - 276) * 0.35);
  if (f < SLAM)
    return lerp(
      6.8,
      0,
      Math.pow(progress(f, D_RELEASE, SLAM - D_RELEASE, linear), 2.2),
    );
  return 0;
};

/** A dropped letter: falls with gravity, lands on its beat, small bounce. */
const dropY = (f: number, land: number, fall = 4, height = 32) => {
  if (f < land - fall) return height;
  if (f < land) {
    const t = (f - (land - fall)) / fall;
    return height * (1 - t * t);
  }
  const t = f - land;
  return t < 6 ? 0.35 * Math.sin((Math.PI * t) / 6) * (1 - t / 6) : 0;
};

const STACKER_BASE = { x: D_CENTER_X, z: -10.5, heading: -Math.PI / 2 };

const holdTarget = (f: number) =>
  new THREE.Vector3(
    D_CENTER_X + (f < D_RELEASE ? 0.18 * Math.sin(f * 0.12) : 0),
    dBottom(f) + MONO_HEIGHT_M,
    -LETTER_DEPTH / 2,
  );

const stackerAt = (f: number): StackerPose => {
  const common = {
    spreaderWidth: D_WIDTH_M - 0.8,
    beacon: Math.floor(f / 8) % 2,
  };
  if (f < SLAM + 6) {
    return {
      ...STACKER_BASE,
      ...common,
      ...solveBoom(STACKER_BASE, holdTarget(f)),
    };
  }
  // Released: the machine lowers the boom and pulls away to the right, out
  // of the D's open counter and out of the front-on frame.
  const atSlam = solveBoom(STACKER_BASE, holdTarget(SLAM));
  const t = progress(f, SLAM + 6, 18);
  return {
    ...STACKER_BASE,
    ...common,
    x: STACKER_BASE.x + 16 * t,
    z: STACKER_BASE.z - 6.5 * t,
    boomAngle: lerp(atSlam.boomAngle, 0.22, t),
    extension: lerp(atSlam.extension, 0, t),
  };
};

const IMPACTS: Impact[] = [
  { frame: HIT_P, x: P_X, z: 0, spread: 5, power: 0.75 },
  { frame: HIT_A, x: A_X, z: 0, spread: 5, power: 0.75 },
  { frame: SLAM, x: 0, z: 0, spread: 15, power: 2.1 },
];

/* ------------------------------ component -------------------------------- */

const World: React.FC<{ f: number; shot: CameraShot }> = ({ f, shot }) => {
  const { fps } = useVideoConfig();
  const sway = f < D_RELEASE ? 0.18 * Math.sin(f * 0.12) : 0;
  const morph = progress(f, SLAM, 7, EASE_OUT);
  const letters: Record<"P" | "A" | "D", LetterState> = {
    P: { offset: [0, dropY(f, HIT_P), 0], morph, visible: f >= 276 },
    A: { offset: [0, dropY(f, HIT_A), 0], morph, visible: f >= HIT_A - 4 },
    D: { offset: [sway, dBottom(f), 0], morph, visible: true },
  };
  const pop =
    f < SLAM ? 1 : interpolate(hitSpring(f, fps, SLAM), [0, 1], [1.05, 1]);
  return (
    <>
      <fog attach="fog" args={[WORLD_COLORS.horizon, 60, 400]} />
      <CameraRig shot={shot} />
      <Yard />
      <ReachStacker pose={stackerAt(f)} />
      <LetterBlocks {...letters} pop={pop} />
      <ImpactEffects impacts={IMPACTS} frame={f} />
    </>
  );
};

export const HeroBuild: React.FC = () => {
  const local = useCurrentFrame();
  const f = local + HERO_FROM;
  const { width, height } = useVideoConfig();
  const shot = shotAt(f);
  const flash = interpolate(f, [SLAM, SLAM + 1, SLAM + 9], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill>
      <Sky shot={shot} width={width} height={height} />
      <ThreeCanvas
        width={width}
        height={height}
        shadows="percentage"
        camera={{ fov: 45, near: 0.2, far: 3000, position: [0, 10, 40] }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <World f={f} shot={shot} />
      </ThreeCanvas>
      {/* Gentle vignette for depth */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(15,46,91,0.28) 100%)",
        }}
      />
      {/* Navy grade under the message so it reads over busy stacks */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, rgba(15,46,91,0) 45%, rgba(15,46,91,0.82) 100%)`,
          opacity: Math.min(progress(f, 234, 6), 1 - progress(f, 272, 5)),
        }}
      />
      {f < 278 ? (
        <SlamText
          frameOffset={HERO_FROM}
          width={width}
          y={height * 0.66}
          size={84}
          exitAt={272}
          lines={[
            { parts: [{ text: MESSAGE.pivotA, color: COLORS.white }], at: 240 },
            {
              parts: [
                { text: MESSAGE.pivotB[0], color: COLORS.white },
                { text: MESSAGE.pivotB[1], color: COLORS.orange },
              ],
              at: 267,
            },
          ]}
        />
      ) : null}
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
    </AbsoluteFill>
  );
};
