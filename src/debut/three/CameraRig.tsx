import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";

/**
 * A camera shot described the way a camera operator thinks about it:
 * what to look at, from which direction, with which lens, and how much of
 * the scene (in metres, vertically, at the target) fills the frame.
 */
export type CameraShot = {
  target: [number, number, number];
  /** Degrees around y; 0 = camera on +z looking towards -z. */
  azimuth: number;
  /** Degrees above the target (negative = looking up). */
  elevation: number;
  /** Vertical field of view in degrees. */
  fov: number;
  /** Visible height at the target distance, in metres. */
  frameHeight: number;
  /** Camera roll in degrees. */
  roll?: number;
  /** Shake offset in metres (screen right, screen up). */
  shake?: [number, number];
};

const rad = (d: number) => (d * Math.PI) / 180;

/** Distance that makes `frameHeight` fill the frame for a given fov. */
export const shotDistance = (shot: CameraShot) =>
  shot.frameHeight / (2 * Math.tan(rad(shot.fov) / 2));

/**
 * Applies a shot to the R3F camera before the frame is drawn and keeps the
 * fog band just behind the subject, so long-lens shots never wash out.
 */
export const CameraRig: React.FC<{ shot: CameraShot }> = ({ shot }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    const d = shotDistance(shot);
    const az = rad(shot.azimuth);
    const el = rad(shot.elevation);
    const target = new THREE.Vector3(...shot.target);
    const offset = new THREE.Vector3(
      Math.sin(az) * Math.cos(el),
      Math.sin(el),
      Math.cos(az) * Math.cos(el),
    ).multiplyScalar(d);
    const pos = target.clone().add(offset);

    // Shake moves camera and target together in screen space.
    const forward = offset.clone().negate().normalize();
    const right = new THREE.Vector3()
      .crossVectors(forward, new THREE.Vector3(0, 1, 0))
      .normalize();
    const up = new THREE.Vector3().crossVectors(right, forward).normalize();
    const [sx, sy] = shot.shake ?? [0, 0];
    const jitter = right
      .clone()
      .multiplyScalar(sx)
      .add(up.clone().multiplyScalar(sy));
    pos.add(jitter);
    target.add(jitter);

    camera.position.copy(pos);
    camera.up.set(0, 1, 0);
    camera.lookAt(target);
    if (shot.roll) {
      camera.rotateZ(rad(shot.roll));
    }
    camera.fov = shot.fov;
    camera.near = Math.max(0.2, d * 0.02);
    camera.far = d + 2500;
    camera.updateProjectionMatrix();

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = d + 30;
      scene.fog.far = d + 320;
    }
  }, [camera, scene, shot]);

  return null;
};

/** Deterministic camera shake: decaying multi-sine noise after a hit. */
export const shakeAt = (
  frame: number,
  hitFrame: number,
  amplitude: number,
  decayFrames = 14,
): [number, number] => {
  const t = frame - hitFrame;
  if (t < 0 || t > decayFrames * 3) return [0, 0];
  const env = amplitude * Math.exp((-t / decayFrames) * 2.2);
  return [
    env * (Math.sin(t * 2.7) * 0.6 + Math.sin(t * 5.3 + 1.1) * 0.4),
    env * (Math.sin(t * 3.1 + 0.4) * 0.6 + Math.sin(t * 6.1 + 2.3) * 0.4),
  ];
};
