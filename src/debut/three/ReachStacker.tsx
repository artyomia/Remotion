/**
 * Stylised reach stacker modelled on the PAD machine: red body, black boom
 * and spreader, cab on the right, white "PHUOC AN DEPOT" front plate.
 * Local frame: origin on the ground at the machine centre, forward = +x.
 */
import React, { useMemo } from "react";
import * as THREE from "three";
import { WORLD_COLORS } from "../config";
import { makeLogoDecal, makePlate } from "./textures";

export const STACKER = {
  /** Boom pivot in machine-local coordinates (x, y). */
  pivot: [-3.6, 3.3] as const,
  boomLength: 11.5,
  maxExtension: 7.5,
  /** Distance from the boom tip down to the spreader's twistlocks. */
  tipToSpreader: 1.7,
};

export type StackerPose = {
  x: number;
  z: number;
  /** Rotation about y. Forward (+x local) maps to (cos h, 0, -sin h). */
  heading: number;
  /** Boom elevation in radians. */
  boomAngle: number;
  /** Telescopic extension in metres. */
  extension: number;
  /** Spreader width in metres (twistlock to twistlock). */
  spreaderWidth: number;
  /** 0 or 1: amber beacon state. */
  beacon?: number;
};

const toWorld = (pose: StackerPose, lx: number, ly: number, lz: number) => {
  const c = Math.cos(pose.heading);
  const s = Math.sin(pose.heading);
  return new THREE.Vector3(
    pose.x + lx * c + lz * s,
    ly,
    pose.z - lx * s + lz * c,
  );
};

/** Boom tip in machine-local coordinates. */
const tipLocal = (pose: StackerPose) => {
  const len = STACKER.boomLength + pose.extension;
  return [
    STACKER.pivot[0] + len * Math.cos(pose.boomAngle),
    STACKER.pivot[1] + len * Math.sin(pose.boomAngle),
  ] as const;
};

/** World position of the centre of the spreader's twistlock plane. */
export const spreaderBottom = (pose: StackerPose) => {
  const [tx, ty] = tipLocal(pose);
  return toWorld(pose, tx, ty - STACKER.tipToSpreader, 0);
};

/**
 * Boom angle and extension that put the spreader's twistlocks at `target`
 * (which must lie on the machine's centre line).
 */
export const solveBoom = (
  pose: Pick<StackerPose, "x" | "z" | "heading">,
  target: THREE.Vector3,
) => {
  const dx = target.x - pose.x;
  const dz = target.z - pose.z;
  const c = Math.cos(pose.heading);
  const s = Math.sin(pose.heading);
  const lx = dx * c - dz * s;
  const r = lx - STACKER.pivot[0];
  const dy = target.y + STACKER.tipToSpreader - STACKER.pivot[1];
  const boomAngle = Math.atan2(dy, r);
  const extension = Math.min(
    STACKER.maxExtension,
    Math.max(0, Math.hypot(r, dy) - STACKER.boomLength),
  );
  return { boomAngle, extension };
};

type Mats = Record<
  | "red"
  | "boom"
  | "boomInner"
  | "chassis"
  | "tyre"
  | "hub"
  | "glass"
  | "steel"
  | "chrome"
  | "lock"
  | "beaconOn"
  | "beaconOff",
  THREE.Material
>;

const useMaterials = (): Mats =>
  useMemo(() => {
    const std = (color: string, roughness = 0.55, metalness = 0.2) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });
    return {
      red: std(WORLD_COLORS.stackerRed, 0.45, 0.15),
      boom: std(WORLD_COLORS.boom, 0.5, 0.35),
      boomInner: std("#3A3E45", 0.45, 0.4),
      chassis: std(WORLD_COLORS.chassis, 0.7, 0.3),
      tyre: std(WORLD_COLORS.tyre, 0.9, 0),
      hub: std(WORLD_COLORS.hub, 0.4, 0.6),
      glass: new THREE.MeshStandardMaterial({
        color: WORLD_COLORS.glass,
        roughness: 0.08,
        metalness: 0.4,
        transparent: true,
        opacity: 0.72,
      }),
      steel: std("#6B737D", 0.4, 0.6),
      chrome: std("#D3D8DE", 0.15, 0.9),
      lock: std("#F2B705", 0.5, 0.2),
      beaconOn: new THREE.MeshStandardMaterial({
        color: "#FF8A1F",
        emissive: "#FF6A00",
        emissiveIntensity: 2.5,
      }),
      beaconOff: std("#8A4A1A", 0.5, 0.2),
    };
  }, []);

const Box: React.FC<{
  size: [number, number, number];
  position: [number, number, number];
  material: THREE.Material;
  rotation?: [number, number, number];
}> = ({ size, position, material, rotation }) => (
  <mesh
    position={position}
    rotation={rotation}
    material={material}
    castShadow
    receiveShadow
  >
    <boxGeometry args={size} />
  </mesh>
);

const Wheel: React.FC<{
  position: [number, number, number];
  r: number;
  w: number;
  mats: Mats;
}> = ({ position, r, w, mats }) => (
  <group position={position} rotation={[Math.PI / 2, 0, 0]}>
    <mesh material={mats.tyre} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, w, 28]} />
    </mesh>
    <mesh material={mats.hub} position={[0, w / 2 + 0.01, 0]}>
      <cylinderGeometry args={[r * 0.5, r * 0.5, 0.04, 20]} />
    </mesh>
    <mesh material={mats.hub} position={[0, -w / 2 - 0.01, 0]}>
      <cylinderGeometry args={[r * 0.5, r * 0.5, 0.04, 20]} />
    </mesh>
  </group>
);

/** Cylinder spanning two points (machine-local). */
const Strut: React.FC<{
  from: THREE.Vector3;
  to: THREE.Vector3;
  radius: number;
  material: THREE.Material;
}> = ({ from, to, radius, material }) => {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize(),
  );
  return (
    <mesh position={mid} quaternion={q} material={material} castShadow>
      <cylinderGeometry args={[radius, radius, len, 14]} />
    </mesh>
  );
};

export const ReachStacker: React.FC<{ pose: StackerPose }> = ({ pose }) => {
  const mats = useMaterials();
  const plate = useMemo(() => makePlate(), []);
  const decal = useMemo(() => makeLogoDecal("reversed"), []);

  const L = STACKER.boomLength;
  const e = pose.extension;
  const [px, py] = STACKER.pivot;
  const theta = pose.boomAngle;
  const [tx, ty] = tipLocal(pose);

  // Lift cylinders: chassis anchor to a point under the boom.
  const boomPoint = (dist: number, below: number) =>
    new THREE.Vector3(
      px + dist * Math.cos(theta) + below * Math.sin(theta),
      py + dist * Math.sin(theta) - below * Math.cos(theta),
      0,
    );
  const cylTop = boomPoint(4.6, 0.55);

  const sw = pose.spreaderWidth;

  return (
    <group position={[pose.x, 0, pose.z]} rotation={[0, pose.heading, 0]}>
      {/* Wheels: dual front, single rear */}
      {[-1.95, -1.3, 1.3, 1.95].map((z) => (
        <Wheel
          key={`f${z}`}
          position={[3.0, 0.85, z]}
          r={0.85}
          w={0.56}
          mats={mats}
        />
      ))}
      {[-1.55, 1.55].map((z) => (
        <Wheel
          key={`r${z}`}
          position={[-3.3, 0.8, z]}
          r={0.8}
          w={0.6}
          mats={mats}
        />
      ))}

      {/* Chassis and body */}
      <Box
        size={[8.6, 0.7, 2.2]}
        position={[-0.3, 0.95, 0]}
        material={mats.chassis}
      />
      <Box
        size={[4.8, 1.3, 2.6]}
        position={[0.4, 1.65, 0]}
        material={mats.red}
      />
      <Box
        size={[3.0, 2.2, 3.2]}
        position={[-3.5, 2.0, 0]}
        material={mats.red}
      />
      <Box
        size={[0.3, 1.2, 2.4]}
        position={[-5.05, 1.9, 0]}
        material={mats.chassis}
      />
      <Box
        size={[0.6, 0.9, 3.4]}
        position={[4.25, 1.25, 0]}
        material={mats.red}
      />
      {[-1.65, 1.65].map((z) => (
        <Box
          key={z}
          size={[2.2, 0.3, 1.25]}
          position={[3.0, 1.95, z]}
          material={mats.red}
        />
      ))}
      {/* Boom foot bracket */}
      <Box
        size={[1.4, 1.2, 1.6]}
        position={[px, py - 0.35, 0]}
        material={mats.red}
      />

      {/* Front plate "PHUOC AN DEPOT" */}
      <mesh position={[4.56, 1.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 0.45]} />
        <meshStandardMaterial map={plate} roughness={0.6} />
      </mesh>

      {/* Cab on the right-hand side */}
      <group position={[0.6, 3.25, 1.25]}>
        <mesh material={mats.glass} castShadow>
          <boxGeometry args={[1.9, 1.8, 1.2]} />
        </mesh>
        <Box
          size={[2.1, 0.14, 1.4]}
          position={[0, 0.97, 0]}
          material={mats.chassis}
        />
        {[
          [-0.95, -0.6],
          [-0.95, 0.6],
          [0.95, -0.6],
          [0.95, 0.6],
        ].map(([x, z]) => (
          <Box
            key={`${x}${z}`}
            size={[0.1, 1.8, 0.1]}
            position={[x, 0, z]}
            material={mats.chassis}
          />
        ))}
        <mesh
          position={[0.3, 1.15, 0]}
          material={pose.beacon ? mats.beaconOn : mats.beaconOff}
        >
          <cylinderGeometry args={[0.12, 0.12, 0.22, 12]} />
        </mesh>
      </group>
      <Box
        size={[2.2, 0.5, 1.5]}
        position={[0.6, 2.2, 1.25]}
        material={mats.chassis}
      />

      {/* Lift cylinders */}
      {[-0.7, 0.7].map((z) => {
        const base = new THREE.Vector3(1.9, 1.75, z);
        const top = cylTop.clone().setZ(z);
        const split = base.clone().lerp(top, 0.58);
        return (
          <group key={z}>
            <Strut from={base} to={split} radius={0.22} material={mats.steel} />
            <Strut from={split} to={top} radius={0.12} material={mats.chrome} />
          </group>
        );
      })}

      {/* Boom: main section, telescopic inner section, head */}
      <group position={[px, py, 0]} rotation={[0, 0, theta]}>
        <Box
          size={[L, 1.05, 0.85]}
          position={[L / 2, 0, 0]}
          material={mats.boom}
        />
        <Box
          size={[9, 0.82, 0.66]}
          position={[L + e - 4.5, 0, 0]}
          material={mats.boomInner}
        />
        <Box
          size={[1.0, 1.0, 1.1]}
          position={[L + e, 0, 0]}
          material={mats.boom}
        />
        {/* Reversed PAD logo decal on both sides of the boom */}
        {[0.43, -0.43].map((z) => (
          <mesh
            key={z}
            position={[L * 0.45, 0, z]}
            rotation={[0, z > 0 ? 0 : Math.PI, 0]}
          >
            <planeGeometry args={[0.8 * decal.aspect, 0.8]} />
            <meshStandardMaterial
              map={decal.texture}
              transparent
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Spreader hangs vertically under the boom tip */}
      <group position={[tx, ty, 0]}>
        <Box
          size={[0.9, 1.0, 0.9]}
          position={[0, -0.6, 0]}
          material={mats.boom}
        />
        <Box
          size={[0.7, 0.5, sw]}
          position={[0, -1.3, 0]}
          material={mats.boom}
        />
        {[-1, 1].map((side) => (
          <group key={side} position={[0, -1.35, (side * sw) / 2]}>
            <Box
              size={[2.4, 0.6, 0.5]}
              position={[0, 0, 0]}
              material={mats.boom}
            />
            <Box
              size={[0.25, 0.12, 0.25]}
              position={[1.0, -0.32, 0]}
              material={mats.lock}
            />
            <Box
              size={[0.25, 0.12, 0.25]}
              position={[-1.0, -0.32, 0]}
              material={mats.lock}
            />
          </group>
        ))}
      </group>
    </group>
  );
};
